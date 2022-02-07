/**
 * 本文件包括将FDL转换成Cells的方法
 * 作者：东南dnf
 */
const yaml = require("js-yaml");

import getCell from "./cellTemplate"

var baseX = 300;
var baseY = 40;
var zIndex = 0;
var nodes = [];
var steps = [];

var lineMap = new Map();

/**
 * @description 本方法旨在将FDL流程定义语言转换成Antv X6画布Cells
 * 
 * @param string FDL 
 */
function Converter(FDL) {
    const fdl = yaml.load(FDL);
    // console.log(fdl.steps);

    baseX = 300;
    baseY = 40;
    baseY += 80

    zIndex = 1;

    nodes = baseNode;
    steps = fdl.steps;

    var childCells = []//定义子节点，等待最后写入

    var endNodeID = "start";

    steps.forEach(step => {
        // console.log(step)
        switch (step.type) {
            case "pass":
                nodes.push(passHandler(step))
                break;
            case "task":
                nodes.push(taskHandler(step))
                break;
            case "wait":
                nodes.push(waitHandler(step))
                break;
            case "parallel":
                var parallel = parallelHandler(step)
                nodes.push(parallel.node)

                parallel.childCells.forEach(childCell => {
                    childCells.push(childCell)
                });
                // console.log("childCells")
                // console.log(childCells)
                break;
            case "choice":
                var choice = choiceHandler(step)
                nodes.push(choice.node)

                choice.childCells.forEach(childCell => {
                    childCells.push(childCell)
                });
                break;
            case "foreach":
                var foreach = foreachHandler(step)
                nodes.push(foreach.node)

                foreach.childCells.forEach(childCell => {
                    childCells.push(childCell)
                });
                break;
            case "succeed":
                nodes.push(succeedHandler(step))
                break;
            case "fail":
                nodes.push(failHandler(step))
                break;

            default:
                break;
        }

        // console.log("childCells")
        // console.log(childCells)


        //指向线添加进集合
        if (nodes.length == 2) {
            lineMap.set("start", nodes[nodes.length - 1].id)
        }
        else if (nodes.length > 2) {
            lineMap.set(nodes[nodes.length - 2].id, nodes[nodes.length - 1].id)
        }
        endNodeID = nodes[nodes.length - 1].id
        lineMap.set(endNodeID, "end")

        baseY += 46
        zIndex++
    });

    nodes[nodes.length] = endNodeHandler()
    zIndex++

    // 开始顺序节点连线
    var lines = getLines();
    lines.forEach(line => {
        nodes.push(line)
    });

    // 开始添加子节点
    childCells.forEach(childCell => {
        nodes[nodes.length] = childCell
    });

    // console.log(nodes);
    return nodes;
}

//pass处理器
function passHandler(step) {
    var node = getCell.getPassNode(baseX - 10, baseY, step, zIndex)
    baseY += 42
    return node
}

//task处理器
function taskHandler(step) {
    var node = getCell.getTaskNode(baseX - 19, baseY, step, zIndex)
    baseY += 57
    return node
}

//wait处理器
function waitHandler(step) {
    var node = getCell.getWaitNode(baseX - 5, baseY, step, zIndex)
    baseY += 50
    return node
}

//parallel处理器
function parallelHandler(step) {
    var result = getCell.getParallelNode(baseX, baseY, step, zIndex)
    baseY += result.pY
    zIndex = result.zIndex
    return { node: result.node, childCells: result.cells }
}

//choice处理器
function choiceHandler(step) {
    var result = getCell.getChoiceNode(baseX, baseY, step, zIndex)
    baseY += result.pY
    zIndex = result.zIndex
    return { node: result.node, childCells: result.cells }
}

//foreach处理器
function foreachHandler(step) {
    var result = getCell.getForeachNode(baseX, baseY, step, zIndex)
    baseY += result.pY
    zIndex = result.zIndex
    return { node: result.node, childCells: result.cells }
}

//succeed处理器
function succeedHandler(step) {
    var node = getCell.getSucceedNode(baseX - 6, baseY, step, zIndex)
    baseY += 50
    return node
}

//fail处理器
function failHandler(step) {
    var node = getCell.getFailNode(baseX - 6, baseY, step, zIndex)
    baseY += 50
    return node

}

//结束节点
function endNodeHandler() {
    var node = getCell.getEndNode(baseX, baseY)
    baseY += 40
    return node
}

/**
 * @description 获取一级指向线集合
 * 
 * @param [] nodes 
 */
function getLines() {
    var lines = [];

    // console.log("顺序步骤：")
    // console.log(lineMap)

    var from = "start"
    var to = lineMap.get(from)

    lines[0] = getCell.getEdge("start", "start-port", to, "port1", zIndex)
    zIndex++

    while (true) {
        from = to
        to = lineMap.get(from)

        lines.push(getCell.getEdge(from, "port2", to, "port1", zIndex))
        zIndex++

        //指向线完结
        if (to == "end") {
            break;
        }
    }

    return lines
}

var baseNode = [{
    "position": {
        "x": 300,
        "y": 40
    },
    "size": {
        "width": 80,
        "height": 40
    },
    "attrs": {
        "text": {
            "text": "开始"
        },
        "body": {
            "stroke": "#000",
            "fill": "#2ECC71",
            "rx": 5
        },
        "label": {
            "fill": "#000000"
        }
    },
    "shape": "rect",
    "id": "start",
    "data": {
        "def": "start"
    },
    "zIndex": 0,
    "rx": 5,
    "ry": 10,
    "ports": {
        "groups": {
            "out": {
                "position": "bottom",
                "label": {
                    "position": "bottom"
                },
                "attrs": {
                    "circle": {
                        "r": 6,
                        "magnet": true,
                        "stroke": "#31d0c6",
                        "strokeWidth": 2,
                        "fill": "#fff"
                    }
                }
            }
        },
        "items": [{
            "id": "start-port",
            "group": "out"
        }]
    }
},
]
export default {
    Converter,
}