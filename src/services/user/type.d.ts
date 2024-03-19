declare interface RealLoginResult {
  errorMessage: string;
  openid: string;
  sessionKey: string;
  token: TokenInfo;
  unionid: string;
}
declare interface RealLoginData {
  code: string;
  allianceKey?: string;
  inviteType?: string;
}
