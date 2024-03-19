<template>
  <view class="image">
    <template v-if="loadStatus === 'success'">
      <image :src="imageSrc" :mode="props.mode" :style="customStyle" />
      <slot></slot>
    </template>
    <template v-if="loadStatus === 'error'">
      <view class="image_error" :style="customStyle">图片加载失败</view>
    </template>
  </view>
</template>

<script lang="ts" setup>
/**
 * 禁止在循环中使用 CacheImage 模式，如需要需要循环使用缓存图，请使用 useActivePageCacheImage 或者 useActiveComponentCacheImage
 */
import { ref, type CSSProperties, watch } from "vue";
import { getOSSImageColor } from "@/common";
import { useCacheImage } from "@/hooks";

interface ImageProps {
  /** 图片地址 */
  src: string;
  /** 图片模式 */
  mode?: ImageMode;
  /** 自定义样式 */
  customStyle?: string | CSSProperties;
  /** 是否使用缓存 */
  isCacheImage?: boolean;
}
const props = withDefaults(defineProps<ImageProps>(), {
  mode: "scaleToFill",
  customStyle: "width: 320rpx;height: 200rpx;",
  isCacheImage: false
});

const { cacheImage } = useCacheImage();

const imageSrc = ref("");
const loadStatus = ref<"loading" | "error" | "success">("loading");
const imageBackground = ref("#f5f5f5");

watch(
  () => props.src,
  async () => {
    if (props.isCacheImage) {
      loadStatus.value = "loading";
      imageBackground.value = await getOSSImageColor(props.src);
      imageSrc.value = "";
      imageSrc.value = await cacheImage(props.src);
      loadStatus.value = "success";
    } else {
      loadStatus.value = "success";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.image {
  position: relative;
  display: inline-block;
  background-color: v-bind("imageBackground");

  .image_error {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20rpx;
  }
}
</style>
