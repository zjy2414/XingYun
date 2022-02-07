/**
 * 本文件包括将各种步骤数据规范至FDL规定格式的方法
 * 作者：东南dnf
 */


/**
 * json转换
 * @param 节点 node 
 * @returns json
 */
function Format(node) {
    var part = {};

    switch (node.data.def) {
        case 'pass':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                end: node.data.end,
            }
            break;

        case 'task':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                resourceArn: node.data.resourceArn,
                end: node.data.end,
                timeoutSeconds: node.data.timeoutSeconds,
            }
            break;

        case 'wait':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                duration: node.data.duration,
                timestamp: node.data.timestamp,
                end: node.data.end,
            }
            break;

        case 'parallel':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                branches: [],
                end: node.data.end,
            }
            break;

        case 'choice':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                choices: [],
                end: node.data.end,
            }
            break;

        case 'foreach':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                iterationMapping: {
                    collection: node.data.iterationMapping.collection,
                    item: node.data.iterationMapping.item,
                    index: node.data.iterationMapping.index,
                },
                steps: [],
                end: node.data.end,
            }
            break;

        case 'succeed':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
            }
            break;

        case 'fail':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                error: node.data.error,
                cause: node.data.cause,
            }
            break;

        default:
            break;
    }

    return part;
}

/**
 * 顺序序列json转换
 * @param 节点 node 
 * @returns json
 */
function sequenceFormat(node) {
    var part = {};

    switch (node.data.def) {
        case 'pass':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
            }
            break;

        case 'task':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                resourceArn: node.data.resourceArn,
            }
            break;

        case 'wait':
            part = {
                def: node.data.def,
                name: node.attrs.text.text,
                duration: node.data.duration,
            }
            break;

        default:
            break;
    }

    return part;
}

module.exports = {
    Format,
    sequenceFormat,
}