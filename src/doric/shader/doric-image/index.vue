<template>
  <image
    :id="id"
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

        const props = doricModel.nativeViewModel.props as Partial<Image>;

        const doricStyle = doricModel.cssStyle;
        if (doricStyle["width"] === "max-content") {
          delete doricStyle["width"];
        }
        if (doricStyle["height"] === "max-content") {
          delete doricStyle["height"];
        }

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

        if (props.isBlur) {
          doricStyle["filter"] = "blur(8px)";
        }

        this.$set(this.$data, "cssStyle", toCSSStyle(doricStyle));

        if (props.loadCallback) {
          this.$set(this.$data, "loadCallback", props.loadCallback);
        }
      },
    },
  },
  data() {
    return {
      id: null,
      cssStyle: null,
      
      imageUrl: null,
      mode: "scaleToFill",
      loadCallback: null,
    };
  },

  methods: {
    onload(event: any) {
      let doricModel = this.$props.doricModelProps;
      if ((doricModel.idList, this.$data.loadCallback)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.loadCallback,
          {
            width: event.detail.width,
            height: event.detail.height,
          }
        );
      }
    },
  },
});
</script>

<style>
.doric-image {
}
</style>
