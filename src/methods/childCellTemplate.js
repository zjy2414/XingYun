/**
 * 本文件包括子cell模版方法
 * 作者：东南dnf
 */
import {
    v4 as uuidv4
} from 'uuid';

import cellTemplate from './cellTemplate';

function getPassNode(X, Y, step, parent, zIndex) {
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
            "parent": parent
        },
        "ports": cellTemplate.ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        "parent": parent
    };
}

function getTaskNode(X, Y, step, parent, zIndex) {
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
            "parent": parent
        },
        "ports": cellTemplate.ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        "parent": parent
    }
};

function getWaitNode(X, Y, step, parent, zIndex) {
    var mode = ""
    var moment = require('moment');
    var timestamp = "";

    if (step.duration != undefined && step.duration != "") {
        mode = "duration"
    } else if (step.timestamp != undefined && step.timestamp != "") {
        mode = "timestamp"
        timestamp = moment(step.timestamp).format()
    }

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
            "parent": parent
        },
        "ports": cellTemplate.ports,
        "id": uuidv4(),
        "zIndex": zIndex,
        "parent": parent
    };
}

export default {
    getPassNode,
    getTaskNode,
    getWaitNode,
}