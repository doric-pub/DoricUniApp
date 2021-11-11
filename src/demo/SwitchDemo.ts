import { Group, Panel, switchView, text, logw, gravity, Color, Stack, LayoutSpec, list, NativeCall, listItem, log, vlayout, Gravity, hlayout, scroller, layoutConfig, Text } from 'doric'

export class SwitchDemo extends Panel {
  build (rootView: Group): void {
    let switchStatus: Text
    vlayout(
      [
        switchStatus = text({
          text: 'Switch开关',
        }),
        switchView({
          state: true,
          onTintColor: Color.YELLOW,
          onSwitch: (state) => {
            logw('onSwitch', state)
            switchStatus.text = `Switch 当前状态:${state ? 'ON' : 'OFF'}`
          },
        }),
        // switchView({
        //   state: true,
        //   onSwitch: (state) => {
        //     switchStatus.text = `Switch 当前状态:${state ? 'ON' : 'OFF'}`
        //   },
        //   // backgroundColor: Color.RED,
        //   offTintColor: Color.RED,
        //   onTintColor: Color.YELLOW,
        //   // thumbTintColor: Color.RED,
        // }),
      ],
      {
        layoutConfig: layoutConfig().most(),
        space: 20,
        gravity: Gravity.Center,
      }).in(rootView)
  }
}
