<template>
  <div :id="id" class="doric-input" :style="cssStyle">
    <input
      v-if="!multiline"
      :style="innerStyle"
      :value="text"
      :placeholder="hintText"
      :placeholder-style="placeholderStyle"
      :type="type"
      :maxlength="maxLength"
      :password="password"
      :disabled="disabled"
      :confirm-type="confirmType"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      :focus="focus"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
    >
    <textarea
      v-else
      :style="innerStyle"
      :auto-height="autoHeight"
      :value="text"
      :placeholder="hintText"
      :placeholder-style="placeholderStyle"
      :type="type"
      :maxlength="maxLength"
      :disabled="disabled"
      :confirm-type="confirmType"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
      :focus="focus"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { callResponse } from '@/doric/context'
import { Input, InputType, ReturnKeyType } from 'doric'

import {
  DoricModel,
  toCSSStyle,
  toPixelString,
  toRGBAString,
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  CENTER_X,
  CENTER_Y,
} from '@/doric/utils'
@Component({
  name: 'DoricInput',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  autoHeight = false
  currentText = ''

  text = ''
  hintText = ''
  innerStyle: unknown = null
  placeholderStyle = ''
  type = 'text'
  password = false
  disabled = false
  confirmType = ''
  maxLength = 140
  multiline = true

  onTextChange: unknown = null
  onFocusChange: unknown = null
  onSubmitEditing: unknown = null
  beforeTextChange: unknown = null

  focus = false
  selectionStart = -1
  selectionEnd = -1

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    const doricStyle = doricModel.cssStyle
    const innerStyle = {} as any
    const placeholderStyle = {} as any
    const props = doricModel.nativeViewModel.props as Partial<Input>

    this.autoHeight = true
    doricStyle.overflow = 'scroll'

    if (props.text) {
      this.text = props.text
      this.currentText = props.text
    }

    if (props.textColor) {
      innerStyle.color = toRGBAString(props.textColor as unknown as number)
    }

    if (props.textSize) {
      innerStyle['font-size'] = toPixelString(props.textSize)
    }

    if (props.hintText) {
      this.hintText = props.hintText
    }

    if (props.hintTextColor) {
      placeholderStyle.color = toRGBAString(props.hintTextColor as unknown as number)
    }

    if (props.inputType) {
      const inputType = props.inputType as number
      switch (inputType) {
        case InputType.Default:
          this.type = 'text'
          break
        case InputType.Number:
          this.type = 'number'
          break
        case InputType.Decimal:
          this.type = 'digit'
          break
        case InputType.Alphabet:
          this.type = 'text'
          break
        case InputType.Phone:
          this.type = 'number'
          break
      }
    }

    if (props.maxLength) {
      this.maxLength = props.maxLength
    }

    if (props.password) {
      this.password = true
    } else {
      this.password = false
    }

    if (props.editable !== undefined) {
      if (props.editable) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }

    if (props.returnKeyType) {
      switch (props.returnKeyType as number) {
        case ReturnKeyType.Default:
          this.confirmType = ''
          break
        case ReturnKeyType.Done:
          this.confirmType = 'done'
          break
        case ReturnKeyType.Search:
          this.confirmType = 'search'
          break
        case ReturnKeyType.Next:
          this.confirmType = 'next'
          break
        case ReturnKeyType.Go:
          this.confirmType = 'go'
          break
        case ReturnKeyType.Send:
          this.confirmType = 'send'
          break
      }
    }

    if (props.multiline) {
      this.multiline = true
    } else {
      this.multiline = false
    }

    if (props.textAlignment) {
      const gravity = props.textAlignment as unknown as number
      if ((gravity & LEFT) === LEFT) {
        doricStyle['justify-content'] = 'flex-start'
      } else if ((gravity & RIGHT) === RIGHT) {
        doricStyle['justify-content'] = 'flex-end'
      } else if ((gravity & CENTER_X) === CENTER_X) {
        doricStyle['justify-content'] = 'center'
      }
      if ((gravity & TOP) === TOP) {
        doricStyle['align-items'] = 'flex-start'
      } else if ((gravity & BOTTOM) === BOTTOM) {
        doricStyle['align-items'] = 'flex-end'
      } else if ((gravity & CENTER_Y) === CENTER_Y) {
        doricStyle['align-items'] = 'center'
      }
    }

    if (props.onTextChange) {
      this.onTextChange = props.onTextChange
    }

    if (props.onFocusChange) {
      this.onFocusChange = props.onFocusChange
    }

    if (props.onSubmitEditing) {
      this.onSubmitEditing = props.onSubmitEditing
    }

    if (props.beforeTextChange) {
      this.beforeTextChange = props.beforeTextChange
    }

    this.cssStyle = toCSSStyle(doricStyle)
    this.innerStyle = toCSSStyle(innerStyle)
    this.placeholderStyle = toCSSStyle(placeholderStyle)
  }

  onInput (event: any) {
    const doricModel = this.doricModelProps
    if ((doricModel.idList, this.onTextChange)) {
      callResponse(
        doricModel.contextId,
        doricModel.idList,
        this.onTextChange as string,
        event.detail.value,
      )
    }
    this.currentText = event.detail.value
  }

  onFocus () {
    const doricModel = this.doricModelProps
    if ((doricModel.idList, this.onFocusChange)) {
      callResponse(doricModel.contextId, doricModel.idList, this.onFocusChange as string, true)
    }
  }

  onBlur () {
    const doricModel = this.doricModelProps
    if ((doricModel.idList, this.onFocusChange)) {
      callResponse(doricModel.contextId, doricModel.idList, this.onFocusChange as string, false)
    }
  }

  onConfirm (event: any) {
    const doricModel = this.doricModelProps
    if ((doricModel.idList, this.onSubmitEditing)) {
      callResponse(
        doricModel.contextId,
        doricModel.idList,
        this.onSubmitEditing as string,
        event.detail.value,
      )
    }
  }

  getText () {
    return this.currentText
  }

  setSelection (args: { start: number; end: number }) {
    this.selectionStart = args.start
    this.selectionEnd = args.end
  }

  getSelection () {
    return {
      start: this.selectionStart,
      end: this.selectionEnd,
    }
  }

  requestFocus () {
    this.focus = true
  }

  releaseFocus () {
    this.focus = false
  }
}
</script>

<style>
.doric-input {
}
</style>
