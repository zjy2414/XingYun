/**
 * 本文件包括cell模版方法
 * 作者：东南dnf
 */
import {
    v4 as uuidv4
} from 'uuid';
import childCellTemplate from './childCellTemplate';

function getEdge(fromID, fromPort, toID, toPort, zIndex) {
    return {
        "shape": "edge",
        "attrs": {
            "line": {
                "stroke": "#a0a0a0",
                "strokeWidth": 1,
                "targetMarker": {
                    "name": "classic",
                    "size": 7
                }
            }
        },
        "id": uuidv4(),
        "text": "",
        "source": {
            "cell": fromID,
            "port": fromPort
        },
        "target": {
            "cell": toID,
            "port": toPort
        },
        "zIndex": zIndex
    };
}

function getPassNode(X, Y, step, zIndex) {
    console.log(step)

    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 100,
            "height": 42
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "pass",
        "data": {
            "def": "pass",
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex,
    };
}

function getTaskNode(X, Y, step, zIndex) {
    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 120,
            "height": 57
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "task",
        "data": {
            "def": "task",
            "resourceArn": step.resourceArn,
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
            "timeoutSeconds": step.timeoutSeconds
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex
    }
};

function getWaitNode(X, Y, step, zIndex) {
    var mode = ""
    var moment = require('moment');
    var timestamp = "";

    if (step.duration != undefined && step.duration != "") {
        mode = "duration"
    } else if (step.timestamp != undefined && step.timestamp != "") {
        mode = "timestamp"
        timestamp = moment(step.timestamp).format()
    }

    // console.log(step)

    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 90,
            "height": 50
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "wait",
        "data": {
            "def": "wait",
            "mode": mode,
            "duration": step.duration,
            "timestamp": timestamp,
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex
    };
}

