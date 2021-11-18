import { callReject, callResolve, DoricPlugin } from '../context'

export class Network extends DoricPlugin {
  public request (
    callbackId: string,
    value: {
      url: string
      method: string
    },
  ) {
    console.log(value)
    const options = {
      url: value.url,
      method: value.method,
      success: (result: any) => {
        callResolve(this.context.id, callbackId, result)
      },
      fail: (result: any) => {
        callReject(this.context.id, callbackId, result)
      },
    }
    uni.request(options as any)
  }
}
