<template>
  <view :id="id" class="doric-list" :style="cssStyle">
    <DoricNode v-for="item in children" :key="item.nativeViewModel.id" :doric-model-props="item" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DoricModel, toCSSStyle } from '@/doric/utils'
import { List } from 'doric'
import { callResponse } from '@/doric/context'
@Component({
  name: 'DoricList',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  children: unknown = null

  itemCount = 0
  renderItem: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    this.cssStyle = toCSSStyle(doricModel.cssStyle)

    let changed = false

    const props = doricModel.nativeViewModel.props as Partial<List>

    if (props.itemCount) {
      if (this.itemCount !== props.itemCount) {
        changed = true
      }
      this.itemCount = props.itemCount
    }

    if (props.renderItem) {
      if (this.renderItem !== props.renderItem) {
        changed = true
      }
      this.renderItem = props.renderItem
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
.doric-list {
}
</style>
