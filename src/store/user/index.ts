import { reactive, toRefs } from "vue";
import { defineStore } from "pinia";
import dayjs from "dayjs";
import {
  getBaseTokenService,
  realLoginService,
  updateLoginTokenService,
  getUserInfoService,
  getUserPropertyService
} from "@/services";
import { getStorage, isHttp, responseStatusMap, setStorage } from "@/common";

export const useUserStore = defineStore("userSetup", () => {
  const state: UserStoreIF = reactive({
    /** 用户信息 */
    userInfo: null,
    /** 是否登录 */
    isLogin: false
  });

  /**
   * 真实身份登录
   */
  const realLoginIn = async () => {
    try {
      await visitorLoginIn();
      // #ifndef WEB
      await miniLoginIn();
      await refreshUserInfo();
      // #endif
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * 各平台小程序登录
   */
  const miniLoginIn = async () => {
    const tokenInfo = getStorage("tokenInfo");
    if (tokenInfo && tokenInfo.real === true) {
      return await checkTokenValidityRefresh(tokenInfo);
    } else {
      const loginCode = await getLoginCode();
      const realLoginRes = await realLoginService({ code: loginCode });
      if (realLoginRes._status === responseStatusMap.SUCCESS) {
        setStorage("tokenInfo", {
          ...realLoginRes.result.token,
          real: true
        });
        return true;
      } else {
        throw new Error(realLoginRes._msg);
      }
    }
  };

  /**
   * 获取用户信息
   */
  const refreshUserInfo = async () => {
    const userInfoResult = await getUserInfoService();
    const propertyInfoResult = await getUserPropertyService(undefined, { userId: userInfoResult.result.userId });
    if (
      userInfoResult._status === responseStatusMap.SUCCESS &&
      propertyInfoResult._status === responseStatusMap.SUCCESS
    ) {
      state.userInfo = {
        ...userInfoResult.result,
        ...propertyInfoResult.result
      };
      state.isLogin = true;
      return true;
    } else {
      throw new Error("获取用户信息失败，请稍后重试");
    }
  };

  /**
   * 获取平台登录凭证
   */
  const getLoginCode = () => {
    return new Promise<string>((resolve) => {
      uni.login({
        timeout: 10000,
        success: (uniLoginRes) => {
          resolve(uniLoginRes.code);
        }
      });
    });
  };

  /**
   * 游客登录，只返回 token
   */
  const visitorLoginIn = async () => {
    const tokenInfo = getStorage("tokenInfo");
    if (tokenInfo && tokenInfo.real === false) {
      return await checkTokenValidityRefresh(tokenInfo);
    } else {
      const visitorLoginResult = await getBaseTokenService();
      if (visitorLoginResult._status === responseStatusMap.SUCCESS) {
        setStorage("tokenInfo", {
          ...visitorLoginResult.result,
          real: false
        });
        return true;
      } else {
        throw new Error(visitorLoginResult._msg);
      }
    }
  };

  /**
   * 校验 token 有效性，过期后重新获取 token
   */
  const checkTokenValidityRefresh = async (tokenInfo: TokenInfo) => {
    const tokenExpireTime = tokenInfo.expireTime;
    const currentTime = dayjs().valueOf();
    if (tokenExpireTime - 1000 * 60 * 5 <= currentTime) {
      const updateTokenResult = await updateLoginTokenService();
      if (updateTokenResult._status === responseStatusMap.SUCCESS) {
        setStorage("tokenInfo", {
          ...updateTokenResult.result,
          real: tokenInfo.real
        });
        return true;
      } else {
        throw new Error(updateTokenResult._msg);
      }
    } else {
      return true;
    }
  };

  const resolveStaticUrl = (imagePath: string) => {
    return imagePath ? (isHttp(imagePath) ? imagePath : `${import.meta.env.VITE_OSS_SERVICE_URL}/${imagePath}`) : "";
  };

  return {
    ...toRefs(state),
    realLoginIn,
    refreshUserInfo,
    resolveStaticUrl
  };
});
