import { callReject, callResolve, DoricPlugin } from '../context'
import { doricInterface } from '../interface'

export class Storage extends DoricPlugin {
  public setItem (
    callbackId: string,
    value: {
      key: string
      value: string
      zone: string
    },
  ) {
    doricInterface.setStorage({
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
    doricInterface.getStorage({
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
    doricInterface.removeStorage({
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
    doricInterface.getStorageInfo({
      success: (result: any) => {
        const keys = result.keys as string[]
        keys.forEach(key => {
          if (key.includes(value.zone + '_')) {
            doricInterface.removeStorageSync(key)
          }
        })
        callResolve(this.context.id, callbackId)
      },
    })
  }
}
