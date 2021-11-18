<template>
  <view class="doric-container">
    <view class="doric-node-container">
      <DoricNode :doric-model-props="doricModel" ref="doricContainer" />
    </view>
    <view v-if="popoverDoricModels.length !== 0" class="doric-popover-container">
      <DoricNode
        v-for="item in popoverDoricModels"
        :key="item.nativeViewModel.id"
        :doric-model-props="item"
        ref="doricPopoverContainers"
      />
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { BridgeContext, uniqueId } from 'doric'
import { callEntityMethod, createContext, destroyContext } from '@/doric/context'
import { DoricModel, Queue } from '@/doric/utils'

import { Shader } from '@/doric/plugin/shader'
import { Modal } from '@/doric/plugin/modal'
import { Popover } from '@/doric/plugin/popover'
import { Storage } from '@/doric/plugin/storage'

import { ComponentDemo } from '@/demo/ComponentDemo'
import { CounterPage } from '@/demo/Counter'
import { EffectsDemo } from '@/demo/EffectsDemo'
import { Gobang } from '@/demo/Gobang'
import { HelloDoric } from '@/demo/HelloDoric'
import { ImageDemo } from '@/demo/ImageDemo'
import { InputDemo } from '@/demo/InputDemo'
import { LayoutDemo } from '@/demo/LayoutDemo'
import { LayoutTest } from '@/demo/LayoutTestDemo'
import { ModalDemo } from '@/demo/ModalDemo'
import { ModularDemo } from '@/demo/ModularDemo'
import { NetworkDemo } from '@/demo/NetworkDemo'
import { SliderPanel } from '@/demo/SliderDemo'
import { SnakePanel } from '@/demo/Snake'
import { StorageDemo } from '@/demo/StorageDemo'
import { SwitchDemo } from '@/demo/SwitchDemo'
import { TextDemo } from '@/demo/TextDemo'

const global = new Function('return this')()
global.Environment = {
  platform: 'uni-app',
  localeLanguage: 'zh',
  localeCountry: 'CN',
}
let globalContext: BridgeContext

@Component({
  name: 'index',
})
export default class extends Vue {
  doricModel: any = null
  popoverDoricModels: any[] = []
  onLoad (option: AnyObject) {
    const name = option.name
    const contextId = uniqueId('context')
    const classType = this.getComponent(name)
    const context = createContext(contextId, classType!)
    const panel = context.entity

    globalContext = context

    // #region Plugins
    context.plugins.set('modal', new Modal(context))

    const popover = new Popover(context)
    const self = this
    popover.onModelsChange = function (popoverDoricModels: DoricModel[]) {
      if (popoverDoricModels.length > 0) {
        self.popoverDoricModels = popoverDoricModels
      } else {
        self.popoverDoricModels = []
      }
    }
    context.plugins.set('popover', popover)

    const shader = new Shader(context)
    shader.targetView = (value: { viewIds: Array<string>; name: string; args: any[] }) => {
      const queue = new Queue()
      for (let index = 0; index < value.viewIds.length; index++) {
        const viewId = value.viewIds[index]
        queue.enqueue(viewId)
      }

      let tempNode
      const doricContainer = this.$refs.doricContainer as any
      if (doricContainer) {
        if (queue.peek() === doricContainer.doricModelProps.nativeViewModel.id) {
          tempNode = doricContainer
          queue.dequeue()
        }
      }

      const doricPopoverContainers = this.$refs.doricPopoverContainers as any[]
      if (doricPopoverContainers) {
        for (let index = 0; index < doricPopoverContainers.length; index++) {
          const doricPopoverContainer = doricPopoverContainers[index]

          if (queue.peek() === doricPopoverContainer.doricModelProps.nativeViewModel.id) {
            tempNode = doricPopoverContainer
            continue
          }
        }
      }

      if (tempNode) {
        while (queue.length > 0) {
          const children = tempNode.$children[0].$children as any[]
          if (children) {
            let find = false
            for (let index = 0; index < children.length; index++) {
              const child = children[index]
              if (queue.peek() === child.doricModelProps.nativeViewModel.id) {
                tempNode = child
                queue.dequeue()
                find = true
              }
            }
            if (!find) {
              console.error(`Cannot find target view ${queue.peek()}`)
            }
          } else {
            console.error(`Cannot find target view ${queue.peek()}`)
            break
          }
        }
      }

      return tempNode.$children[0]
    }
    context.plugins.set('shader', shader)

    const storage = new Storage(context)
    context.plugins.set('storage', storage)

    // #endregion

    context.hookAfter = () => {
      console.log('hookAfter', panel.getRootView().toModel())
      this.doricModel = {
        contextId,
        nativeViewModel: panel.getRootView().toModel(),
        cssStyle: {},
        idList: [panel.getRootView().viewId],
      } as DoricModel
      callEntityMethod(context.id, '__onCreate__')
    }
  }

  onReady () {
    uni
      .createSelectorQuery()
      .select('.doric-container')
      .fields(
        {
          size: true,
        },
        data => {
          callEntityMethod(globalContext.id, '__build__', {
            width: data.width,
            height: data.height,
          })
        },
      )
      .exec()
  }

  onShow () {
    callEntityMethod(globalContext.id, '__onShow__')
  }

  onHide () {
    callEntityMethod(globalContext.id, '__onHidden__')
  }

  onUnload () {
    callEntityMethod(globalContext.id, '__onDestroy__')
    if (this.doricModel.contextId) destroyContext(this.doricModel.contextId)
  }

  getComponent (name: string) {
    let classType
    switch (name) {
      case 'ComponentDemo':
        classType = ComponentDemo
        break
      case 'Counter':
        classType = CounterPage
        break
      case 'EffectsDemo':
        classType = EffectsDemo
        break
      case 'Gobang':
        classType = Gobang
        break
      case 'HelloDoric':
        classType = HelloDoric
        break
      case 'ImageDemo':
        classType = ImageDemo
        break
      case 'InputDemo':
        classType = InputDemo
        break
      case 'LayoutDemo':
        classType = LayoutDemo
        break
      case 'LayoutTestDemo':
        classType = LayoutTest
        break
      case 'ModalDemo':
        classType = ModalDemo
        break
      case 'ModularDemo':
        classType = ModularDemo
        break
      case 'NetworkDemo':
        classType = NetworkDemo
        break
      case 'SliderDemo':
        classType = SliderPanel
        break
      case 'Snake':
        classType = SnakePanel
        break
      case 'StorageDemo':
        classType = StorageDemo
        break
      case 'SwitchDemo':
        classType = SwitchDemo
        break
      case 'TextDemo':
        classType = TextDemo
        break
    }
    return classType
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
}

.doric-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.doric-node-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.doric-popover-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
