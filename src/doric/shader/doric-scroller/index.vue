<template>
  <view :id="id" class="doric-scroller" :style="cssStyle">
    <DoricNode
      v-for="(item, index) in children"
      :key="item.nativeViewModel.id"
      :doric-model-props="item"
      :style="index === children.length - 1 ? null : style"
    />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { NativeViewModel } from 'doric'
import { DoricModel, toCSSStyle } from '@/doric/utils'

@Component({
  name: 'DoricScroller',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  children: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal as DoricModel
    this.id = doricModel.nativeViewModel.id
    this.cssStyle = toCSSStyle(doricModel.cssStyle)

    const props = doricModel.nativeViewModel.props
    if (props.content) {
      const subviews = doricModel.nativeViewModel.props.subviews as NativeViewModel[]
      const children = subviews.map(nativeViewModel => {
        return {
          contextId: doricModel.contextId,
          nativeViewModel: nativeViewModel,
          cssStyle: {},
          idList: [...doricModel.idList, nativeViewModel.id],
        }
      })

      this.children = children
    }
  }
}
</script>

<style>
.doric-scroller {
  overflow: scroll;
}
.doric-scroller::-webkit-scrollbar {
  display: none;
}
</style>
