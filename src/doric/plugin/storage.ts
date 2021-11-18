import { callReject, callResolve, DoricPlugin } from '../context'

export class Storage extends DoricPlugin {
  public setItem (
    callbackId: string,
    value: {
      key: string
      value: string
      zone: string
    },
  ) {
    uni.setStorage({
      key: value.zone + '_' + value.key,
      data: value.value,
      success: (result: any) => {
        callResolve(this.context.id, callbackId, result.data)
      },
      fail: (result: any) => {
        callReject(this.context.id, callbackId, result)
      },
    })
  }

  public getItem (
    callbackId: string,
    value: {
      key: string
      zone: string
    },
  ) {
    uni.getStorage({
      key: value.zone + '_' + value.key,
      success: (result: any) => {
        callResolve(this.context.id, callbackId, result.data)
      },
      fail: (result: any) => {
        callResolve(this.context.id, callbackId, '')
      },
    })
  }

  public remove (
    callbackId: string,
    value: {
      key: string
      zone: string
    },
  ) {
    uni.removeStorage({
      key: value.zone + '_' + value.key,
      success: (result: any) => {
        callResolve(this.context.id, callbackId)
      },
    })
  }

  public clear (
    callbackId: string,
    value: {
      zone: string
    },
  ) {
    uni.getStorageInfo({
      success: (result: any) => {
        const keys = result.keys as string[]
        keys.forEach(key => {
          if (key.includes(value.zone + '_')) {
            uni.removeStorageSync(key)
          }
        })
        callResolve(this.context.id, callbackId)
      },
    })
  }
}
