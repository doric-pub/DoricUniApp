<template>
  <image
    class="doric-image"
    :src="imageUrl"
    :style="cssStyle"
    @load="onload"
    :mode="mode"
  >
  </image>
</template>

<script lang="ts">
import Vue from "vue";

import { Image, ScaleType } from "doric";
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
        const props = (newVal as DoricModel).nativeViewModel
          .props as Partial<Image>;

        if (props.imageUrl) {
          this.$set(this.$data, "imageUrl", props.imageUrl);
        }

        if (props.imageBase64) {
          this.$set(this.$data, "imageUrl", props.imageBase64);
        }

        if (props.scaleType) {
          switch (props.scaleType) {
            case ScaleType.ScaleAspectFit:
              this.$set(this.$data, "mode", "aspectFit");
              break;
            case ScaleType.ScaleAspectFill:
              this.$set(this.$data, "mode", "aspectFill");
              break;
            default:
              this.$set(this.$data, "mode", "scaleToFill");
              break;
          }
        }

        let cssStyle = (newVal as DoricModel).cssStyle;

        if (props.isBlur) {
          cssStyle["filter"] = "blur(8px)";
        }

        this.$set(this.$data, "cssStyle", toCSSStyle(cssStyle));
      },
    },
  },
  data() {
    return {
      cssStyle: null,
      imageUrl: null,
      mode: "scaleToFill",
    };
  },

  methods: {
    onload(event: any) {
      const doricStyle = (this.$props.doricModelProps as DoricModel).cssStyle;
      if (doricStyle["width"] === "max-content") {
        doricStyle["width"] = `${event.detail.width}px`;
      }
      if (doricStyle["height"] === "max-content") {
        doricStyle["height"] = `${event.detail.height}px`;
      }

      const cssStyle = Object.entries(doricStyle)
        .map((e) => `${e[0]}:${e[1]}`)
        .join(";");
      this.$set(this.$data, "cssStyle", cssStyle);
    },
  },
});
</script>

<style>
.doric-image {
}
</style>
