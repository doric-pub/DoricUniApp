<template>
  <view class="doric-container">
    <view class="doric-node-container">
      <DoricNode :doricModelProps="doricModel" ref="doricContainer"></DoricNode>
    </view>
    <view v-if="popoverDoricModels.length != 0" class="doric-popover-container">
      <DoricNode
        v-for="item in popoverDoricModels"
        v-bind:key="item.nativeViewModel.id"
        :doricModelProps="item"
        ref="doricPopoverContainers"
      />
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";

import { ClassType, Panel, uniqueId } from "doric";
import {
  callEntityMethod,
  createContext,
  destroyContext,
} from "../../doric/context";
import { DoricModel, Queue } from "../../doric/utils";

import { Shader } from "../../doric/plugin/shader";
import { Modal } from "../../doric/plugin/modal";
import { Popover } from "../../doric/plugin/popover";

import { ComponentDemo } from "../../demo/ComponentDemo";
import { CounterPage } from "../../demo/Counter";
import { EffectsDemo } from "../../demo/EffectsDemo";
import { Gobang } from "../../demo/Gobang";
import { HelloDoric } from "../../demo/HelloDoric";
import { ImageDemo } from "../../demo/ImageDemo";
import { InputDemo } from "../../demo/InputDemo";
import { LayoutDemo } from "../../demo/LayoutDemo";
import { LayoutTest } from "../../demo/LayoutTestDemo";
import { ModalDemo } from "../../demo/ModalDemo";
import { ModularDemo } from "../../demo/ModularDemo";
import { NetworkDemo } from "../../demo/NetworkDemo";
import { SliderPanel } from "../../demo/SliderDemo";
import { SnakePanel } from "../../demo/Snake";
import { StorageDemo } from "../../demo/StorageDemo";
import { SwitchDemo } from "../../demo/SwitchDemo";
import { TextDemo } from "../../demo/TextDemo";

let global = new Function("return this")();
global.Environment = {
  platform: "uni-app",
};

export default Vue.extend({
  data() {
    return {
      doricModel: null,
      popoverDoricModels: [],
    };
  },
  onLoad(option: AnyObject) {
    let name = option.name;

    const contextId = uniqueId("context");

    let classType: ClassType<Panel>;
    if (name == "ComponentDemo") {
      classType = ComponentDemo;
    } else if (name == "Counter") {
      classType = CounterPage;
    } else if (name == "EffectsDemo") {
      classType = EffectsDemo;
    } else if (name == "Gobang") {
      classType = Gobang;
    } else if (name == "HelloDoric") {
      classType = HelloDoric;
    } else if (name == "ImageDemo") {
      classType = ImageDemo;
    } else if (name == "InputDemo") {
      classType = InputDemo;
    } else if (name == "LayoutDemo") {
      classType = LayoutDemo;
    } else if (name == "LayoutTestDemo") {
      classType = LayoutTest;
    } else if (name == "ModalDemo") {
      classType = ModalDemo;
    } else if (name == "ModularDemo") {
      classType = ModularDemo;
    } else if (name == "NetworkDemo") {
      classType = NetworkDemo;
    } else if (name == "SliderDemo") {
      classType = SliderPanel;
    } else if (name == "Snake") {
      classType = SnakePanel;
    } else if (name == "StorageDemo") {
      classType = StorageDemo;
    } else if (name == "SwitchDemo") {
      classType = SwitchDemo;
    } else if (name == "TextDemo") {
      classType = TextDemo;
    }
    const context = createContext(contextId, classType!!);

    const panel = context.entity;

    global.context = context;

    //#region Plugins
    context.plugins.set("modal", new Modal(context));

    const popover = new Popover(context);
    let self = this;
    popover.onModelsChange = function (popoverDoricModels: DoricModel[]) {
      self.$set(self.$data, "popoverDoricModels", popoverDoricModels);
    };
    context.plugins.set("popover", popover);

    const shader = new Shader(context);
    shader.targetView = (value: {
      viewIds: Array<string>;
      name: string;
      args: any[];
    }) => {
      let queue = new Queue();
      for (let index = 0; index < value.viewIds.length; index++) {
        const viewId = value.viewIds[index];
        queue.enqueue(viewId);
      }

      let tempNode;
      const doricContainer = this.$refs.doricContainer as any;
      if (doricContainer) {
        if (
          queue.peek() === doricContainer.doricModelProps.nativeViewModel.id
        ) {
          tempNode = doricContainer;
          queue.dequeue();
        }
      }

      const doricPopoverContainers = this.$refs.doricPopoverContainers as any[];
      if (doricPopoverContainers) {
        for (let index = 0; index < doricPopoverContainers.length; index++) {
          const doricPopoverContainer = doricPopoverContainers[index];

          if (
            queue.peek() ===
            doricPopoverContainer.doricModelProps.nativeViewModel.id
          ) {
            tempNode = doricPopoverContainer;
            continue;
          }
        }
      }

      if (tempNode) {
        while (queue.length > 0) {
          let children = tempNode.$children[0].$children as any[];
          if (children) {
            let find = false;
            for (let index = 0; index < children.length; index++) {
              const child = children[index];
              if (queue.peek() === child.doricModelProps.nativeViewModel.id) {
                tempNode = child;
                queue.dequeue();
                find = true;
              }
            }
            if (!find) {
              console.error(`Cannot find target view ${queue.peek()}`);
            }
          } else {
            console.error(`Cannot find target view ${queue.peek()}`);
            break;
          }
        }
      }

      return tempNode.$children[0];
    };
    context.plugins.set("shader", shader);

    //#endregion

    context.hookAfter = () => {
      console.log("hookAfter", panel.getRootView().toModel());
      let model = {
        contextId,
        nativeViewModel: panel.getRootView().toModel(),
        cssStyle: {},
        idList: [panel.getRootView().viewId],
      } as DoricModel;
      this.$set(this.$data, "doricModel", model);
      callEntityMethod(context.id, "__onCreate__");
    };
  },
  onReady() {
    uni
      .createSelectorQuery()
      .select(".doric-container")
      .fields(
        {
          size: true,
        },
        (data) => {
          callEntityMethod(context.id, "__build__", {
            width: data.width,
            height: data.height,
          });
        }
      )
      .exec();
  },
  onShow() {
    callEntityMethod(context.id, "__onShow__");
  },
  onHide() {
    callEntityMethod(context.id, "__onHidden__");
  },
  onUnload() {
    callEntityMethod(context.id, "__onDestroy__");
    destroyContext(this.$data.doricModel.contextId);
  },
  methods: {},
});
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
