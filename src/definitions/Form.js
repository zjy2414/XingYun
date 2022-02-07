/**
 * 本文件包括表单需要用的一些方法
 * 作者：东南dnf
 */

/**
 * @desc 表单重置
 * @param Form对象 form 
 * @returns form
 */
function reset(form) {
    form = {
        pass: {
            Visible: false,
        },
        task: {
            service: "",
            fc: "",
            resourceArn: "",
            timeoutSeconds: "",
            Visible: false,
        },
        wait: {
            duration: "",
            timestamp: "",
            mode: "duration",
            Visible: false,
        },
        choice: {
            condition: {
                condition: "",
                Visible: false,
            },
            default: {
                Visible: false,
            },
            goto: "",
        },
        parallel: {
            Visible: false,
        },
        foreach: {
            iterationMapping: {
                collection: "",
                item: "",
                index: "",
            },
            Visible: false,
        },
        fail: {
            error: "",
            cause: "",
            Visible: false,
        },
    };

    return form;
}


//表单验证规则
var rules = {
    id: [
        {
            required: true,
            message: "请输入id",
        },
    ],
    name: [
        {
            required: true,
            message: "请输入名称",
        },
    ],
    service: [
        {
            required: false,
            message: "请选择服务",
        },
    ],
    fc: [
        {
            required: false,
            message: "请选择函数",
        },
    ],
    resourceArn: [
        {
            required: true,
            message: "请输入resourceArn",
            trigger: "change",
        },
    ],
    duration: [
        {
            required: true,
            message: "请输入duration",
        },
    ],
    timestamp: [
        {
            required: true,
            message: "请输入timestamp",
        },
    ],
    collection: [
        {
            required: true,
            message: "请输入collection",
        },
    ],
    item: [
        {
            required: true,
            message: "请输入item",
        },
    ],
    condition: [
        {
            required: true,
            message: "请输入condition",
        },
    ],
    goto: [
        {
            required: false,
            message: "请输入goto",
        },
    ],
};

//OneStepDeploy Rules
const deployRules = {
    regionID: [
        {
            required: true,
            message: "请选择RegionID",
        },
    ],
    akID: [
        {
            required: true,
            message: "请输入AccessKey ID",
        },
    ],
    akSecret: [
        {
            required: true,
            message: "请输入AccessKey Secret",
        },
    ],
    flowName: [
        {
            required: true,
            message: "请输入flowName",
        },
    ],
    flowDefinition: [
        {
            required: true,
            message: "请输入flowDefinition",
        },
    ],
    flowDescription: [
        {
            required: true,
            message: "请输入flowDescription",
        },
    ],
}

export default {
    reset,
    rules,
    deployRules,
}