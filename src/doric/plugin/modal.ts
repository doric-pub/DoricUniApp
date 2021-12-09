import { callReject, callResolve, Context, DoricPlugin } from '../context'
import { BOTTOM, TOP, CENTER_Y } from '../utils'
import { doricInterface } from '../interface'

export class Modal extends DoricPlugin {
  constructor (context: Context) {
    super(context)
  }

  public toast (callbackId: string, args: { msg: string; gravity: number }) {
    let position = 'bottom'
    const gravity = args.gravity || BOTTOM
    if ((gravity & TOP) == TOP) {
      position = 'top'
    } else if ((gravity & BOTTOM) == BOTTOM) {
      position = 'bottom'
    } else if ((gravity & CENTER_Y) == CENTER_Y) {
      position = 'center'
    }

    doricInterface.showToast({
      title: args.msg,
      position: position as 'top' | 'center' | 'bottom',
      duration: 2000,
      icon: 'none',
      success: () => {
        callResolve(this.context.id, callbackId)
      },
      fail: () => {
        callReject(this.context.id, callbackId)
      },
    })
  }

  public alert (
    callbackId: string,
    args: {
      title?: string
      msg: string
      okLabel?: string
    },
  ) {
    const option = {} as any
    if (args.title) {
      option.title = args.title
    }
    if (args.okLabel) {
      option.confirmText = args.okLabel
    }
    option.content = args.msg
    option.showCancel = false
    option.success = () => {
      callResolve(this.context.id, callbackId)
    }
    doricInterface.showModal(option)
  }

  public confirm (
    callbackId: string,
    args: {
      title?: string
      msg: string
      okLabel?: string
      cancelLabel?: string
    },
  ) {
    const option = {} as any
    if (args.title) {
      option.title = args.title
    }
    if (args.okLabel) {
      option.confirmText = args.okLabel
    }
    if (args.cancelLabel) {
      option.cancelText = args.cancelLabel
    }
    option.content = args.msg
    option.success = (result: any) => {
      if (result.confirm) {
        callResolve(this.context.id, callbackId)
      } else {
        callReject(this.context.id, callbackId)
      }
    }
    doricInterface.showModal(option)
  }

  public prompt (
    callbackId: string,
    args: {
      title?: string
      msg?: string
      okLabel?: string
      cancelLabel?: string
      text?: string
      defaultText?: string
    },
  ) {
    const option = {} as any
    if (args.title) {
      option.title = args.title
    }
    if (args.okLabel) {
      option.confirmText = args.okLabel
    }
    if (args.cancelLabel) {
      option.cancelText = args.cancelLabel
    }
    if (args.defaultText) {
      option.placeholderText = args.defaultText
    }
    if (args.text) {
      option.content = args.text
    }

    option.editable = true
    option.success = (result: any) => {
      if (result.confirm) {
        callResolve(this.context.id, callbackId, result.content)
      } else {
        callReject(this.context.id, callbackId)
      }
    }
    doricInterface.showModal(option)
  }
}
