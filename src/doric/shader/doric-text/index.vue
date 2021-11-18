<template>
  <div :id="id" class="doric-text" :style="cssStyle">
    <span v-if="text !== null && htmlText === null" :style="innerStyle">{{ text }}</span>
    <rich-text v-if="text === null && htmlText !== null" :nodes="htmlText" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import { GradientColor, GradientOrientation, Text } from 'doric'

import {
  LEFT,
  RIGHT,
  CENTER_X,
  CENTER_Y,
  BOTTOM,
  TOP,
  DoricModel,
  toCSSStyle,
  toPixelString,
  toRGBAString,
} from '@/doric/utils'

@Component({
  name: 'DoricText',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  innerStyle: unknown = null
  text: unknown = null
  htmlText: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal as DoricModel
    this.id = doricModel.nativeViewModel.id

    const props = doricModel.nativeViewModel.props as Partial<Text>
    const doricStyle = doricModel.cssStyle

    const innerStyle = {} as any
    innerStyle['white-space'] = 'pre-line'

    if (props.text) {
      this.text = props.text
    }

    if (props.textColor) {
      if (typeof props.textColor === 'number') {
        doricStyle.color = toRGBAString(props.textColor as unknown as number)
      } else if (typeof props.textColor === 'object') {
        innerStyle['-webkit-background-clip'] = 'text'
        innerStyle.color = 'transparent'

        const gradient = props.textColor as GradientColor

        let deg = ''
        switch (gradient.orientation) {
          case GradientOrientation.TOP_BOTTOM:
            deg = '180deg'
            break
          case GradientOrientation.TR_BL:
            deg = '-135deg'
            break
          case GradientOrientation.RIGHT_LEFT:
            deg = '-90deg'
            break
          case GradientOrientation.BR_TL:
            deg = '-45deg'
            break
          case GradientOrientation.BOTTOM_TOP:
            deg = '0deg'
            break
          case GradientOrientation.BL_TR:
            deg = '45deg'
            break
          case GradientOrientation.LEFT_RIGHT:
            deg = '90deg'
            break
          case GradientOrientation.TL_BR:
            deg = '135deg'
            break
        }

        if (gradient.start && gradient.end) {
          innerStyle['background-image'] = `linear-gradient(${deg}, ${toRGBAString(
            gradient.start as unknown as number,
          )}, ${toRGBAString(gradient.end as unknown as number)});`
        } else {
          if (gradient.locations) {
            const locations = gradient.locations
            if (gradient.colors) {
              const colors = gradient.colors
                .map(
                  (e, index) =>
                    `${toRGBAString(e as unknown as number)} ${
                      ((locations[index] as unknown as number) * 100).toFixed(2) + '%'
                    }`,
                )
                .join(',')
              innerStyle['background-image'] = `linear-gradient(${deg}, ${colors});`
            }
          } else {
            if (gradient.colors) {
              const colors = gradient.colors
                .map(e => `${toRGBAString(e as unknown as number)}`)
                .join(',')
              innerStyle['background-image'] = `linear-gradient(${deg}, ${colors});`
            }
          }
        }
      }
    }

    if (props.textSize) {
      doricStyle['font-size'] = toPixelString(props.textSize)
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

    if (Object.keys(doricStyle).includes('box-shadow')) {
      const shadow = doricStyle['box-shadow']
      innerStyle['text-shadow'] = shadow
      delete doricStyle['box-shadow']
    }

    if (props.fontStyle) {
      if (props.fontStyle === 'bold') {
        innerStyle['font-weight'] = 'bold'
        innerStyle['font-style'] = 'normal'
      } else if (props.fontStyle === 'italic') {
        innerStyle['font-weight'] = 'normal'
        innerStyle['font-style'] = 'italic'
      } else if (props.fontStyle === 'bold_italic') {
        innerStyle['font-weight'] = 'bold'
        innerStyle['font-style'] = 'italic'
      }
    }

    if (props.lineSpacing) {
      innerStyle['line-height'] = `${props.lineSpacing}px`
    }

    const decoration: string[] = []
    if (props.strikethrough) {
      decoration.push('line-through')
    }

    if (props.underline) {
      decoration.push('underline')
    }

    innerStyle['text-decoration'] = decoration.map(e => `${e}`).join(' ')

    if (props.htmlText) {
      this.htmlText = props.htmlText
    }

    this.cssStyle = toCSSStyle(doricStyle)
    this.innerStyle = toCSSStyle(innerStyle)
  }
}
</script>

<style>
.doric-text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
