import { callReject, callResolve, Context, DoricPlugin } from "../context";

export class Popover extends DoricPlugin {
  constructor(context: Context) {
    super(context);
  }

  public show(callbackId: string, args: any) {
    console.log("popover show", args)
  }

  public dismiss(callbackId: string, args: any) {
    console.log("popover dismiss", args)
  }
}
