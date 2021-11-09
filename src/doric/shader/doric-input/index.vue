<template>
  <input
    v-if="!multiline"
    :id="id"
    class="doric-input"
    :style="cssStyle"
    :value="text"
    :placeholder="hintText"
    :placeholder-style="placeholderStyle"
    :type="type"
    :maxlength="maxLength"
    :password="password"
    :disabled="disabled"
    :confirm-type="confirmType"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    @confirm="onConfirm"
  />
  <textarea
    v-else
    :id="id"
    class="doric-input"
    :style="cssStyle"
    :auto-height="autoHeight"
    :value="text"
    :placeholder="hintText"
    :placeholder-style="placeholderStyle"
    :type="type"
    :maxlength="maxLength"
    :disabled="disabled"
    :confirm-type="confirmType"
    @input="onInput"
    @focus="onFocus"
    @blur="onBlur"
    @confirm="onConfirm"
  />
</template>

<script lang="ts">
import { callResponse } from "@/doric/context";
import { Input, InputType, LayoutSpec, ReturnKeyType } from "doric";
import Vue from "vue";

import {
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
        const cssStyle = doricModel.cssStyle;
        const placeholderStyle = {} as any;
        const props = doricModel.nativeViewModel.props as Partial<Input>;

        if (props.layoutConfig) {
          if (props.layoutConfig.heightSpec === LayoutSpec.FIT) {
            this.$set(this.$data, "autoHeight", true);
          }
        }

        if (props.text) {
          this.$set(this.$data, "text", props.text);
        }

        if (props.textColor) {
          cssStyle["color"] = toRGBAString(
            props.textColor as unknown as number
          );
        }

        if (props.textSize) {
          cssStyle["font-size"] = toPixelString(props.textSize);
        }

        if (props.hintText) {
          this.$set(this.$data, "hintText", props.hintText);
        }

        if (props.hintTextColor) {
          placeholderStyle["color"] = toRGBAString(
            props.hintTextColor as unknown as number
          );
        }

        if (props.inputType) {
          let inputType = props.inputType as number;
          switch (inputType) {
            case InputType.Default:
              this.$set(this.$data, "type", "text");
              break;
            case InputType.Number:
              this.$set(this.$data, "type", "number");
              break;
            case InputType.Decimal:
              this.$set(this.$data, "type", "digit");
              break;
            case InputType.Alphabet:
              this.$set(this.$data, "type", "text");
              break;
            case InputType.Phone:
              this.$set(this.$data, "type", "number");
              break;
          }
        }

        if (props.maxLength) {
          this.$set(this.$data, "maxLength", props.maxLength);
        }

        if (props.password) {
          this.$set(this.$data, "password", true);
        } else {
          this.$set(this.$data, "password", false);
        }

        if (props.editable !== undefined) {
          if (props.editable) {
            this.$set(this.$data, "disabled", false);
          } else {
            this.$set(this.$data, "disabled", true);
          }
        }

        if (props.returnKeyType) {
          switch (props.returnKeyType as number) {
            case ReturnKeyType.Default:
              this.$set(this.$data, "confirmType", "");
              break;
            case ReturnKeyType.Done:
              this.$set(this.$data, "confirmType", "done");
              break;
            case ReturnKeyType.Search:
              this.$set(this.$data, "confirmType", "search");
              break;
            case ReturnKeyType.Next:
              this.$set(this.$data, "confirmType", "next");
              break;
            case ReturnKeyType.Go:
              this.$set(this.$data, "confirmType", "go");
              break;
            case ReturnKeyType.Send:
              this.$set(this.$data, "confirmType", "send");
              break;
          }
        }

        if (props.multiline) {
          this.$set(this.$data, "multiline", true);
        } else {
          this.$set(this.$data, "multiline", false);
        }

        if (props.onTextChange) {
          this.$set(this.$data, "onTextChange", props.onTextChange);
        }

        if (props.onFocusChange) {
          this.$set(this.$data, "onFocusChange", props.onFocusChange);
        }

        if (props.onSubmitEditing) {
          this.$set(this.$data, "onSubmitEditing", props.onSubmitEditing);
        }

        this.$set(this.$data, "cssStyle", toCSSStyle(cssStyle));
        this.$set(this.$data, "placeholderStyle", toCSSStyle(placeholderStyle));
      },
    },
  },
  data() {
    return {
      id: null,
      cssStyle: null,
      autoHeight: false,

      text: "",
      hintText: "",
      placeholderStyle: "",
      type: "text",
      password: false,
      disabled: false,
      confirmType: "",
      maxLength: 140,
      multiline: true,

      onTextChange: null,
      onFocusChange: null,
      onSubmitEditing: null,
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

    onInput(event: any) {
      let doricModel = this.$props.doricModelProps;
      if ((doricModel.idList, this.$data.onTextChange)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.onTextChange,
          event.detail.value
        );
      }
    },

    onFocus() {
      let doricModel = this.$props.doricModelProps;
      if ((doricModel.idList, this.$data.onFocusChange)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.onFocusChange,
          true
        );
      }
    },

    onBlur() {
      let doricModel = this.$props.doricModelProps;
      if ((doricModel.idList, this.$data.onFocusChange)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.onFocusChange,
          false
        );
      }
    },

    onConfirm(event: any) {
      let doricModel = this.$props.doricModelProps;
      if ((doricModel.idList, this.$data.onSubmitEditing)) {
        callResponse(
          doricModel.contextId,
          doricModel.idList,
          this.$data.onSubmitEditing,
          event.detail.value
        );
      }
    },
  },
});
</script>

<style>
.doric-input {
}
</style>
