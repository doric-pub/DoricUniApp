<template>
  <view class="doric-container">
    <view class="doric-node-container">
      <DoricNode :doricModelProps="doricModel"></DoricNode>
    </view>
    <view v-if="popoverDoricModels.length != 0" class="doric-popover-container">
      <DoricNode
        v-for="item in popoverDoricModels"
        v-bind:key="item.nativeViewModel.id"
        :doricModelProps="item"
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
import { DoricModel } from "../../doric/utils";

import { Modal } from "../../doric/plugin/modal";
import { Popover } from "../../doric/plugin/popover";

import { ComponentDemo } from "../../demo/ComponentDemo";
import { EffectsDemo } from "../../demo/EffectsDemo";
import { HelloDoric } from "../../demo/HelloDoric";
import { ImageDemo } from "../../demo/ImageDemo";
import { SnakePanel } from "../../demo/Snake";
import { LayoutDemo } from "../../demo/LayoutDemo";
import { ModalDemo } from "../../demo/ModalDemo";
import { Gobang } from "../../demo/Gobang";

let global = new Function("return this")();
global.Environment = {
  platform: 'uni-app'
}

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
    } else if (name == "EffectsDemo") {
      classType = EffectsDemo;
    } else if (name == "Gobang") {
      classType = Gobang;
    } else if (name == "HelloDoric") {
      classType = HelloDoric;
    } else if (name == "ImageDemo") {
      classType = ImageDemo;
    } else if (name == "LayoutDemo") {
      classType = LayoutDemo;
    } else if (name == "ModalDemo") {
      classType = ModalDemo;
    } else if (name == "Snake") {
      classType = SnakePanel;
    }
    const context = createContext(contextId, classType!!);

    const panel = context.entity;

    global.context = context;

    context.plugins.set("modal", new Modal(context));

    const popover = new Popover(context);
    let self = this;
    popover.onModelsChange = function (popoverDoricModels: DoricModel[]) {
      self.$set(self.$data, "popoverDoricModels", popoverDoricModels);
    };
    context.plugins.set("popover", popover);

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
