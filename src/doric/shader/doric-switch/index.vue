<template>
  <switch
    :id="id"
    class="doric-switch"
    :style="cssStyle"
    :color="color"
    :checked="checked"
    @change="onChange"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Switch } from 'doric'
import { DoricModel, toCSSStyle, toRGBAString } from '@/doric/utils'
import { callResponse } from '@/doric/context'
@Component({
  name: 'DoricSwitch',
})
export default class extends Vue {
  @Prop() private doricModelProps!:any
  id:string|null = null
  cssStyle:unknown = null
  color = '#04BE02'
  checked = false
  onSwitch:any = null
  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal:DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    const props = doricModel.nativeViewModel.props as Partial<Switch>
    const doricStyle = doricModel.cssStyle
    this.cssStyle = toCSSStyle(doricStyle)
    if (props.state) {
      this.checked = props.state
    }
    if (props.onTintColor) {
      this.color = toRGBAString(props.onTintColor as unknown as number)
    }

    if (props.onSwitch) {
      this.onSwitch = props.onSwitch
    }
    console.log('props', props)
  }

  onChange (event: any) {
    const doricModel = this.doricModelProps
    console.log(doricModel)
    if ((doricModel.idList, this.onSwitch)) {
      callResponse(
        doricModel.contextId,
        doricModel.idList,
        this.onSwitch,
        event.detail.value,
      )
    }
  }
}
</script>

<style>
.doric-switch {
}
</style>
