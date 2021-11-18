<template>
  <view :id="id" class="doric-flexlayout" :style="cssStyle">
    <DoricNode v-for="item in children" :key="item.nativeViewModel.id" :doric-model-props="item" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { DoricModel, getChildren, toCSSStyle, toPixelString } from '@/doric/utils'
import {
  Align,
  FlexConfig,
  FlexDirection,
  FlexTypedValue,
  LayoutConfig,
  LayoutSpec,
  Wrap,
} from 'doric'

@Component({
  name: 'DoricFlexLayout',
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
    const doricStyle = doricModel.cssStyle
    this.children = getChildren(doricModel)

    const flexConfig = doricModel.nativeViewModel.props.flexConfig as Partial<FlexConfig>
    console.log(flexConfig)

    if (flexConfig) {
      if (flexConfig.flexDirection) {
        if ((flexConfig.flexDirection as number) == FlexDirection.COLUMN) {
          doricStyle['flex-direction'] = 'column'
        } else if ((flexConfig.flexDirection as number) == FlexDirection.COLUMN_REVERSE) {
          doricStyle['flex-direction'] = 'column-reverse'
        } else if ((flexConfig.flexDirection as number) == FlexDirection.ROW) {
          doricStyle['flex-direction'] = 'row'
        } else if ((flexConfig.flexDirection as number) == FlexDirection.ROW_REVERSE) {
          doricStyle['flex-direction'] = 'row-reverse'
        }
      }

      if (flexConfig.alignContent) {
        if ((flexConfig.alignContent as number) == Align.AUTO) {
          doricStyle['align-content'] = 'unset'
        } else if ((flexConfig.alignContent as number) == Align.FLEX_START) {
          doricStyle['align-content'] = 'flex-start'
        } else if ((flexConfig.alignContent as number) == Align.CENTER) {
          doricStyle['align-content'] = 'center'
        } else if ((flexConfig.alignContent as number) == Align.FLEX_END) {
          doricStyle['align-content'] = 'flex-end'
        } else if ((flexConfig.alignContent as number) == Align.STRETCH) {
          doricStyle['align-content'] = 'stretch'
        } else if ((flexConfig.alignContent as number) == Align.BASELINE) {
          doricStyle['align-content'] = 'baseline'
        } else if ((flexConfig.alignContent as number) == Align.SPACE_BETWEEN) {
          doricStyle['align-content'] = 'space-between'
        } else if ((flexConfig.alignContent as number) == Align.SPACE_AROUND) {
          doricStyle['align-content'] = 'space-around'
        }
      }

      if (flexConfig.alignItems) {
        if ((flexConfig.alignItems as number) == Align.AUTO) {
          doricStyle['align-items'] = 'unset'
        } else if ((flexConfig.alignItems as number) == Align.FLEX_START) {
          doricStyle['align-items'] = 'flex-start'
        } else if ((flexConfig.alignItems as number) == Align.CENTER) {
          doricStyle['align-items'] = 'center'
        } else if ((flexConfig.alignItems as number) == Align.FLEX_END) {
          doricStyle['align-items'] = 'flex-end'
        } else if ((flexConfig.alignItems as number) == Align.STRETCH) {
          doricStyle['align-items'] = 'stretch'
        } else if ((flexConfig.alignItems as number) == Align.BASELINE) {
          doricStyle['align-items'] = 'baseline'
        } else if ((flexConfig.alignItems as number) == Align.SPACE_BETWEEN) {
          doricStyle['align-items'] = 'space-between'
        } else if ((flexConfig.alignItems as number) == Align.SPACE_AROUND) {
          doricStyle['align-items'] = 'space-around'
        }
      }

      if (flexConfig.flexWrap) {
        if ((flexConfig.flexWrap as number) == Wrap.NO_WRAP) {
          doricStyle['flex-wrap'] = 'nowrap'
        } else if ((flexConfig.flexWrap as number) == Wrap.WRAP) {
          doricStyle['flex-wrap'] = 'wrap'
        } else if ((flexConfig.flexWrap as number) == Wrap.WRAP) {
          doricStyle['flex-wrap'] = 'wrap-reverse'
        }
      }
    }

    const layoutConfig = doricModel.nativeViewModel.props.layoutConfig as LayoutConfig

    if (layoutConfig) {
      if (layoutConfig.widthSpec == LayoutSpec.FIT) {
        if (flexConfig.width) {
          const type = Object.getPrototypeOf(flexConfig.width)
          if (type == Number.prototype) {
            doricStyle.width = toPixelString((flexConfig.width as number) || 0)
          }
        }

        if (flexConfig.height) {
          const type = Object.getPrototypeOf(flexConfig.height)
          if (type == Number.prototype) {
            doricStyle.height = toPixelString((flexConfig.height as number) || 0)
          }
        }
      }
    }

    this.cssStyle = toCSSStyle(doricStyle)
  }
}
</script>

<style>
.doric-flexlayout {
  display: flex;
  overflow: hidden;
}
</style>
