<template>
  <view :id="id" class="doric-listitem" :style="cssStyle">
    <DoricNode v-for="item in children" :key="item.nativeViewModel.id" :doric-model-props="item" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DoricModel, getChildren, toCSSStyle } from '@/doric/utils'
@Component({
  name: 'DoricListItem',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  children: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    this.cssStyle = toCSSStyle(doricModel.cssStyle)
    this.children = getChildren(doricModel)
  }
}
</script>

<style>
.doric-listitem {
}
</style>
