import axios from 'axios'

// var api_addr = 'https://api.lite.xingyun.doyi.online'
var api_addr = 'https://api.xingyun.doyi.online'

//FdlDeploy FDL部署
async function FdlDeploy(regionID, akID, akSecret, flowName, flowDefinition, flowDescription, roleArn) {
    return axios
        .post(api_addr + "/deployFDL", {
            regionID: regionID,
            akID: akID,
            akSecret: akSecret,
            flowName: flowName,
            flowDefinition: flowDefinition,
            flowDescription: flowDescription,
            roleArn: roleArn,
        })
        .then(response => {
            if (response.data.msg === "ok") {
                console.log("Deploy Successfully.")
                return {
                    status: true,
                    msg: "ok",
                }
            } else {
                console.log("Fail")
                return {
                    status: false,
                    msg: response.data.msg,
                }
            }
        })
}

//FdlUpdate FDL修改部署
async function FdlUpdate(regionID, akID, akSecret, flowName, flowDefinition, flowDescription, roleArn) {
    return axios
        .post(api_addr + "/updateFlow", {
            regionID: regionID,
            akID: akID,
            akSecret: akSecret,
            flowName: flowName,
            flowDefinition: flowDefinition,
            flowDescription: flowDescription,
            roleArn: roleArn,
        })
        .then(response => {
            if (response.data.msg === "ok") {
                console.log("Update Successfully.")
                return {
                    status: true,
                    msg: "ok",
                }
            } else {
                console.log("Update Fail")
                return {
                    status: false,
                    msg: response.data.msg,
                }
            }
        })
}

async function RunFDL(regionID, akID, akSecret, flowName) {
    return axios
        .post(api_addr + '/runFDL', {
            regionID: regionID,
            akID: akID,
            akSecret: akSecret,
            flowName: flowName,
        })
        .then(response => {
            // console.log(response)
            if (response.data.msg === "ok") {
                console.log("Run Successfully.")
                return {
                    status: true,
                    executionName: response.data.executionName,
                    msg: "ok",
                }
            } else {
                console.log("Fail")
                return {
                    status: false,
                    executionName: response.data.executionName,
                    msg: response.data.msg,
                }
            }
        })
}


async function GetExecutionResult(regionID, akID, akSecret, flowName, executionName) {
    return axios
        .post(api_addr + '/getExecutionResult', {
            regionID: regionID,
            akID: akID,
            akSecret: akSecret,
            flowName: flowName,
            executionName: executionName,
        })
        .then(response => {
            // console.log(response)
            if (response.data.status === 200) {
                console.log("Exec Successfully.")
                return {
                    status: true,
                    msg: "ok",
                }
            } else {
                console.log("Fail")
                return {
                    status: false,
                    msg: response.data.msg,
                }
            }
        })
}

async function GetFlows(regionID, akID, akSecret) {
    return axios
        .post(api_addr + '/getFlows', {
            regionID: regionID,
            akID: akID,
            akSecret: akSecret,
        })
        .then(response => {
            // console.log(response)
            if (response.data.status === 200) {
                console.log("getFlows Successfully.")
                return {
                    status: true,
                    flows: response.data.flows,
                    msg: "ok",
                }
            } else {
                console.log("getFlows fail")
            }
        })
}

async function GetFlow(regionID, flowName, akID, akSecret) {
    return axios
        .post(api_addr + '/getFlow', {
            regionID: regionID,
            flowName: flowName,
            akID: akID,
            akSecret: akSecret,
        })
        .then(response => {
            if (response.data.status === 200) {
                console.log("getFlow Successfully.")
                return {
                    status: true,
                    flow: response.data.flow,
                    msg: "ok",
                }
            } else {
                console.log("getFlow fail")
                return {
                    status: false,
                    msg: "not exist",
                }

            }
        })
}

async function DeleteFlow(regionID, flowName, akID, akSecret) {
    return axios
        .post(api_addr + '/deleteFlow', {
            regionID: regionID,
            flowName: flowName,
            akID: akID,
            akSecret: akSecret,
        })
        .then(response => {
            console.log(response)
            if (response.data.status == 200) {
                console.log("deleteFlow Successfully.")
                return {
                    status: true,
                    msg: "ok",
                }
            } else {
                console.log(response.data.msg)
                return {
                    status: false,
                    msg: "fail",
                }

            }
        })
}


export default {
    FdlDeploy,
    RunFDL,
    GetExecutionResult,
    GetFlows,
    GetFlow,
    FdlUpdate,
    DeleteFlow,
}