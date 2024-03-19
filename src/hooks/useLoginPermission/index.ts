import { onLoad } from "@dcloudio/uni-app";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { setGlobalData, showToast } from "@/common";

/**
 * 每次页面加载时，去静默登录，登录成功后执行 onLoad 事件，未登录请自行设置 pageStatus: error
 */
export function useInitLogin(hook?: UseInitLoginHook) {
  const userStore = useUserStore();
  const { realLoginIn } = userStore;
  const { isLogin } = storeToRefs(userStore);

  onLoad(async (pageOptions) => {
    const isSuccess = await realLoginIn();
    hook && hook(pageOptions, isSuccess);
  });

  /**
   * 在用户操作时，需要用到用户信息，请调用此方法，检验用户信息是否过期，未过期会执行 activeHook 回调函数，
   * 小程序会提示错误，H5 则跳转到登录界面
   * @param activeHook 
   */
  const checkActivePermission = async (activeHook?: ActiveLoginHook) => {
    const isSuccess = await realLoginIn();
    if (isSuccess) {
      // #ifndef WEB
      activeHook && activeHook();
      // #endif
      // #ifdef WEB
      if (isLogin.value) {
        activeHook && activeHook();
      } else {
        // TODO 跳转登录页
        setGlobalData("loginCallback", activeHook);
      }
      // #endif
    } else {
      showToast("网络错误，请稍后重试");
    }
  };

  return {
    checkActivePermission
  };
}
