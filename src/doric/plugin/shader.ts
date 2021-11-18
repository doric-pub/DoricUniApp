import { callReject, callResolve, Context, DoricPlugin } from '../context'

export class Shader extends DoricPlugin {
  public targetView?: Function

  public command (
    callbackId: string,
    value: {
      viewIds: Array<string>
      name: string
      args: any[]
    },
  ) {
    if (this.targetView) {
      let view = this.targetView(value)
      if (
        value.name == 'getWidth' ||
        value.name == 'getHeight' ||
        value.name == 'getX' ||
        value.name == 'getY' ||
        value.name == 'getLocationOnScreen'
      ) {
        view = view.$parent
      }

      const func = Reflect.get(view, value.name)
      const result = Reflect.apply(func, view, value.args ? [value.args] : [])
      callResolve(this.context.id, callbackId, result)
    }
  }
}
