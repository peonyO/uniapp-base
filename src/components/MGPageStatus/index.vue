<template>
  <view class="container">
    <template v-if="props.status === 'loading'">
      <view class="container_loading">
        <view class="loading_icon">
          <image :src="loadingIcon" class="loading_icon_image" />
        </view>
        <view class="loading_title">加载中...</view>
      </view>
    </template>
    <template v-if="props.status === 'serviceError' || props.status === 'error'">
      <view class="container_loading">
        <view class="empty_image">
          <image src="@/assets/common/service_error.png" class="empty_image_context" />
        </view>
        <view class="loading_title">{{ errorContent }}</view>
      </view>
    </template>
    <template v-if="props.status === 'empty'">
      <view class="container_loading">
        <view class="empty_image">
          <image src="@/assets/common/empty_icon.png" class="empty_image_context" />
        </view>
        <view class="loading_title">暂无数据</view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { getSystemInfo } from "@/common";
import loadingIcon from "@/assets/common/loading.gif";

interface Props {
  customHeight?: string;
  status?: "success" | "loading" | "error" | "serviceError" | "empty";
}

const props = withDefaults(defineProps<Props>(), {
  status: "loading"
});
const { statusBarHeight, windowHeight } = getSystemInfo();

const containerHeight = computed(() => {
  return props.customHeight || windowHeight - (statusBarHeight || 0) - 44 + "px";
});

const errorContent = computed(() => {
  if (props.status === "error") {
    return "当前网络不可用，请检查后重试";
  } else if (props.status === "serviceError") {
    return "服务器异常，请联系管理员";
  } else {
    return "";
  }
});
</script>

<style lang="scss">
.container {
  height: v-bind("containerHeight");
  .container_loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .loading_icon {
      margin-bottom: 10rpx;
      .loading_icon_image {
        width: 100rpx;
        height: 90rpx;
      }
    }
    .loading_title {
      color: #bababa;
      font-size: 28rpx;
    }
    .empty_image {
      margin-bottom: 70rpx;
      .empty_image_context {
        width: 500rpx;
        height: 325rpx;
      }
    }
  }
}
</style>
