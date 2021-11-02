<template>
  <switch
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
        const props = (newVal as DoricModel).nativeViewModel
          .props as Partial<Switch>;
        const doricStyle = (newVal as DoricModel).cssStyle;
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
      cssStyle: null,

      checked: false,
      onSwitch: null,
    };
  },

  methods: {
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
