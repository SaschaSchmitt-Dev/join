/** @type {import("stylelint").Config} */
export default {
    plugins: ["stylelint-order"],
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
                        "place-items",
                        "gap",
                        "row-gap",
                        "column-gap",
                        "grid",
                        "grid-template",
                        "grid-template-columns",
                        "grid-template-rows",
                        "grid-column",
                        "grid-row"
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
                        "padding-left"
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
                        "scrollbar-gutter"
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
                        "border-radius",
                        "box-shadow"
                    ]
                },
                {
                    groupName: "Text and Font",
                    properties: [
                        "color",
                        "font",
                        "font-family",
                        "font-size",
                        "font-style",
                        "font-weight",
                        "line-height",
                        "letter-spacing",
                        "text-align",
                        "text-decoration",
                        "text-transform",
                        "white-space",
                        "word-break",
                        "overflow-wrap"
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