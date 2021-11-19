<template>
  <image
    :id="id"
    class="doric-image"
    :src="imageUrl"
    :style="cssStyle"
    @load="onload"
    :mode="mode"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Image, LayoutConfig, LayoutSpec, ScaleType } from 'doric'
import { DoricModel, toCSSStyle } from '@/doric/utils'
import { callResponse } from '@/doric/context'

@Component({
  name: 'DoricImage',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  imageUrl: unknown = null
  mode = 'scaleToFill'
  loadCallback: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id

    const props = doricModel.nativeViewModel.props as Partial<Image>

    const doricStyle = doricModel.cssStyle

    if (props.imageUrl) {
      this.imageUrl = props.imageUrl
    }

    if (props.imageBase64) {
      this.imageUrl = props.imageBase64
    }

    if (props.scaleType) {
      switch (props.scaleType) {
        case ScaleType.ScaleAspectFit:
          this.mode = 'aspectFit'
          break
        case ScaleType.ScaleAspectFill:
          this.mode = 'aspectFill'
          break
        default:
          this.mode = 'scaleToFill'
          break
      }
    }

    if (props.isBlur) {
      doricStyle.filter = 'blur(8px)'
    }

    this.cssStyle = toCSSStyle(doricStyle)

    if (props.loadCallback) {
      this.loadCallback = props.loadCallback
    }
  }

  onload (event: any) {
    const doricModel = this.doricModelProps

    const doricStyle = doricModel.cssStyle
    const layoutConfig = doricModel.nativeViewModel.props.layoutConfig as LayoutConfig
    if (layoutConfig) {
      if (layoutConfig.widthSpec == LayoutSpec.FIT && layoutConfig.heightSpec == LayoutSpec.FIT) {
        doricStyle.width = `${event.detail.width}px`
        doricStyle.height = `${event.detail.height}px`
      } else if (
        layoutConfig.widthSpec == LayoutSpec.FIT &&
        layoutConfig.heightSpec == LayoutSpec.JUST
      ) {
        if (this.mode == 'aspectFit') {
          const height = parseFloat((doricStyle.height as string).replace('px', ''))
          doricStyle.width = `${(event.detail.width * height) / event.detail.height}px`
        }
      } else if (
        layoutConfig.widthSpec == LayoutSpec.JUST &&
        layoutConfig.heightSpec == LayoutSpec.FIT
      ) {
        if (this.mode == 'aspectFit') {
          const width = parseFloat((doricStyle.width as string).replace('px', ''))
          doricStyle.height = `${(event.detail.height * width) / event.detail.width}px`
        }
      }
    }

    const cssStyle = Object.entries(doricStyle)
      .map(e => `${e[0]}:${e[1]}`)
      .join(';')
    this.cssStyle = cssStyle

    if ((doricModel.idList, this.loadCallback)) {
      callResponse(doricModel.contextId, doricModel.idList, this.loadCallback as string, {
        width: event.detail.width,
        height: event.detail.height,
      })
    }
  }
}
</script>

<style>
.doric-image {
}
</style>
