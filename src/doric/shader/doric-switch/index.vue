<template>
  <switch
    :id="id"
    class="doric-switch"
    :style="cssStyle"
    :checked="checked"
    @change="onChange"
  ></switch>
</template>

<script lang="ts">
import Vue from "vue";

import { Switch } from "doric";

import { DoricModel, toCSSStyle } from "../../../doric/utils";
import { callResponse } from "@/doric/context";

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

        const props = doricModel.nativeViewModel.props as Partial<Switch>;
        const doricStyle = doricModel.cssStyle;
        this.$set(this.$data, "cssStyle", toCSSStyle(doricStyle));

        if (props.state) {
          console.log("doric-switch", "toggle by code");
          this.$set(this.$data, "checked", props.state);
        }

        if (props.onSwitch) {
          this.$set(this.$data, "onSwitch", props.onSwitch);
        }
      },
    },
  },

  data() {
    return {
      id: null,
      cssStyle: null,

      checked: false,
      onSwitch: null,
    };
  },

  methods: {
    computeSize() {
      return new Promise((resolve, reject) => {
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
              resolve(result);
            }
          )
          .exec();
      });
    },
    onChange(event: any) {
      let doricModel = this.$props.doricModelProps;
      console.log(doricModel);
      if ((doricModel.idList, this.$data.onSwitch)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.onSwitch,
          event.detail.value
        );
      }
    },
  },
});
</script>

<style>
.doric-switch {
}
</style>
