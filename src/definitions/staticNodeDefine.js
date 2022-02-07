/**
 * 本文件定义了start和end两个固定步骤节点
 * 作者：东南dnf
 */
import portStyle from "./portStyle";


const startRect = {
    id: "start",
    x: 300,
    y: 40,
    width: 80,
    height: 40,
    label: "开始",
    data:{
        def: "start"
    },
    zIndex: 2,
    rx: 5,
    ry: 10,
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#2ECC71", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000000", // 文字颜色
        },
    },
    ports: {
        groups: {
            // 输出链接桩群组定义
            out: portStyle.outPort,
        },
        items: [
            {
                id: "start-port",
                group: "out",
            },
        ],
    }
}

const endRect = {
    id: "end",
    x: 300,
    y: 700,
    width: 80,
    height: 40,
    data:{
        def: "end"
    },
    label: "结束",
    zIndex: 1,
    rx: 5,
    ry: 10,
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#778899", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000000", // 文字颜色
        },
    },
    ports: {
        groups: {
            // 输入链接桩群组定义
            in: portStyle.inPort,
        },
        items: [
            {
                id: "end-port",
                group: "in",
            },
        ],
    },
}

export default {
    startRect,
    endRect,
}
