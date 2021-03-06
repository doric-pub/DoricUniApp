import { Group, Panel, gravity, Color, LayoutSpec, vlayout, scroller, layoutConfig, modal, network } from "doric";
import { title, label, colors } from "./utils";

export class NetworkDemo extends Panel {
    build(rootView: Group): void {
        scroller(vlayout([
            title("Network Demo"),
            label('Click me').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: Color.WHITE,
                layoutConfig: layoutConfig().just(),
                onClick: () => {
                    network(this.context).get('https://m.baidu.com').then(
                        e => {
                            modal(this.context).alert(JSON.stringify(e))
                        }
                    ).catch(e => {
                        modal(this.context).toast('Catched:' + JSON.stringify(e))
                    })
                }
            }),
        ]).apply({
            layoutConfig: layoutConfig().most().configHeight(LayoutSpec.FIT),
            gravity: gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: layoutConfig().most(),
        }).in(rootView)
    }
}