<template>
  <scroll-view
    :id="id"
    class="doric-list"
    :style="cssStyle"
    @scrolltolower="scrollToLower"
    :scroll-y="true"
  >
    <DoricNode v-for="item in children" :key="item.nativeViewModel.id" :doric-model-props="item" />
  </scroll-view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DoricModel, toCSSStyle } from '@/doric/utils'
import { LayoutConfig, LayoutSpec, List } from 'doric'
import { callResponse } from '@/doric/context'
import { doricInterface } from '@/doric/interface'
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
  onLoadMore: unknown = null

  loadAnchor = -1

  scrollTop = 0

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    this.cssStyle = toCSSStyle(doricModel.cssStyle)

    const id = (this as any).id
    doricInterface
      .createSelectorQuery()
      .in(this)
      .select('#' + id)
      .fields(
        {
          size: true,
        },
        result => {
          const layoutConfig = doricModel.nativeViewModel.props.layoutConfig as LayoutConfig

          if (layoutConfig.heightSpec == LayoutSpec.MOST) {
            doricModel.cssStyle.height = `${result.height}px`
            this.cssStyle = toCSSStyle(doricModel.cssStyle)
          }
        },
      )
      .exec()

    let itemCountChanged = false

    const props = doricModel.nativeViewModel.props as Partial<List>

    if (props.itemCount) {
      if (this.itemCount !== props.itemCount) {
        itemCountChanged = true
      }
      this.itemCount = props.itemCount
    }

    let renderItemChanged = false

    if (props.renderItem) {
      if (this.renderItem !== props.renderItem) {
        renderItemChanged = true
        this.loadAnchor = -1
      }
      this.renderItem = props.renderItem
    }

    if (props.onLoadMore) {
      this.onLoadMore = props.onLoadMore
    }

    if (itemCountChanged) {
      const nativeViewModels = callResponse(
        doricModel.contextId,
        doricModel.idList,
        'renderBunchedItems',
        this.children ? (this.children as DoricModel[]).length : 0,
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

      const childrenTemp = this.children ? (this.children as DoricModel[]) : []
      const result = childrenTemp.concat(doricModels)
      console.log('itemCountChanged', result)
      this.children = result
    }

    if (renderItemChanged) {
      console.log('renderItemChanged')
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
      console.log(doricModels)

      // uni
      //   .createSelectorQuery()
      //   .in(this)
      //   .select('#' + id)
      //   .fields(
      //     {
      //       scrollOffset: true,
      //     },
      //     result => {
      //       console.log('scrollTop', result.scrollTop)

      //       setTimeout(() => {
      //         console.log('set scrollTop')
      //         this.scrollTop = result.scrollTop as number
      //       }, 1000)
      //     },
      //   )
      //   .exec()
    }
  }

  scrollToLower () {
    if (this.loadAnchor != this.itemCount) {
      this.loadAnchor = this.itemCount
      console.log('scrollToLower')
      const doricModel = this.doricModelProps
      if ((doricModel.idList, this.onLoadMore)) {
        callResponse(doricModel.contextId, doricModel.idList, this.onLoadMore as string)
      }
    }
  }
}
</script>

<style>
.doric-list {
  overflow-anchor: auto;
}
</style>
