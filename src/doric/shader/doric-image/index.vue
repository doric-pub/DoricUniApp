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
import { Image, ScaleType } from 'doric'
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
    if (doricStyle.width === 'max-content') {
      delete doricStyle.width
    }
    if (doricStyle.height === 'max-content') {
      delete doricStyle.height
    }

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
