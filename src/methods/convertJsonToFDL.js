/**
 * 本文件包括将json格式数据转换成FDL（Flow Definition Language）的方法
 * 作者：东南dnf
 */

/**
 * @description FDL头部代码
 */
var FDL_HEAD = `version: v1
type: flow
steps:
`

/**
 * @description 本方法旨在将顺序步骤翻译成FDL流程定义语言
 * 
 * @param json jsonFlow 
 */
function Converter(jsonFlow) {
    let fdl = FDL_HEAD;

    jsonFlow.forEach(element => {
        // console.log(element)
        switch (element.def) {
            case 'pass':
                fdl += "  - type: pass\n";
                fdl += "    name: " + element.name + "\n";
                break;

            case 'task':
                fdl += "  - type: task\n";
                fdl += "    name: " + element.name + "\n";
                fdl += "    resourceArn: " + element.resourceArn + "\n";

                if (element.timeoutSeconds != undefined && element.timeoutSeconds != "")
                    fdl += "    timeoutSeconds: " + element.timeoutSeconds + "\n";

                break;

            case 'wait':
                fdl += "  - type: wait\n";
                fdl += "    name: " + element.name + "\n";
                if (element.duration != undefined && element.duration != "")
                    fdl += "    duration: " + element.duration + "\n";
                if (element.timestamp != undefined && element.timestamp != "")
                    fdl += "    timestamp: " + element.timestamp + "\n";
                break;

            case 'parallel':
                fdl += parallelConverter(element)
                break;

            case 'choice':
                fdl += choiceConverter(element)
                break;

            case 'foreach':
                fdl += foreachConverter(element)
                break;

            case 'succeed':
                fdl += "  - type: succeed\n";
                fdl += "    name: " + element.name + "\n";
                break;

            case 'fail':
                fdl += failConverter(element);
                break;
        }

        if (element.end != undefined && element.end != "") {
            fdl += "    end: " + element.end + "\n";
        }
    });
    return fdl;
}

/**
 * @description 本方法旨在将pass,task,wait步骤翻译成FDL流程定义语言
 * 
 * @param int level
 * @param json jsonFlow 
 */
function sequenceConverter(level, jsonFlow) {
    var fdl = ""
    var levelBlank = ""

    //层数判别，用于判断该层需要加多少空格
    switch (level) {
        case 1:
            levelBlank += "  "
            break;
        case 2:
            levelBlank += "      "
            break;
        case 3:
            levelBlank += "        "
            break;
        case 4:
            levelBlank += "          "
            break;
    }

    jsonFlow.forEach(element => {
        switch (element.def) {
            case 'pass':
                fdl += levelBlank + "- type: pass\n";
                fdl += levelBlank + "  name: " + element.name + "\n";
                break;

            case 'task':
                fdl += levelBlank + "- type: task\n";
                fdl += levelBlank + "  name: " + element.name + "\n";
                fdl += levelBlank + "  resourceArn: " + element.resourceArn + "\n";
                if (element.timeoutSeconds != undefined && element.timeoutSeconds != "")
                    fdl += levelBlank + "  timeoutSeconds: " + element.timeoutSeconds + "\n";
                break;

            case 'wait':
                fdl += levelBlank + "- type: wait\n";
                fdl += levelBlank + "  name: " + element.name + "\n";
                if (element.duration != undefined && element.duration != "")
                    fdl += levelBlank + "  duration: " + element.duration + "\n";
                if (element.timestamp != undefined && element.timestamp != "")
                    fdl += levelBlank + "  timestamp: " + element.timestamp + "\n";
                break;
        }
    });
    return fdl;
}

/**
 * @description 本方法旨在将并行步骤翻译成FDL流程定义语言
 * 
 * @param json jsonFlow 
 */
function parallelConverter(jsonFlow) {
    let fdl = '';
    fdl += "  - type: parallel\n";
    fdl += "    name: " + jsonFlow.name + "\n";
    fdl += "    branches:\n";

    //逐分支翻译
    jsonFlow.branches.forEach(element => {
        if (element.steps == 0) return;

        fdl += "      - steps:\n"

        fdl += sequenceConverter(3, element.steps)
    });
    return fdl;
}

/**
 * @description 本方法旨在将选择步骤翻译成FDL流程定义语言
 * 
 * @param json jsonFlow 
 */
function choiceConverter(jsonFlow) {
    let fdl = '';
    fdl += "  - type: choice\n";
    fdl += "    name: " + jsonFlow.name + "\n";
    fdl += "    choices:\n";

    //逐分支翻译
    jsonFlow.choices.forEach(element => {
        fdl += "      - condition: " + element.condition + "\n"

        if (element.steps.length > 0) {
            fdl += "        steps:\n"
            fdl += sequenceConverter(4, element.steps)
        }

        if (element.goto != undefined && element.goto != "") {
            fdl += "        goto: " + element.goto + "\n"
        }
    });

    //默认分支
    fdl += "    default:\n"
    if (jsonFlow.default == undefined || jsonFlow.default == {} || jsonFlow.default == "") {
        fdl += "      goto: final\n"
    } else {
        if (jsonFlow.default.steps != undefined && JSON.stringify(jsonFlow.default.steps) != "{}" && jsonFlow.default.steps.length != 0) {
            // console.log("default有步骤:")
            // console.log(jsonFlow.default.steps)
            fdl += "      steps:\n"
            fdl += sequenceConverter(3, jsonFlow.default.steps)
        }

        if (jsonFlow.default.goto != undefined && jsonFlow.default.goto != "") {
            console.log("有defaultGoto");
            fdl += "      goto: " + jsonFlow.default.goto + "\n"
        }
    }

    return fdl;
}

/**
 * @description 本方法旨在将foreach循环步骤翻译成FDL流程定义语言
 * 
 * @param json jsonFlow 
 */
function foreachConverter(jsonFlow) {
    let fdl = '';
    fdl += "  - type: foreach\n";
    fdl += "    name: " + jsonFlow.name + "\n";
    fdl += "    iterationMapping:\n";
    fdl += "      collection: " + jsonFlow.iterationMapping.collection + "\n";
    fdl += "      item: " + jsonFlow.iterationMapping.item + "\n";

    if (jsonFlow.iterationMapping.index != undefined && jsonFlow.iterationMapping.index != "")
        fdl += "      index: " + jsonFlow.iterationMapping.index + "\n";

    fdl += "    steps:\n"
    fdl += sequenceConverter(2, jsonFlow.steps)

    return fdl;
}

/**
 * @description 本方法旨在将失败步骤翻译成FDL流程定义语言
 * 
 * @param json element 
 */
function failConverter(element) {
    var fdl = '';
    fdl += "  - type: fail\n";
    fdl += "    name: " + element.name + "\n";

    if (element.error != undefined && element.error != "") {
        fdl += "    error: " + element.error + "\n";
    }

    if (element.cause != undefined && element.cause != "") {
        fdl += "    cause: " + element.cause + "\n";
    }

    return fdl;
}

module.exports = {
    FDL_HEAD,
    Converter,
}