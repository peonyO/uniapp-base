declare interface GetImageInfoSuccessData extends UniApp.GetImageInfoSuccessData {
  /**
   * 图片名称 携带后缀
   */
  fileName: string;
  /**
   * 远程图片地址
   */
  ossImageSrc: string;
}
