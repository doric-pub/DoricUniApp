import { callReject, callResolve, Context, DoricPlugin } from "../context";

export class Shader extends DoricPlugin {
  public targetView?: Function;

  public command(
    callbackId: string,
    value: {
      viewIds: Array<string>;
      name: string;
      args: any[];
    }
  ) {
    if (this.targetView) {
      const view = this.targetView(value);
      console.log(view);

      let func = Reflect.get(view, value.name);
      let result = Reflect.apply(func, view, value.args ? value.args : []);
      callResolve(this.context.id, callbackId, result);
    }
  }
}
