<template>
  <swiper :id="id" class="doric-slider" :style="cssStyle">
    <swiper-item v-for="item in children" :key="item.nativeViewModel.id">
      <DoricNode :doric-model-props="item" />
    </swiper-item>
  </swiper>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DoricModel, getChildren, toCSSStyle } from '@/doric/utils'
import { Slider } from 'doric/lib/src/widget/index.widget'
import { callResponse } from '@/doric/context'
@Component({
  name: 'DoricSlider',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  children: unknown = null

  itemCount = 0
  loop = false
  renderPage: unknown = null
  onPageSlided: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    this.cssStyle = toCSSStyle(doricModel.cssStyle)

    let changed = false

    const props = doricModel.nativeViewModel.props as Partial<Slider>
    if (props.itemCount) {
      this.itemCount = props.itemCount
    }

    if (props.loop) {
      this.loop = props.loop
    }

    if (props.renderPage) {
      if (this.renderPage !== props.renderPage) {
        changed = true
      }
      this.renderPage = props.renderPage
    }

    if (props.onPageSlided) {
      this.onPageSlided = props.onPageSlided
    }

    if (changed) {
      const nativeViewModels = callResponse(
        doricModel.contextId,
        doricModel.idList,
        'renderBunchedItems',
        0,
        this.itemCount,
      )

      const doricModels: DoricModel[] = []

      for (let index = 0; index < nativeViewModels.length; index++) {
        const nativeViewModel = nativeViewModels[index]
        const childDoricModel = {
          contextId: doricModel.contextId,
          nativeViewModel: nativeViewModel,
          cssStyle: {},
          idList: [...doricModel.idList, nativeViewModel.id],
        } as DoricModel
        doricModels.push(childDoricModel)
      }

      this.children = doricModels
      console.log(this.children)
    }
  }
}
</script>

<style>
.doric-slider {
}
</style>