function getParallelNode(X, Y, step, zIndex) {

    var branches = step.branches

    var longestNodes = 0;
    for (let i = 0; i < branches.length; i++) {
        if (branches[i].steps.length > longestNodes) {
            longestNodes = branches[i].steps.length
        }
    }

    var width = 140 * (branches.length);
    var height = 90 * (longestNodes);

    var baseX = X - (width / 2) + 35
    var baseY = Y
    zIndex++;

    var node = {
        "position": {
            "x": baseX,
            "y": baseY
        },
        "size": {
            "width": width,
            "height": height
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "parallel",
        "data": {
            "def": "parallel",
            "parent": true,
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
            "startNodeIDs": []
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        "children": []
    };

    baseX += 10
    baseY += 10

    var cells = []

    branches.forEach(branch => {
        console.log("branch:")
        console.log(branch)
        var bY = baseY
        var i = 1

        var LineMap = new Map()

        branch.steps.forEach(step => {
            switch (step.type) {
                case "pass":
                    var cell = childCellTemplate.getPassNode(baseX, bY, step, node.id, zIndex)
                    cells.push(cell)
                    node.children.push(cell.id)
                    break;
                case "task":
                    var cell = childCellTemplate.getTaskNode(baseX, bY, step, node.id, zIndex)
                    cells.push(cell)
                    node.children.push(cell.id)
                    break;
                case "wait":
                    var cell = childCellTemplate.getWaitNode(baseX, bY, step, node.id, zIndex)
                    cells.push(cell)
                    node.children.push(cell.id)
                    break;

                default:
                    break;
            }
            zIndex++
            bY += 85

            if (i == 1) {
                node.data.startNodeIDs.push(cells[cells.length - 1].id)
            }
            else if (i > 1) {
                LineMap.set(cells[cells.length - 2].id, cells[cells.length - 1].id)
            }
            i++;
        });
        baseX += 140

        console.log("startNodes:")
        console.log(node.data.startNodeIDs)

        var lines = getLevel2Lines(node.data.startNodeIDs[node.data.startNodeIDs.length - 1], LineMap, zIndex);
        // console.log(lines)
        lines.forEach(line => {
            cells.push(line)
        });
    });

    return { pY: height, node: node, zIndex: zIndex, cells: cells }
}

function getChoiceNode(X, Y, step, zIndex) {
    var choices = step.choices
    var defaultChoice = step.default

    var defaultSteps = []
    if (defaultChoice.steps != undefined && defaultChoice.steps.length != 0) {
        defaultSteps = defaultChoice.steps
    }

    var longestNodes = 0;
    for (let i = 0; i < choices.length; i++) {
        if (choices[i].steps.length > longestNodes) {
            longestNodes = choices[i].steps.length
        }
    }
    if (defaultChoice.steps.length > longestNodes) {
        longestNodes = choices[i].steps.length
    }

    // console.log("choices:")
    // console.log(choices)

    // console.log("default:")
    // console.log(defaultChoice)

    var width = 130 * (choices.length + 1);
    var height = 85 * (longestNodes + 1);

    var baseX = X - (width / 2) + 35
    var baseY = Y
    zIndex++;

    var node = {
        "position": {
            "x": baseX,
            "y": baseY
        },
        "size": {
            "width": width,
            "height": height
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "choice",
        "data": {
            "def": "choice",
            "parent": true,
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        children: [],
        conditions: [],
        default: {}
    };

    baseX += 10;
    baseY += 10;

    var cells = []

    //处理选择分支
    choices.forEach(choice => {

        // console.log(node.id)
        var condition = getCondition(baseX, baseY, choice, node.id, zIndex)
        cells.push(condition)
        node.children.push(condition.id)
        zIndex++;


        //如果该choice有steps
        if (choice.steps != undefined && choice.steps.length != 0) {
            var bY = baseY + 90
            var i = 1

            var LineMap = new Map()

            choice.steps.forEach(step => {
                switch (step.type) {
                    case "pass":
                        var cell = childCellTemplate.getPassNode(baseX, bY, step, node.id, zIndex)
                        cells.push(cell)
                        node.children.push(cell.id)
                        break;
                    case "task":
                        var cell = childCellTemplate.getTaskNode(baseX, bY, step, node.id, zIndex)
                        cells.push(cell)
                        node.children.push(cell.id)
                        break;
                    case "wait":
                        var cell = childCellTemplate.getWaitNode(baseX, bY, step, node.id, zIndex)
                        cells.push(cell)
                        node.children.push(cell.id)
                        break;

                    default:
                        break;
                }
                zIndex++
                bY += 85

                if (i == 1) {
                    LineMap.set(condition.id, cells[cells.length - 1].id)
                }
                else if (i > 1) {
                    LineMap.set(cells[cells.length - 2].id, cells[cells.length - 1].id)
                }
                i++;
            });

            // 开始节点连线
            var lines = getLevel2Lines(condition.id, LineMap, zIndex);
            lines.forEach(line => {
                cells.push(line)
            });
        }


        baseX += 130
    });

    //处理default分支
    var defaultNode = getDefault(baseX, baseY, defaultChoice, node.id, zIndex)
    cells.push(defaultNode)
    node.children.push(defaultNode.id)
    baseY += 50 + 40

    //二级指向线添加进集合
    var i = 1
    var defaultLineMap = new Map();
    defaultSteps.forEach(step => {
        switch (step.type) {
            case "pass":
                var cell = childCellTemplate.getPassNode(baseX, baseY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;
            case "task":
                var cell = childCellTemplate.getTaskNode(baseX, baseY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;
            case "wait":
                var cell = childCellTemplate.getWaitNode(baseX, baseY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;

            default:
                break;
        }
        zIndex++
        baseY += 85

        if (i == 1) {
            defaultLineMap.set(defaultNode.id, cells[cells.length - 1].id)
        }
        else if (i > 1) {
            defaultLineMap.set(cells[cells.length - 2].id, cells[cells.length - 1].id)
        }
        i++;
    });

    // console.log("default lines:")
    // console.log(defaultLineMap)

    // 开始default节点连线
    var lines = getLevel2Lines(defaultNode.id, defaultLineMap, zIndex);
    // console.log(lines)
    lines.forEach(line => {
        cells.push(line)
    });


    return { pY: height, node: node, zIndex: zIndex, cells: cells }
}

function getCondition(X, Y, step, parent, zIndex) {

    var node = {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 120,
            "height": 50
        },
        "attrs": {
            "text": {
                "text": step.condition
            }
        },
        "shape": "condition",
        "data": {
            "def": "condition",
            "condition": step.condition,
            "goto": step.goto,
            "parent": parent
        },
        "ports": outPort,
        "id": uuidv4(),
        "zIndex": zIndex,
        "parent": parent
    }

    return node
}

function getDefault(X, Y, step, parent, zIndex) {

    var node = {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 90,
            "height": 50
        },
        "attrs": {
            "text": {
                "text": "default"
            }
        },
        "shape": "default",
        "data": {
            "def": "default",
            "goto": step.goto,
            "parent": parent,
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
        },
        "ports": outPort,
        "id": uuidv4(),
        "zIndex": zIndex,
        "parent": parent
    }

    return node
}

function getForeachNode(X, Y, step, zIndex) {
    console.log("foreach t:")
    console.log(step)

    var steps = step.steps

    var longestNodes = steps.length;

    var width = 170;
    var height = 90 * (longestNodes);

    var baseX = X - width / 2 + 40
    var baseY = Y
    zIndex++;

    var node = {
        "position": {
            "x": baseX,
            "y": baseY
        },
        "size": {
            "width": width,
            "height": 90 * (longestNodes)
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "foreach",
        "data": {
            "def": "foreach",
            "parent": true,
            "iterationMapping": {
                "collection": step.iterationMapping.collection,
                "item": step.iterationMapping.item,
                "index": step.iterationMapping.index
            },
            "end": step.end == undefined ? "" : step.end ? "true" : "false",
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        children: []
    };

    baseX += 30
    baseY += 30

    var cells = []


    var bY = baseY
    var i = 1

    var LineMap = new Map()

    steps.forEach(step => {
        switch (step.type) {
            case "pass":
                var cell = childCellTemplate.getPassNode(baseX, bY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;
            case "task":
                var cell = childCellTemplate.getTaskNode(baseX, bY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;
            case "wait":
                var cell = childCellTemplate.getWaitNode(baseX, bY, step, node.id, zIndex)
                cells.push(cell)
                node.children.push(cell.id)
                break;

            default:
                break;
        }
        zIndex++
        bY += 85

        if (i > 1) {
            LineMap.set(cells[cells.length - 2].id, cells[cells.length - 1].id)
        }
        i++;
    });
    baseX += 140

    var lines = getLevel2Lines(node.children[0], LineMap, zIndex);
    // console.log(lines)
    lines.forEach(line => {
        cells.push(line)
    });


    return { pY: height, node: node, zIndex: zIndex, cells: cells }
}

function getSucceedNode(X, Y, step, zIndex) {
    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 90,
            "height": 50
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "succeed",
        "data": {
            "def": "succeed"
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex
    };
}

function getFailNode(X, Y, step, zIndex) {

    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 90,
            "height": 50
        },
        "attrs": {
            "text": {
                "text": step.name
            }
        },
        "shape": "fail",
        "data": {
            "def": "fail",
            "error": step.error,
            "cause": step.cause
        },
        "ports": ports,
        "id": uuidv4(),
        "zIndex": zIndex
    };
}

/**
 * @description 获取二级指向线集合
 * 
 * @param [] nodes 
 */
function getLevel2Lines(from, lineMap, zIndex) {
    var lines = [];

    var to = "";

    for (let i = 0; i < lineMap.size; i++) {
        if (i > 0) from = to
        to = lineMap.get(from)

        lines.push(getEdge(from, "port2", to, "port1", zIndex))
        zIndex++
    }

    return lines
}

function getEndNode(X, Y) {
    return {
        "position": {
            "x": X,
            "y": Y
        },
        "size": {
            "width": 80,
            "height": 40
        },
        "attrs": {
            "text": {
                "text": "结束"
            },
            "body": {
                "stroke": "#000",
                "fill": "#778899",
                "rx": 5
            },
            "label": {
                "fill": "#000000"
            }
        },
        "shape": "rect",
        "id": "end",
        "data": {
            "def": "end"
        },
        "zIndex": 99999,
        "rx": 5,
        "ry": 10,
        "ports": {
            "groups": {
                "in": {
                    "position": "top",
                    "label": {
                        "position": "top"
                    },
                    "attrs": {
                        "circle": {
                            "r": 6,
                            "magnet": true,
                            "stroke": "#FFD700",
                            "strokeWidth": 2,
                            "fill": "#fff"
                        }
                    }
                }
            },
            "items": [{
                "id": "end-port",
                "group": "in"
            }]
        }
    };
}



var ports = {
    "groups": {
        "in": {
            "position": "top",
            "label": {
                "position": "top"
            },
            "attrs": {
                "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#FFD700",
                    "strokeWidth": 2,
                    "fill": "#fff"
                }
            }
        },
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
        "id": "port1",
        "group": "in"
    },
    {
        "id": "port2",
        "group": "out"
    }
    ]
};

var ports = {
    "groups": {
        "in": {
            "position": "top",
            "label": {
                "position": "top"
            },
            "attrs": {
                "circle": {
                    "r": 6,
                    "magnet": true,
                    "stroke": "#FFD700",
                    "strokeWidth": 2,
                    "fill": "#fff"
                }
            }
        },
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
        "id": "port1",
        "group": "in"
    },
    {
        "id": "port2",
        "group": "out"
    }
    ]
};

var outPort = {
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
    "items": [
        {
            "id": "port2",
            "group": "out"
        }
    ]
};


export default {
    ports,
    getEdge,
    getPassNode,
    getTaskNode,
    getWaitNode,
    getSucceedNode,
    getFailNode,
    getEndNode,
    getParallelNode,
    getChoiceNode,
    getForeachNode,
}