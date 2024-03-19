<script setup lang="ts">
import { nextTick } from "vue";
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { setGlobalData, initGUID } from "@/common";

onLaunch(() => {
  nextTick(() => {
    setGlobalData("GUID", initGUID());
  });
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
html {
  background-color: #f5f5f5;
}
#app {
  max-width: 375px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
