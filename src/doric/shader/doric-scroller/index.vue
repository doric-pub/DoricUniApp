<template>
  <view :id="id" class="doric-scroller" :style="cssStyle">
    <DoricNode
      v-for="(item, index) in children"
      v-bind:key="item.nativeViewModel.id"
      :doricModelProps="item"
      :style="index == children.length - 1 ? null : style"
    />
  </view>
</template>

<script lang="ts">
import { NativeViewModel } from "doric";
import Vue from "vue";

import { DoricModel, toCSSStyle } from "../../../doric/utils";

export default Vue.extend({
  props: {
    doricModelProps: {
      type: Object,
    },
  },
  watch: {
    doricModelProps: {
      immediate: true,
      handler(newVal) {
        const doricModel = newVal as DoricModel;
        this.$set(this.$data, "id", doricModel.nativeViewModel.id);
        this.$set(this.$data, "cssStyle", toCSSStyle(doricModel.cssStyle));

        let props = doricModel.nativeViewModel.props;
        if (props.content) {
          let subviews = doricModel.nativeViewModel.props
            .subviews as NativeViewModel[];
          let children = subviews.map((nativeViewModel) => {
            return {
              contextId: doricModel.contextId,
              nativeViewModel: nativeViewModel,
              cssStyle: {},
              idList: [...doricModel.idList, nativeViewModel.id],
            };
          });
          this.$set(this.$data, "children", children);
        }
      },
    },
  },
  data() {
    return {
      // self data
      id: null,
      cssStyle: null,

      // children data
      children: null,
    };
  },

  methods: {
    computeSize() {
      uni
        .createSelectorQuery()
        .in(this)
        .select("#" + this.$data.id)
        .fields(
          {
            size: true,
            computedStyle: [
              "margin-left",
              "margin-right",
              "margin-top",
              "margin-bottom",
            ],
          },
          (result) => {
            console.log(result);
          }
        )
        .exec();
    },
  },
});
</script>

<style>
.doric-scroller {
  overflow: scroll;
}
.doric-scroller::-webkit-scrollbar {
  display: none;
}
</style>
