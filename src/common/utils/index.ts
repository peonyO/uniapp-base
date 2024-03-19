export const isObject = (value: unknown): value is Record<any, any> => value !== null && typeof value === "object";
export const isFunction = (value: unknown): value is Function => typeof value === "function";
export const isString = (value: unknown): value is string => typeof value === "string";
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isNumber = (value: unknown): value is number => typeof value === "number";
export const isUndef = (value: unknown): value is undefined => typeof value === "undefined";
export const isArray = (value: unknown): value is any[] => Array.isArray(value);
/**
 * 校验是否以 http/https 开头
 */
export function isHttp(path: string) {
  return /^(http|https):\/\//.test(path);
}
export const invalidQueryValues = ["undefined", "null", ""];
/**
 * 序列化地址信息
 * @param {String} url 地址信息
 * @param {Object} [params={}] 参数信息
 * @return {String} 拼接完成后的完整地址
 */
export function serializeUrl<T extends AnyObject>(url: string, params?: T): string {
  if (params) {
    let queryString = "";
    if (!url.match(/\?/)) {
      queryString += "?";
    }
    for (const key in params) {
      const value = params[key];
      if (~invalidQueryValues.indexOf(value + "")) {
        continue;
      }
      queryString += `&${key}=${value}`;
    }
    url = url + queryString;
    url = url.replace(/\?&/, "?").replace(/\?$/, "");
  }
  return url;
}

/**
 * 获取相对路径
 * @param pagePath 页面路径
 */
export function getRelativePath(pagePath: string) {
  // 掐头去尾
  return pagePath.replace(/^\//, "").replace(/\?.*/, "");
}

const queryParamPattern = /([^&]+)\=([^&]+)/;
/**
 * 获取地址中的所有参数（去除无效参数后）
 * @param url 地址
 * @returns 地址?后的参数
 */
export function getUrlParams(url: string) {
  const queryIndex = url.indexOf("?");
  if (~queryIndex) {
    const queryString = url.substring(queryIndex + 1);
    const params: any = {};
    queryString.split("&").forEach((param) => {
      const matches = param.match(queryParamPattern);
      if (matches) {
        const key = matches[1];
        const value = matches[2];
        // 过滤一下无效的值
        if (!~invalidQueryValues.indexOf(value)) {
          params[key] = value;
        }
      }
    });
    return params;
  }
  return {};
}

/**
 * 删除对象中为false的键值对
 */
export function removeEmptyValues(obj: AnyObject) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null && value !== ""));
}

/**
 * 检测对象自身属性中是否具有指定的属性
 */
const _hasOwnPrototype = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Object, key: string) {
  return _hasOwnPrototype.call(obj, key);
}

/**
 * 获取系统信息
 */
export function getSystemInfo() {
  const systemInfo = uni.getSystemInfoSync();
  const { safeAreaInsets, windowWidth } = systemInfo;
  /**
   * 胶囊按钮大小位置信息
   */
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect
    ? uni.getMenuButtonBoundingClientRect()
    : {
        left: windowWidth - 16 - 18 - 20
      };
  /**
   * 头部导航栏高度
   */
  const navbarHeight = 44 + (systemInfo.statusBarHeight || 0);
  const titleHeight = 44;
  /**
   * 可见内容区高度
   */
  const mainHeight = systemInfo.windowHeight - navbarHeight;
  /**
   * 底部安全区
   */
  const safeAreaHeight = safeAreaInsets?.bottom || 0;
  const safeAreaMethod = (paddingBottom?: number) => {
    if (safeAreaHeight) {
      return `${safeAreaHeight}px`;
    } else {
      return `${paddingBottom || 0}rpx`;
    }
  };
  /**
   * 底部导航栏
   */
  const controlHeight = 48;
  const tabbarHeight = 48 + safeAreaHeight;

  return {
    ...systemInfo,
    menuButtonInfo,
    navbarHeight,
    titleHeight,
    mainHeight,
    safeAreaHeight,
    safeAreaMethod,
    tabbarHeight,
    controlHeight
  };
}

/**
 * 获取图片信息，包含 宽高以及本地图片路径
 * @param imageSrc
 * @returns
 */
export const getImageInfo = (ossImageSrc: string) => {
  return new Promise<GetImageInfoSuccessData>((resolve, reject) => {
    uni.getImageInfo({
      src: ossImageSrc,
      success: (imageInfo) => {
        const fileName = ossImageSrc.substring(ossImageSrc.lastIndexOf("/") + 1);
        resolve({ ...imageInfo, fileName, ossImageSrc: ossImageSrc });
      },
      fail: () => {
        reject({
          status: 500,
          message: "该图片不存在"
        });
      }
    });
  });
};
