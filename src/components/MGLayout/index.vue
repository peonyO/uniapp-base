<template>
  <view class="page_container">
    <!-- #ifndef H5 -->
    <template v-if="props.isShowNavbar">
      <template v-if="props.isCustomNavbarTitle">
        <MGNavbar
          :isBack="props.navbarInfo?.isBack"
          :isLoading="props.navbarInfo?.isLoading"
          :title="props.navbarInfo?.title"
          :color="props.navbarInfo?.color"
          :backgroundColor="props.navbarInfo?.backgroundColor"
        >
          <slot name="navbarTitle" />
        </MGNavbar>
      </template>
      <template v-else>
        <MGNavbar
          :isBack="props.navbarInfo?.isBack"
          :isLoading="props.navbarInfo?.isLoading"
          :title="props.navbarInfo?.title"
          :color="props.navbarInfo?.color"
          :backgroundColor="props.navbarInfo?.backgroundColor"
        />
      </template>
    </template>
    <!-- #endif -->
    <template v-if="props.pageStatus === 'success'">
      <scroll-view :scroll-y="props.scrollY" class="page_scroll_view">
        <slot name="default" />
      </scroll-view>
      <MGTabbar v-if="isShowTabbar" :tabbarList="tabbarInfo?.tabbarList" />
    </template>
    <template v-else>
      <MGPageStatus :customHeight="pageStautsHeight" :status="props.pageStatus" />
    </template>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import MGNavbar from "@/components/MGNavbar/index.vue";
import MGPageStatus from "@/components/MGPageStatus/index.vue";
import MGTabbar from "@/components/MGTabbar/index.vue";
import { getSystemInfo, initGUID, setGlobalData } from "@/common";

interface NavigationProps {
  isBack?: boolean;
  isLoading?: boolean;
  title?: string;
  color?: string;
  backgroundColor?: string;
}

interface TabbarProps {
  tabbarList: {
    [key: string]: any;
    icon: string;
    activeIcon: string;
    title: string;
  }[];
  defaultIndex?: number;
  backgroundColor?: string;
  color?: string;
  activeColor?: string;
}

interface LayoutProps {
  /** navbar 配置信息 */
  navbarInfo?: NavigationProps;
  /** 是否显示导航栏 */
  isShowNavbar?: boolean;
  /** tabbar配置信息 */
  tabbarInfo?: TabbarProps;
  /** 是否显示 tabbar */
  isShowTabbar?: boolean;
  /** 是否自定义导航栏标题，改为 true 可使用 slot */
  isCustomNavbarTitle?: boolean;
  /** 页面状态 */
  pageStatus?: PageStatus;
  /** 是否显示滚动条 */
  scrollY?: boolean;
}
const props = withDefaults(defineProps<LayoutProps>(), {
  isShowNavbar: true,
  isShowTabbar: false,
  isCustomNavbarTitle: false,
  scrollY: true,
  pageStatus: "success"
});

const { windowHeight, mainHeight, windowTop } = getSystemInfo();
const pageStautsHeight = computed(() => {
  // #ifndef H5
  return (!props.isShowNavbar ? windowHeight : mainHeight) + "px";
  // #endif
  // #ifdef H5
  return windowHeight + windowTop + "px";
  // #endif
});
</script>

<style lang="scss">
.page_container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.page_scroll_view {
  flex: 1;
  overflow: hidden;
}
</style>
