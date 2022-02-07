/**
 * 本文件定义了各种步骤节点
 * 作者：东南dnf
 */

import portStyle from './portStyle'

const task = {
    shape: "task",
    width: 120,
    height: 57,
    data: {
        def: "task",
        resourceArn: "",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#00BFFF", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#FFFFFF", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const pass = {
    shape: "pass",
    width: 100,
    height: 42,
    data: {
        def: "pass",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#7FFFAA", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000000", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const wait = {
    shape: "wait",
    width: 90,
    height: 50,
    data: {
        def: "wait",
        duration: "",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#FF1493", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#fff", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const parallel = {
    shape: "parallel",
    width: 170,
    height: 250,
    data: {
        def: "parallel",
        parent: true,
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#E1FFFF", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const choice = {
    shape: "choice",
    width: 166,
    height: 243,
    data: {
        def: "choice",
        parent: true,
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#BEEDC7", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const condition = {
    shape: "condition",
    width: 90,
    height: 50,
    data: {
        def: "condition",
        condition: "",
        goto: "",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#ffff00", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const defaultCondition = {
    shape: "default",
    width: 90,
    height: 50,
    data: {
        def: "default",
        goto: "",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#725e82", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#fff", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}


const foreach = {
    shape: "foreach",
    width: 166,
    height: 250,
    data: {
        def: "foreach",
        parent: true,
        iterationMapping: {
            collection: "",
            item: "",
        },
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#F4606C", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#000", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const succeed = {
    shape: "succeed",
    width: 90,
    height: 50,
    data: {
        def: "succeed",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#00bc12", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#fff", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const fail = {
    shape: "fail",
    width: 90,
    height: 50,
    data: {
        def: "fail",
    },
    attrs: {
        // 指定 rect 元素的样式
        body: {
            stroke: "#000", // 边框颜色
            fill: "#ff461f", // 填充颜色
            rx: 5,
        },
        // 指定 text 元素的样式
        label: {
            fill: "#fff", // 文字颜色
        },
    },
    ports: {
        groups: {
            in: portStyle.inPort,
            out: portStyle.outPort,
        },
    },
}

const taskNode = {
    shape: "task",
    label: "Task",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const passNode = {
    shape: "pass",
    label: "Pass",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const waitNode = {
    shape: "wait",
    label: "Wait",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const parallelNode = {
    shape: "parallel",
    label: "parallel",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const choiceNode = {
    shape: "choice",
    label: "choice",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const conditionNode = {
    shape: "condition",
    label: "condition",
    ports: [
        {
            id: "port1",
            group: "out",
        },
    ],
}



const foreachNode = {
    shape: "foreach",
    label: "foreach",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const succeedNode = {
    shape: "succeed",
    label: "succeed",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const failNode = {
    shape: "fail",
    label: "fail",
    ports: [
        {
            id: "port1",
            group: "in",
        },
        {
            id: "port2",
            group: "out",
        },
    ],
}

const defaultNode = {
    shape: "default",
    label: "default",
    ports: [
        {
            id: "port2",
            group: "out",
        },
    ],
}

export default {
    task,
    pass,
    wait,
    parallel,
    choice,
    condition,
    defaultCondition,
    // goto,
    foreach,
    succeed,
    fail,
    taskNode,
    passNode,
    waitNode,
    parallelNode,
    choiceNode,
    defaultNode,
    // gotoNode,
    conditionNode,
    foreachNode,
    succeedNode,
    failNode,
}