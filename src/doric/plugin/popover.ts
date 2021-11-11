import { callReject, callResolve, Context, DoricPlugin } from '../context'
import { DoricModel } from '../utils'

export class Popover extends DoricPlugin {
  public onModelsChange?: Function

  private doricModels: Array<DoricModel> = []

  constructor (context: Context) {
    super(context)
  }

  public show (callbackId: string, args: any) {
    const model = {
      contextId: this.context.id,
      nativeViewModel: args,
      cssStyle: {},
      idList: [args.id],
    } as DoricModel

    this.doricModels.push(model)

    if (this.onModelsChange) {
      this.onModelsChange(this.doricModels)
    }

    callResolve(this.context.id, callbackId)
  }

  public dismiss (callbackId: string, args: any) {
    if (args) {
      console.log('popover dismiss', args)
    } else {
      this.doricModels.length = 0

      if (this.onModelsChange) {
        this.onModelsChange(this.doricModels)
      }
    }

    callResolve(this.context.id, callbackId)
  }
}
