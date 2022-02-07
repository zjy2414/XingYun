/**
 * 本文件定义了各种接口
 * 作者：东南dnf
 */

//只进口
const inPort = {
    position: "top",
    label: {
        position: "top",
    },
    attrs: {
        circle: {
            r: 6,
            magnet: true,
            stroke: "#FFD700",
            strokeWidth: 2,
            fill: "#fff",
        },
    },
};

//只出口
const outPort = {
    position: "bottom",
    label: {
        position: "bottom",
    },
    attrs: {
        circle: {
            r: 6,
            magnet: true,
            stroke: "#31d0c6",
            strokeWidth: 2,
            fill: "#fff",
        },
    },
};

// 高亮接口
const magnetAvailabilityHighlighter = {
    name: 'stroke',
    args: {
        attrs: {
            fill: '#fff',
            stroke: '#47C769',
        },
    },
}

module.exports = {
    inPort,
    outPort,
    magnetAvailabilityHighlighter
};