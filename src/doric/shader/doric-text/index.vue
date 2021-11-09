<template>
  <div :id="id" class="doric-text" :style="cssStyle">
    <span v-if="text != null && htmlText == null" :style="innerStyle">{{
      text
    }}</span>
    <rich-text
      v-if="text == null && htmlText != null"
      :nodes="htmlText"
    ></rich-text>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { GradientColor, GradientOrientation, Text } from "doric";

import {
  LEFT,
  RIGHT,
  CENTER_X,
  CENTER_Y,
  BOTTOM,
  TOP,
  DoricModel,
  toCSSStyle,
  toPixelString,
  toRGBAString,
} from "../../../doric/utils";

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

        const props = doricModel.nativeViewModel.props as Partial<Text>;
        const doricStyle = doricModel.cssStyle;

        let innerStyle = {} as any;
        innerStyle["white-space"] = "pre-line";

        if (props.text) {
          this.$set(this.$data, "text", props.text);
        }

        if (props.textColor) {
          if (typeof props.textColor === "number") {
            doricStyle["color"] = toRGBAString(
              props.textColor as unknown as number
            );
          } else if (typeof props.textColor === "object") {
            innerStyle["-webkit-background-clip"] = "text";
            innerStyle["color"] = "transparent";

            let gradient = props.textColor as GradientColor;

            let deg = "";
            switch (gradient.orientation) {
              case GradientOrientation.TOP_BOTTOM:
                deg = "180deg";
                break;
              case GradientOrientation.TR_BL:
                deg = "-135deg";
                break;
              case GradientOrientation.RIGHT_LEFT:
                deg = "-90deg";
                break;
              case GradientOrientation.BR_TL:
                deg = "-45deg";
                break;
              case GradientOrientation.BOTTOM_TOP:
                deg = "0deg";
                break;
              case GradientOrientation.BL_TR:
                deg = "45deg";
                break;
              case GradientOrientation.LEFT_RIGHT:
                deg = "90deg";
                break;
              case GradientOrientation.TL_BR:
                deg = "135deg";
                break;
            }

            if (gradient.start && gradient.end) {
              innerStyle[
                "background-image"
              ] = `linear-gradient(${deg}, ${toRGBAString(
                gradient.start as unknown as number
              )}, ${toRGBAString(gradient.end as unknown as number)});`;
            } else {
              if (gradient.locations) {
                if (gradient.colors) {
                  const colors = gradient.colors
                    .map(
                      (e, index) =>
                        `${toRGBAString(e as unknown as number)} ${
                          (
                            (gradient.locations!![index] as unknown as number) *
                            100
                          ).toFixed(2) + "%"
                        }`
                    )
                    .join(",");
                  innerStyle[
                    "background-image"
                  ] = `linear-gradient(${deg}, ${colors});`;
                }
              } else {
                if (gradient.colors) {
                  const colors = gradient.colors
                    .map((e) => `${toRGBAString(e as unknown as number)}`)
                    .join(",");
                  innerStyle[
                    "background-image"
                  ] = `linear-gradient(${deg}, ${colors});`;
                }
              }
            }
          }
        }

        if (props.textSize) {
          doricStyle["font-size"] = toPixelString(props.textSize);
        }

        if (props.textAlignment) {
          const gravity = props.textAlignment as unknown as number;
          if ((gravity & LEFT) === LEFT) {
            doricStyle["justify-content"] = "flex-start";
          } else if ((gravity & RIGHT) === RIGHT) {
            doricStyle["justify-content"] = "flex-end";
          } else if ((gravity & CENTER_X) === CENTER_X) {
            doricStyle["justify-content"] = "center";
          }
          if ((gravity & TOP) === TOP) {
            doricStyle["align-items"] = "flex-start";
          } else if ((gravity & BOTTOM) === BOTTOM) {
            doricStyle["align-items"] = "flex-end";
          } else if ((gravity & CENTER_Y) === CENTER_Y) {
            doricStyle["align-items"] = "center";
          }
        }

        if (Object.keys(doricStyle).includes("box-shadow")) {
          let shadow = doricStyle["box-shadow"];
          innerStyle["text-shadow"] = shadow;
          delete doricStyle["box-shadow"];
        }

        if (props.fontStyle) {
          if (props.fontStyle === "bold") {
            innerStyle["font-weight"] = "bold";
            innerStyle["font-style"] = "normal";
          } else if (props.fontStyle === "italic") {
            innerStyle["font-weight"] = "normal";
            innerStyle["font-style"] = "italic";
          } else if (props.fontStyle === "bold_italic") {
            innerStyle["font-weight"] = "bold";
            innerStyle["font-style"] = "italic";
          }
        }

        if (props.lineSpacing) {
          innerStyle["line-height"] = `${props.lineSpacing}px`;
        }

        let decoration = [];
        if (props.strikethrough) {
          decoration.push("line-through");
        }

        if (props.underline) {
          decoration.push("underline");
        }

        innerStyle["text-decoration"] = decoration.map((e) => `${e}`).join(" ");

        if (props.htmlText) {
          this.$set(this.$data, "htmlText", props.htmlText);
        }

        this.$set(this.$data, "cssStyle", toCSSStyle(doricStyle));
        this.$set(this.$data, "innerStyle", toCSSStyle(innerStyle));
      },
    },
  },

  data() {
    return {
      id: null,
      cssStyle: null,

      text: null,
      htmlText: null,
      innerStyle: null,
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
.doric-text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
