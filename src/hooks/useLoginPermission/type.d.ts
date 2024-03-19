declare type UseInitLoginHook = (options: AnyObject, isSuccess: boolean) => void;
declare interface ActiveLoginHook {
  (): void;
}
