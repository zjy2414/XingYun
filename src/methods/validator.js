/**
 * 本文件包括生成FDL前的合规化检查方法
 * 作者：东南dnf
 */

//全局json
var jsonData;

/**
 * @method 
 * @desc 全局规范化验证器
 * @param JsonObject 全局json
 * @returns MsgObject 消息
 * 状态码：
 * 1 : 正常
 * 2 : 主流程非连续
 * 3 : 有步骤重名
 * 4 : 有步骤未填写名称
 * 4 : 某Task节点必要信息未填写完整
 * 5 : 某Wait节点必要信息未填写完整
 * 6 : 某Foreach节点必要信息未填写完整
 * 7 : Choice步骤有condition未设定条件
 * 8 : Choice步骤default未设定条件
 */
function Validate(json) {
    jsonData = json;
    // console.log(json);
    //定义空消息
    var Msg = {
        code: 1,
        msg: "ok",
    };
    var nodes = [];
    var edges = new Map();

    //筛选出所有节点
    json.cells.forEach(element => {
        if (element.shape != "edge") nodes.push(element);
        else edges.set(element.source.cell, element.target.cell);
    });

    if (!OneLineCheck(edges)) {
        Msg = { code: 2, msg: "请检查开始至结束的线路是否已经完整连接？" };
    }

    if (!renameCheck(nodes)) {
        Msg = { code: 3, msg: "请检查是否有节点重名？" }
    }

    if (!unknownCheck(nodes)) {
        Msg = { code: 4, msg: "请检查是否有节点未填写名称？" }
    }

    if (!taskChecker(nodes)) {
        Msg = { code: 5, msg: "有task步骤未填写resourceArn？" }
    }

    if (!waitChecker(nodes)) {
        Msg = { code: 6, msg: "有wait步骤未填写duration或timestamp？" }
    }

    let msg = foreachChecker(nodes)
    if (msg != "ok") {
        Msg = { code: 7, msg: msg }
    }

    msg = conditionChecker(nodes)
    if (msg != "ok") {
        Msg = { code: 8, msg: msg }
    }

    msg = defaultChecker(nodes, edges)
    if (msg != "ok") {
        Msg = { code: 9, msg: msg }
    }

    return Msg;
}

function getCell(cellID) {
    // var jsonData = json;
    var cell = {};
    jsonData.cells.forEach((element) => {
        if (element.id == cellID) {
            cell = element;
        }
    });
    return cell;
}

//检查主流程是否完整
function OneLineCheck(edges) {
    var node = {};
    var status = false;
    // var nodeList = [];

    for (
        var nodeID = "start";
        node.id != "end";
        nodeID = edges.get(nodeID)
    ) {
        node = getCell(nodeID);

        if (node.data != undefined && node.data.def != undefined && node.data.def == 'end') {
            status = true;
        }
        if (node.shape == undefined || JSON.stringify(node) === "{}") {
            status = false;
            break;
        }
    }

    return status;
}

//重名检查
function renameCheck(nodes) {
    var names = [];
    var status = true;

    nodes.forEach(node => {
        names.find(function (name) {
            if (name == node.attrs.text.text) {
                status = false;
            }
        })
        names.push(node.attrs.text.text)
    });

    console.log(names);

    return status;
}

//无名检查
function unknownCheck(nodes) {
    var status = true;

    nodes.forEach(node => {
        if ((node.attrs.text.text == undefined || node.attrs.text.text == "")) {
            console.log("发现有步骤未填写名称");
            status = false;
        }
    });

    return status;
}

//Task检查
function taskChecker(nodes) {
    var status = true;

    nodes.forEach(node => {
        if (node.data.def == "task") {
            if ((node.data.resourceArn == undefined || node.data.resourceArn == "")) {
                console.log("发现有Arn未填写");
                status = false;
            }
        }

    });

    return status;
}

//Wait检查
function waitChecker(nodes) {
    var status = true;

    nodes.forEach(node => {
        if (node.data.def == "wait") {
            if ((node.data.duration == undefined || node.data.duration == "") && (node.data.timestamp == undefined || node.data.timestamp == "")) {
                status = false;
            }
        }

    });

    return status;
}

//foreach检查
function foreachChecker(nodes) {
    var msg = "ok";

    console.log("LLL")
    console.log(nodes)

    nodes.forEach(node => {
        if (node.data.def != undefined && node.data.def === "foreach") {
            if ((node.data.iterationMapping.collection == undefined || node.data.iterationMapping.collection == "") || (node.data.iterationMapping.item == undefined || node.data.iterationMapping.item == "")) {
                console.log(node.data.def)

                console.log(node.data.iterationMapping.collection)
                msg = "foreach步骤未填写collection或item？";
            }

            if(node.data.startNodeIDs == undefined || node.data.startNodeIDs.length == 0){
                msg = "foreach步骤中未放置步骤？";
            }
        }
    });

    return msg;
}

// choice.condition检查
function conditionChecker(nodes) {
    var msg = "ok";

    nodes.forEach(node => {
        if (node.data.def == "condition") {
            if ((node.data.condition == undefined || node.data.collection == "")) {
                msg = "有condition未设置条件"
            }
        }
    });

    return msg;
}

//choice.default检查
function defaultChecker(nodes, edges) {
    var msg = "ok";
    var numOfChoice = 0;
    var numOfDefault = 0;

    nodes.forEach(node => {
        if (node.data.def == "default") {
            numOfDefault++;
            if (edges.get(node.id) == undefined && (node.data.goto == undefined || node.data.goto == "") && (true)) {
                msg = "default未设置goto也没有子步骤"
            }
        } else if (node.data.def == "choice") {
            numOfChoice++;
        }
    });

    if (numOfChoice > numOfDefault) {
        msg = "condition未设置default"
    } else if (numOfChoice < numOfDefault) {
        msg = "每个condition只能放置一个default"
    }

    return msg;
}


export default {
    Validate,
}