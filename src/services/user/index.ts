import { request } from "@/common";

/**
 * 获取基础 token
 */
export const getBaseTokenService: Service<TokenInfo> = () => {
  return request({
    path: "/common/getToken",
    withToken: false
  });
};

/**
 * 更新 token
 */
export const updateLoginTokenService: Service<TokenInfo> = () => {
  return request({
    path: "/common/updateToken"
  });
};

/**
 * 获取用户信息
 */
export const getUserInfoService: Service<UserInfoResult> = () => {
  return request({
    path: "/user/my/info/detail"
  });
};

/**
 * 获取金币和积分数量以及等级
 */
export const getUserPropertyService: Service<UserPropertyResult, undefined, Pick<UserInfoResult, "userId">> = (
  _,
  query
) => {
  return request({
    path: "/user/signpoints/level",
    query,
    method: "POST"
  });
};

/**
 * 微信小程序登录
 */
export const realLoginService: Service<RealLoginResult, RealLoginData> = (data) => {
  return request({
    path: "/weixin/ma/login",
    data
  });
};
