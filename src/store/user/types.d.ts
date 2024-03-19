declare interface UserInfoResult {
  userId: number;
}

declare interface UserPropertyResult {}

declare interface UserStoreIF {
  userInfo: (UserInfoResult & UserPropertyResult) | null;
  isLogin: boolean;
}
