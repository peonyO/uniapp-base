import { onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getImageInfo, getOSSImageInfo, getStorage, hasOwn, setStorage } from "@/common";
import { useUserStore } from "@/store";

/**
 * 图片缓存 MGImage 组件中使用
 */
export function useCacheImage() {
  const { resolveStaticUrl } = useUserStore();
  const fs = uni.getFileSystemManager();

  async function cacheImage(src: string, isVerify = true) {
    if (src) {
      /** 获取半路径 */
      const halfSrc = src.replace(`${import.meta.env.VITE_OSS_SERVICE_URL}/`, "");
      /** 使用半路径将/转换位_后并去除后缀作为名称，然后去除特殊符号和空格 */
      const imageName = halfSrc
        .replace(/\//g, "_")
        .replace(/\./g, "")
        .replace(/[\s\W]/g, "");
      /** 获取缓存的图片列表 */
      const imageListStorage = getStorage("cacheImage") || {};
      /** 如果图片已经存在缓存中，则直接返回缓存的路径 */
      const isHasImageName = hasOwn(imageListStorage, imageName);
      if (isHasImageName) {
        const cacheImageInfo = imageListStorage[imageName];
        if (isVerify) {
          try {
            const imageInfo = await getOSSImageInfo(resolveStaticUrl(halfSrc));
            if (Number(imageInfo.FileSize.value) === cacheImageInfo.size) {
              return cacheImageInfo.src;
            } else {
              return await saveImage(resolveStaticUrl(halfSrc), imageName);
            }
          } catch (error) {
            return cacheImageInfo.src;
          }
        } else {
          return cacheImageInfo.src;
        }
      } else {
        return await saveImage(resolveStaticUrl(halfSrc), imageName);
      }
    } else {
      return "";
    }
  }

  /**
   * 保存图片到用户本地
   */
  async function saveImage(ossImageSrc: string, imageName: string) {
    try {
      const ossImageInfo = await getImageInfo(ossImageSrc);
      const savedFilePath = fs.saveFileSync(ossImageInfo.path);
      const savedFileSize = await getCacheImageInfo(ossImageInfo.path);
      const cacheImageInfo = {
        src: savedFilePath,
        size: savedFileSize
      };
      const imageListStorage = getStorage("cacheImage") || {};
      setStorage("cacheImage", {
        ...imageListStorage,
        [imageName]: cacheImageInfo
      });
      return savedFilePath;
    } catch (error) {
      return "";
    }
  }

  /**
   * 获取本地缓存图片的大小
   * @param imageSrc 半路径
   * @returns
   */
  const getCacheImageInfo = (imageSrc: string) => {
    return new Promise<UniApp.GetFileInfoSuccessCallbackResult["size"]>((resolve, reject) => {
      fs.getFileInfo({
        filePath: imageSrc,
        success: (imageInfo) => {
          resolve(imageInfo.size);
        },
        fail: () => {
          reject();
        }
      });
    });
  };

  return {
    cacheImage
  };
}

/**
 * 图片缓存 页面中使用
 */
export function useActivePageCacheImage(imageSrc: string) {
  const { cacheImage } = useCacheImage();

  const cacheImageSrc = ref("");

  onLoad(async () => {
    cacheImageSrc.value = await cacheImage(imageSrc);
  });

  return cacheImageSrc;
}

/**
 * 图片缓存 自定义组件中使用
 */
export function useActiveComponentCacheImage(imageSrc: string) {
  const { cacheImage } = useCacheImage();

  const cacheImageSrc = ref("");

  onMounted(async () => {
    cacheImageSrc.value = await cacheImage(imageSrc);
  });

  return cacheImageSrc;
}
