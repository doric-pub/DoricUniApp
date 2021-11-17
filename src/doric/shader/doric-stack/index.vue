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
      async handler(newVal) {
        const doricModel = newVal as DoricModel;
        this.$set(this.$data, "id", doricModel.nativeViewModel.id);
        this.$set(this.$data, "cssStyle", toCSSStyle(doricModel.cssStyle));

        let children = getChildren(doricModel);

        let childStyles: Array<String> = [];

        let containsChildWithJustWidth = false;
        let containsChildWithJustHeight = false;
        for (let index = 0; index < children.length; index++) {
          const child = children[index];
          if (child.nativeViewModel.props.layoutConfig) {
            let layoutConfig = child.nativeViewModel.props
              .layoutConfig as LayoutConfig;
            if (layoutConfig.widthSpec == LayoutSpec.JUST) {
              containsChildWithJustWidth = true;
            }
            if (layoutConfig.heightSpec == LayoutSpec.JUST) {
              containsChildWithJustHeight = true;
            }
          }
        }

        for (let index = 0; index < children.length; index++) {
          const child = children[index];
          let childStyle: Record<string, string> = {};

          childStyle["position"] = "absolute";

          if (child.nativeViewModel.props.layoutConfig) {
            let layoutConfig = child.nativeViewModel.props
              .layoutConfig as LayoutConfig;

            let selfLayoutConfig = doricModel.nativeViewModel.props
              .layoutConfig as LayoutConfig;
            if (layoutConfig.widthSpec == LayoutSpec.MOST) {
              if (
                selfLayoutConfig &&
                selfLayoutConfig.widthSpec == LayoutSpec.FIT
              ) {
                if (containsChildWithJustWidth) {
                } else {
                  layoutConfig.widthSpec = LayoutSpec.FIT;
                }
              }
              childStyle["width"] = "100%";
            }
            if (layoutConfig.heightSpec == LayoutSpec.MOST) {
              if (
                selfLayoutConfig &&
                selfLayoutConfig.heightSpec == LayoutSpec.FIT
              ) {
                if (containsChildWithJustHeight) {
                } else {
                  layoutConfig.heightSpec = LayoutSpec.FIT;
                }
              }
              childStyle["height"] = "100%";
            }
          }

          let childStyleString = Object.entries(childStyle)
            .map((e) => `${e[0]}:${e[1]}`)
            .join(";");
          childStyles.push(childStyleString);
        }

        this.$set(this.$data, "children", children);
        this.$set(this.$data, "childStyles", childStyles);

        // handle stack size
        await this.calculateStackSize();
        let parent = this.$parent as any;
        while (parent) {
          if (parent.doricModelProps) {
            if (
              parent.doricModelProps.nativeViewModel.type === "Stack" &&
              parent.calculateStackSize
            ) {
              await parent.calculateStackSize();
            }
          }
          parent = parent.$parent;
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
              rect: true,
              size: true,
              computedStyle: [
                "margin-left",
                "margin-right",
                "margin-top",
                "margin-bottom",
                "padding-left",
                "padding-right",
                "padding-top",
                "padding-bottom",
              ],
            },
            (result) => {
              resolve(result);
            }
          )
          .exec();
      });
    },

    async calculateStackSize() {
      const doricModel = this.$props.doricModelProps;
      const selfLayoutConfig = doricModel.nativeViewModel.props
        .layoutConfig as LayoutConfig;
      let cssStyle = doricModel.cssStyle;
      if (selfLayoutConfig) {
        if (selfLayoutConfig.widthSpec === LayoutSpec.FIT) {
          let maxX = await this.calculateWidth();
          cssStyle["width"] = `${maxX}px`;
        }

        if (selfLayoutConfig.heightSpec === LayoutSpec.FIT) {
          let maxY = await this.calculateHeight();
          cssStyle["height"] = `${maxY}px`;
        }
      }

      const parentLayoutConfig = (<any>this.$parent.$parent).doricModelProps
        .nativeViewModel.props.layoutConfig as LayoutConfig;

      if (parentLayoutConfig && selfLayoutConfig) {
        let parentType = (<any>this.$parent.$parent).doricModelProps
          .nativeViewModel.type;
        if (
          selfLayoutConfig.widthSpec == LayoutSpec.MOST &&
          parentLayoutConfig.widthSpec == LayoutSpec.FIT
        ) {
          if (parentType === "VLayout" || parentType === "Stack") {
            let result = await (<any>this.$parent.$parent).computeSize();
            if (parentType === "Stack") {
              let childNodes = (<any>(
                this.$parent.$parent.$refs.childNodes
              )) as any[];
              if (childNodes) {
                for (let index = 0; index < childNodes.length; index++) {
                  const childNode = childNodes[index].$children[0];
                  await childNode.computeSize();
                }
              }
              result = await (<any>this.$parent.$parent).computeSize();
            }

            let allowedWidth =
              result.width -
              parseFloat((result["padding-left"] as string).replace("px", "")) -
              parseFloat(
                (result["padding-right"] as string).replace("px", "")
              ) -
              (cssStyle["margin-left"]
                ? parseFloat(
                    (cssStyle["margin-left"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["margin-right"]
                ? parseFloat(
                    (cssStyle["margin-right"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["padding-left"]
                ? parseFloat(
                    (cssStyle["padding-left"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["padding-right"]
                ? parseFloat(
                    (cssStyle["padding-right"] as string).replace("px", "")
                  )
                : 0);
            cssStyle["width"] = `${allowedWidth}px`;
          } else {
            let maxX = await this.calculateWidth();
            cssStyle["width"] = `${maxX}px`;
          }
        }
        if (
          selfLayoutConfig.heightSpec == LayoutSpec.MOST &&
          parentLayoutConfig.heightSpec == LayoutSpec.FIT
        ) {
          if (parentType === "HLayout" || parentType === "Stack") {
            let result = await (<any>this.$parent.$parent).computeSize();
            if (parentType === "Stack") {
              let childNodes = (<any>(
                this.$parent.$parent.$refs.childNodes
              )) as any[];
              if (childNodes) {
                for (let index = 0; index < childNodes.length; index++) {
                  const childNode = childNodes[index].$children[0];
                  await childNode.computeSize();
                }
              }
              result = await (<any>this.$parent.$parent).computeSize();
            }

            let allowedHeight =
              result.height -
              parseFloat((result["padding-top"] as string).replace("px", "")) -
              parseFloat(
                (result["padding-bottom"] as string).replace("px", "")
              ) -
              (cssStyle["margin-top"]
                ? parseFloat(
                    (cssStyle["margin-top"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["margin-bottom"]
                ? parseFloat(
                    (cssStyle["margin-bottom"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["padding-top"]
                ? parseFloat(
                    (cssStyle["padding-top"] as string).replace("px", "")
                  )
                : 0) -
              (cssStyle["padding-bottom"]
                ? parseFloat(
                    (cssStyle["padding-bottom"] as string).replace("px", "")
                  )
                : 0);
            cssStyle["height"] = `${allowedHeight}px`;
          } else {
            let maxY = await this.calculateHeight();
            cssStyle["height"] = `${maxY}px`;
          }
        }
      }

      this.$set(this.$data, "cssStyle", toCSSStyle(cssStyle));
    },

    async calculateWidth() {
      let childNodes = this.$refs.childNodes as any[];
      let maxX = 0;
      if (childNodes) {
        let promises: any[] = [];
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
      }
      return maxX;
    },

    async calculateHeight() {
      let childNodes = this.$refs.childNodes as any[];
      let maxY = 0;
      if (childNodes) {
        let promises: any[] = [];
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
      }
      return maxY;
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
