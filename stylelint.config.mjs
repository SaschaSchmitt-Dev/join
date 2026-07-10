/** @type {import("stylelint").Config} */
export default {
    extends: ["stylelint-config-standard"],
    plugins: ["stylelint-order"],
    ignoreFiles: ["node_modules/**", "out/**"],
    rules: {
        "order/properties-order": [
            [
                {
                    groupName: "Layout",
                    properties: [
                        "display",
                        "visibility",
                        "opacity"
                    ]
                },
                {
                    groupName: "Position",
                    properties: [
                        "position",
                        "inset",
                        "top",
                        "right",
                        "bottom",
                        "left",
                        "z-index"
                    ]
                },
                {
                    groupName: "Flex and Grid",
                    properties: [
                        "flex",
                        "flex-grow",
                        "flex-shrink",
                        "flex-basis",
                        "flex-direction",
                        "flex-wrap",
                        "justify-content",
                        "align-items",
                        "align-content",
                        "align-self",
                        "place-items",
                        "place-content",
                        "place-self",
                        "justify-items",
                        "justify-self",
                        "gap",
                        "row-gap",
                        "column-gap",
                        "grid",
                        "grid-template",
                        "grid-template-columns",
                        "grid-template-rows",
                        "grid-column",
                        "grid-row",
                        "order"
                    ]
                },
                {
                    groupName: "Box Size",
                    properties: [
                        "box-sizing",
                        "width",
                        "min-width",
                        "max-width",
                        "height",
                        "min-height",
                        "max-height"
                    ]
                },
                {
                    groupName: "Spacing",
                    properties: [
                        "margin",
                        "margin-top",
                        "margin-right",
                        "margin-bottom",
                        "margin-left",
                        "padding",
                        "padding-top",
                        "padding-right",
                        "padding-bottom",
                        "padding-left",
                        "padding-block",
                        "padding-block-start",
                        "padding-block-end",
                        "padding-inline",
                        "padding-inline-start",
                        "padding-inline-end"
                    ]
                },
                {
                    groupName: "Overflow",
                    properties: [
                        "overflow",
                        "overflow-x",
                        "overflow-y",
                        "scrollbar-width",
                        "scrollbar-color",
                        "scrollbar-gutter",
                        "scroll-behavior",
                        "scroll-snap-type",
                        "scroll-snap-align",
                        "scroll-snap-stop"
                    ]
                },
                {
                    groupName: "Background and Border",
                    properties: [
                        "background",
                        "background-color",
                        "background-image",
                        "background-size",
                        "background-position",
                        "background-repeat",
                        "border",
                        "border-top",
                        "border-right",
                        "border-bottom",
                        "border-left",
                        "border-color",
                        "border-width",
                        "border-style",
                        "border-radius",
                        "box-shadow",
                        "outline",
                        "outline-color",
                        "outline-offset",
                        "outline-style",
                        "outline-width"
                    ]
                },
                {
                    groupName: "Text and Font",
                    properties: [
                        "color",
                        "text-fill-color",
                        "font",
                        "font-family",
                        "font-size",
                        "font-style",
                        "font-weight",
                        "font-display",
                        "src",
                        "line-height",
                        "letter-spacing",
                        "text-align",
                        "text-decoration",
                        "text-transform",
                        "text-overflow",
                        "white-space",
                        "word-break",
                        "overflow-wrap",
                        "list-style",
                        "list-style-position",
                        "list-style-type"
                    ]
                },
                {
                    groupName: "Images and Objects",
                    properties: [
                        "object-fit",
                        "object-position",
                        "filter"
                    ]
                },
                {
                    groupName: "Interaction",
                    properties: [
                        "cursor",
                        "pointer-events",
                        "user-select"
                    ]
                },
                {
                    groupName: "Animation",
                    properties: [
                        "transition",
                        "transition-property",
                        "transition-duration",
                        "transition-timing-function",
                        "transform",
                        "transform-origin",
                        "animation"
                    ]
                }
            ],
            {
                unspecified: "bottomAlphabetical",
                emptyLineBeforeUnspecified: "always",
                emptyLineMinimumPropertyThreshold: 8
            }
        ]
    }
};
