declare type ShowActionSheetOptions<T> = ArrayItemType<T> extends string
  ? ShowActionSheetOptionsString<T>
  : ShowActionSheetOptionsObject<T>;

interface ShowActionSheetOptionsString<T> {
  /**
   * 菜单标题
   */
  title?: string;
  /**
   * 警示文案（同菜单标题）
   */
  alertText?: string;
  /**
   * 按钮的文字数组
   */
  itemList: T;
  /**
   * 按钮的文字颜色，默认为"#000000"
   */
  itemColor?: string;
  /**
   * 大屏设备弹出原生选择按钮框的指示区域，默认居中显示
   */
  popover?: UniApp.ShowActionPopover;
  /**
   * 接口调用成功的回调函数
   */
  success?: (result: ShowActionSheetRes<T>) => void;
  /**
   * 接口调用失败的回调函数
   */
  fail?: (result: any) => void;
  /**
   * 接口调用结束的回调函数（调用成功、失败都会执行）
   */
  complete?: (result: any) => void;
}

type ShowActionSheetOptionsObject<T> = ShowActionSheetOptionsString<T> & {
  keyName: keyof ArrayItemType<T>;
};

interface ShowActionSheetRes<T> {
  info: ArrayItemType<T>;
  index: number;
}
