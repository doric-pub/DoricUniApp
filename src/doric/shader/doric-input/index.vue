<template>
  <input :id="id" class="doric-input" :style="cssStyle" />
</template>

<script lang="ts">
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
      },
    },
  },
  data() {
    return {
      id: null,
      cssStyle: null,
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
.doric-input {
}
</style>
