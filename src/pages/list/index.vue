<template>
  <view class="demo-container">
    <text class="cell" @tap="click('AnimationsDemo')">
      AnimationsDemo
    </text>
    <text class="cell" @tap="click('ComponentDemo')">
      ComponentDemo
    </text>
    <text class="cell" @tap="click('Counter')">
      Counter
    </text>
    <text class="cell" @tap="click('EffectsDemo')">
      EffectsDemo
    </text>
    <text class="cell" @tap="click('FlexDemo')">
      FlexDemo
    </text>
    <text class="cell" @tap="click('Gobang')">
      Gobang
    </text>
    <text class="cell" @tap="click('HelloDoric')">
      HelloDoric
    </text>
    <text class="cell" @tap="click('ImageDemo')">
      ImageDemo
    </text>
    <text class="cell" @tap="click('InputDemo')">
      InputDemo
    </text>
    <text class="cell" @tap="click('LayoutDemo')">
      LayoutDemo
    </text>
    <text class="cell" @tap="click('LayoutTestDemo')">
      LayoutTestDemo
    </text>
    <text class="cell" @tap="click('ListDemo')">
      ListDemo
    </text>
    <text class="cell" @tap="click('ModalDemo')">
      ModalDemo
    </text>
    <text class="cell" @tap="click('ModularDemo')">
      ModularDemo
    </text>
    <text class="cell" @tap="click('NetworkDemo')">
      NetworkDemo
    </text>
    <text class="cell" @tap="click('SliderDemo')">
      SliderDemo
    </text>
    <text class="cell" @tap="click('Snake')">
      Snake
    </text>
    <text class="cell" @tap="click('StorageDemo')">
      StorageDemo
    </text>
    <text class="cell" @tap="click('SwitchDemo')">
      SwitchDemo
    </text>
    <text class="cell" @tap="click('TextDemo')">
      TextDemo
    </text>
  </view>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'list',
})
export default class extends Vue {
  click (name: string) {
    console.log(name)
    uni.navigateTo({
      url: '/pages/index/index?name=' + name,
    })
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
}

.demo-container {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: column;
}

.cell {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-color: #eee;
  border-width: 1px;
}
</style>
