<template>
  <view class="tabbar" :style="tabbarStyle">
    <view
      v-for="(item, index) in tabbarList"
      :key="index"
      class="tabbar_item"
      :style="tabbarItemStyle"
      @click="switchTab(index)"
    >
      <image :src="activeIndex === index ? item.activeIcon : item.icon" class="tabbar_icon" />
      <view
        class="tabbar_title"
        :style="{
          color: activeIndex === index ? props.activeColor : props.color
        }"
        >{{ item.title }}</view
      >
    </view>
  </view>
  <view :style="tabbarPlaceholderStyle"></view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { getSystemInfo } from "@/common";

interface Props {
  tabbarList?: {
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

const props = withDefaults(defineProps<Props>(), {
  defaultIndex: 0,
  backgroundColor: "#ffffff",
  color: "rgba(51, 51, 51, 0.5)",
  activeColor: "#333333"
});

const emit = defineEmits<{
  (event: "switchTab", index: number): void;
}>();

const { tabbarHeight, controlHeight, safeAreaHeight } = getSystemInfo();
const tabbarHeightUnit = `${tabbarHeight}px`;
const controlHeightUnit = `${controlHeight}px`;
const safeAreaHeightUnit = `${safeAreaHeight}px`;

const tabbarPlaceholderStyle = computed(() => ({ height: tabbarHeightUnit }));
const tabbarStyle = computed(() => ({
  height: tabbarHeightUnit,
  paddingBottom: safeAreaHeightUnit,
  backgroundColor: props.backgroundColor
}));
const tabbarItemStyle = computed(() => ({
  width: tabbarWidth.value,
  height: controlHeightUnit
}));

const tabbarWidth = computed(() => {
  return props.tabbarList ? `${100 / props.tabbarList.length}%` : "100%";
});

const activeIndex = ref(props.defaultIndex);

function switchTab(index: number) {
  if (activeIndex.value === index) return;
  activeIndex.value = index;
  emit("switchTab", index);
}
</script>

<style lang="scss">
.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 sizing(20) 0 rgba(51, 51, 51, 0.1);
  display: flex;
  .tabbar_item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .tabbar_icon {
      width: 24px;
      height: 24px;
    }
    .tabbar_title {
      font-size: 10px;
    }
  }
}
</style>
