<template>
  <view :id="id" class="doric-stack" :style="cssStyle">
    <DoricNode
      v-for="(item, index) in children"
      v-bind:key="item.nativeViewModel.id"
      :doricModelProps="item"
      :style="childStyles[index]"
      ref="childNodes"
    />
  </view>
</template>

<script lang="ts">
import { LayoutConfig, LayoutSpec } from "doric";
import Vue from "vue";

import { DoricModel, getChildren, toCSSStyle } from "../../../doric/utils";

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

        let children = getChildren(doricModel);

        let childStyles: Array<String> = [];

        for (let index = 0; index < children.length; index++) {
          const child = children[index];
          let childStyle: Record<string, string> = {};

          childStyle["position"] = "absolute";

          if (child.nativeViewModel.props.layoutConfig) {
            let layoutConfig = child.nativeViewModel.props
              .layoutConfig as LayoutConfig;

            if (layoutConfig.heightSpec == LayoutSpec.MOST) {
              childStyle["height"] = "100%";
            }

            if (layoutConfig.widthSpec == LayoutSpec.MOST) {
              childStyle["width"] = "100%";
            }
          }

          let childStyleString = Object.entries(childStyle)
            .map((e) => `${e[0]}:${e[1]}`)
            .join(";");
          childStyles.push(childStyleString);
        }

        this.$set(this.$data, "children", children);
        this.$set(this.$data, "childStyles", childStyles);

        this.$nextTick(async function () {
          const layoutConfig = doricModel.nativeViewModel.props
            .layoutConfig as LayoutConfig;

          let cssStyle = doricModel.cssStyle;
          if (layoutConfig.widthSpec === LayoutSpec.FIT) {
            let childNodes = this.$refs.childNodes as any[];
            if (childNodes) {
              let maxX = 0;

              let promises = [];
              for (let index = 0; index < childNodes.length; index++) {
                const childNode = childNodes[index];
                promises.push(childNode.$children[0].computeSize());
              }

              const results = await Promise.all(promises);
              results.forEach((result) => {
                let width = result["width"];
                let marginLeft = parseFloat(
                  (result["margin-left"] as string).replace("px", "")
                );
                let marginRight = parseFloat(
                  (result["margin-right"] as string).replace("px", "")
                );

                maxX = Math.max(maxX, width + marginLeft + marginRight);
              });

              cssStyle["width"] = `${maxX}px`;
            }
          }

          if (layoutConfig.heightSpec === LayoutSpec.FIT) {
            let childNodes = this.$refs.childNodes as any[];
            if (childNodes) {
              let maxY = 0;

              let promises = [];
              for (let index = 0; index < childNodes.length; index++) {
                const childNode = childNodes[index];
                promises.push(childNode.$children[0].computeSize());
              }

              const results = await Promise.all(promises);
              results.forEach((result) => {
                let height = result["height"];
                let marginTop = parseFloat(
                  (result["margin-top"] as string).replace("px", "")
                );
                let marginBottom = parseFloat(
                  (result["margin-bottom"] as string).replace("px", "")
                );

                maxY = Math.max(maxY, height + marginTop + marginBottom);
              });

              let cssStyle = doricModel.cssStyle;
              cssStyle["height"] = `${maxY}px`;
            }
          }

          this.$set(this.$data, "cssStyle", toCSSStyle(cssStyle));
        });
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
      childStyles: null,
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
  },
});
</script>

<style>
.doric-stack {
  position: relative;
  overflow: hidden;
}
</style>
