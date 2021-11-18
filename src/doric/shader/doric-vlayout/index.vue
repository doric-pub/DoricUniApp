<template>
  <view :id="id" class="doric-vlayout" :style="cssStyle">
    <DoricNode
      v-for="(item, index) in children"
      :key="item.nativeViewModel.id"
      :doric-model-props="item"
      :style="childStyles[index]"
    />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import { LayoutConfig, LayoutSpec, VLayout } from 'doric'
import {
  LEFT,
  RIGHT,
  CENTER_X,
  CENTER_Y,
  BOTTOM,
  TOP,
  getChildren,
  DoricModel,
} from '@/doric/utils'

@Component({
  name: 'DoricVLayout',
})
export default class extends Vue {
  @Prop() private doricModelProps!: any

  id: string | null = null
  cssStyle: unknown = null
  childStyles: unknown = null
  children: unknown = null

  @Watch('doricModelProps', { immediate: true })
  onDoricModelPropsChange (newVal: DoricModel) {
    const doricModel = newVal
    this.id = doricModel.nativeViewModel.id
    const props = doricModel.nativeViewModel.props as Partial<VLayout>
    const doricStyle = doricModel.cssStyle

    if (props.gravity) {
      const gravity = props.gravity as unknown as number
      if ((gravity & LEFT) === LEFT) {
        doricStyle['align-items'] = 'flex-start'
      } else if ((gravity & RIGHT) === RIGHT) {
        doricStyle['align-items'] = 'flex-end'
      } else if ((gravity & CENTER_X) === CENTER_X) {
        doricStyle['align-items'] = 'center'
      }
      if ((gravity & TOP) === TOP) {
        doricStyle['justify-content'] = 'flex-start'
      } else if ((gravity & BOTTOM) === BOTTOM) {
        doricStyle['justify-content'] = 'flex-end'
      } else if ((gravity & CENTER_Y) === CENTER_Y) {
        doricStyle['justify-content'] = 'center'
      }
    }

    const cssStyle = Object.entries(doricStyle)
      .map(e => `${e[0]}:${e[1]}`)
      .join(';')
    this.cssStyle = cssStyle

    const children = getChildren(doricModel)
    const childStyles: Array<String> = []

    let containsChildWithJustWidth = false
    let containsChildWithJustHeight = false
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (child.nativeViewModel.props.layoutConfig) {
        const layoutConfig = child.nativeViewModel.props.layoutConfig as LayoutConfig
        if (layoutConfig.widthSpec == LayoutSpec.JUST) {
          containsChildWithJustWidth = true
        }
        if (layoutConfig.heightSpec == LayoutSpec.JUST) {
          containsChildWithJustHeight = true
        }
      }
    }

    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      const childStyle: Record<string, string> = {}

      childStyle['flex-shrink'] = '0'
      if (child.nativeViewModel.props.layoutConfig) {
        const layoutConfig = child.nativeViewModel.props.layoutConfig as LayoutConfig

        const selfLayoutConfig = doricModel.nativeViewModel.props.layoutConfig as LayoutConfig
        if (layoutConfig.widthSpec == LayoutSpec.MOST) {
          if (selfLayoutConfig && selfLayoutConfig.widthSpec == LayoutSpec.FIT) {
            if (!containsChildWithJustWidth) {
              layoutConfig.widthSpec = LayoutSpec.FIT
            }
          } else {
            childStyle.width = '100%'
          }
        }
        if (layoutConfig.heightSpec == LayoutSpec.MOST) {
          if (selfLayoutConfig && selfLayoutConfig.heightSpec == LayoutSpec.FIT) {
            if (!containsChildWithJustHeight) {
              layoutConfig.heightSpec = LayoutSpec.FIT
            }
          } else {
            childStyle.height = '100%'
          }
        }

        if (layoutConfig.weight) {
          childStyle.flex = `${layoutConfig?.weight}`
          layoutConfig.heightSpec = LayoutSpec.MOST
        }
      }
      if (props.space && index != children.length - 1) {
        const space = props.space
        childStyle['margin-bottom'] = `${space}px;`
      }

      const childStyleString = Object.entries(childStyle)
        .map(e => `${e[0]}:${e[1]}`)
        .join(';')
      childStyles.push(childStyleString)
    }

    this.children = children
    this.childStyles = childStyles
  }
}
</script>

<style>
.doric-vlayout {
  display: flex;
  flex-direction: column;
}
</style>
