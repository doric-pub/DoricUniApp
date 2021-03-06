
import { Group, Panel, Color, LayoutSpec, scroller, layoutConfig, flexlayout, image, ScaleType, Align, FlexDirection, Wrap } from "doric";
import { icon_refresh } from "./utils";

export class FlexDemo extends Panel {
    build(root: Group) {
        scroller(
            flexlayout(
                [
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            marginRight: 10,
                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            alignSelf: Align.CENTER,

                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 50,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 50,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 50,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 50,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        height: 16,
                    }),
                    image({
                        imageBase64: icon_refresh,
                        scaleType: ScaleType.ScaleAspectFit,
                        backgroundColor: Color.GRAY,
                        layoutConfig: {
                            widthSpec: LayoutSpec.FIT,
                            heightSpec: LayoutSpec.JUST,
                        },
                        flexConfig: {
                            marginTop: 20,
                            alignContent: Align.CENTER,
                        },
                        height: 16,
                    }),
                ],
                {
                    flexConfig: {
                        flexDirection: FlexDirection.ROW,
                        width: 200,
                        height: 200,
                        flexWrap: Wrap.WRAP,
                        alignContent: Align.FLEX_END,
                        alignItems: Align.FLEX_START,
                    },
                    backgroundColor: Color.GRAY.alpha(0.1),
                }
            ),
            {
                layoutConfig: layoutConfig().most()
            }
        ).in(root)

        // image({
        //     imageBase64: ICON_GENDER_MAN,
        //     backgroundColor: Color.GRAY,
        //     layoutConfig: {
        //         widthSpec: LayoutSpec.FIT,
        //         heightSpec: LayoutSpec.JUST,
        //         alignment: Gravity.Center,
        //     },
        //     height: 30,
        // }).in(root)
    }
}