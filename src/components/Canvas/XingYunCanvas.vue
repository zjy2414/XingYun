/**
 * 行云主画布
 */

<template>
    <div class="content">
        <div class="app-stencil" ref="stencilContainer"></div>

        <div id="container" ref="container">
            <a-drawer
                title="编辑节点"
                :width="360"
                :visible="visible"
                :body-style="{ paddingBottom: '80px' }"
                @close="onClose"
            >
                <a-form :model="form" :rules="rules" layout="vertical">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="ID" name="id">
                                <a-input v-model="form.id" placeholder="请输入ID" :disabled="true" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16" v-if="form.nameVisible">
                        <a-col :span="24">
                            <a-form-item label="名称*" name="name">
                                <a-input v-model="form.name" placeholder="请输入名称" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- Task -->
                <a-form
                    :model="Form.task"
                    :rules="rules"
                    layout="vertical"
                    v-if="Form.task.Visible"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="资源Arn*" name="resourceArn">
                                <a-input
                                    v-model="Form.task.resourceArn"
                                    placeholder="请输入resourceArn"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="任务超时时间" name="timeoutSeconds">
                                <a-input
                                    v-model="Form.task.timeoutSeconds"
                                    placeholder="请输入timeoutSeconds"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- Wait -->
                <a-form
                    :model="Form.wait"
                    :rules="rules"
                    layout="vertical"
                    v-if="Form.wait.Visible"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="等待模式*" name="waitmode">
                                <a-select
                                    ref="select"
                                    v-model="Form.wait.mode"
                                    style="width: 210px"
                                >
                                    <a-select-option value="duration">相对时间 (duration)</a-select-option>
                                    <a-select-option value="timestamp">绝对时间 (timestamp)</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16" v-if="Form.wait.mode == 'duration'">
                        <a-col :span="24">
                            <a-form-item label="等待时长(秒)" name="duration">
                                <a-input v-model="Form.wait.duration" placeholder="请输入duration" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16" v-if="Form.wait.mode == 'timestamp'">
                        <a-col :span="24">
                            <a-form-item label="等待的绝对时间(RFC3339格式)" name="timestamp">
                                <a-input v-model="Form.wait.timestamp" placeholder="请输入timestamp" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- Foreach -->
                <a-form
                    :model="Form.foreach.iterationMapping"
                    :rules="rules"
                    layout="vertical"
                    v-if="Form.foreach.Visible"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="迭代映射循环集合*" name="collection">
                                <a-input
                                    v-model="Form.foreach.iterationMapping.collection"
                                    placeholder="请输入collection"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="迭代元素名称(item)*" name="item">
                                <a-input
                                    v-model="Form.foreach.iterationMapping.item"
                                    placeholder="请输入item"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="迭代元素位置(index)" name="index">
                                <a-input
                                    v-model="Form.foreach.iterationMapping.index"
                                    placeholder="请输入index"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- Choice -->
                <a-form
                    :model="Form.choice.condition"
                    :rules="rules"
                    layout="vertical"
                    v-if="Form.choice.condition.Visible"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="条件*" name="condition">
                                <a-input
                                    v-model="Form.choice.condition.condition"
                                    placeholder="请输入condition"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <a-form :model="Form.choice" :rules="rules" layout="vertical">
                    <a-row
                        :gutter="16"
                        v-if="Form.choice.condition.Visible || Form.choice.default.Visible"
                    >
                        <a-col :span="24">
                            <a-form-item label="目标步骤(goto)*" name="goto">
                                <a-input v-model="Form.choice.goto" placeholder="请输入目标步骤名称" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- Fail -->
                <a-form
                    :model="Form.fail"
                    :rules="rules"
                    layout="vertical"
                    v-if="Form.fail.Visible"
                >
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="错误类型" name="error">
                                <a-input v-model="Form.fail.error" placeholder="请输入error" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="错误原因" name="cause">
                                <a-input v-model="Form.fail.cause" placeholder="请输入cause" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- 可选参数 -->

                <!-- end -->
                <a-form layout="vertical" v-if="form.endVisible">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-form-item label="当前步骤结束后是否继续执行其后定义的步骤？" name="end">
                                <a-select ref="select" v-model="form.end" style="width: 210px">
                                    <a-select-option value>不选择</a-select-option>
                                    <a-select-option value="false">是</a-select-option>
                                    <a-select-option value="true">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- 抽屉底部按钮 -->
                <div
                    :style="{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                        zIndex: 1,
                    }"
                >
                    <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
                    <a-button type="primary" @click="submit">确定</a-button>
                </div>
            </a-drawer>
        </div>
    </div>
</template>

<script>
import { Graph, Shape, Addon } from "@antv/x6";
const { Stencil } = Addon;
import staticNode from "@/definitions/staticNodeDefine";
import nodeDefine from "@/definitions/nodeDefine";
import { message } from "ant-design-vue";
import BlankForm from "@/definitions/Form";
import openapi from "@/methods/OpenAPI";
import FDLtoCells from "@/methods/convertFDLtoCells";

export default {
    name: "XingYunCanvas",
    props: {
        getGraph: {
            type: Function
        },
    },
    components: {},
    inject: ["reload"],
    mounted() {
        this.canvasInit();

        if (this.mode == 'edit') {
            this.graphLoad();
        }
    },
    beforeDestroy() {
        this.$router.go(0);
        this.reload();
    },
    props: {
        getGraph: {
            type: Function,
        },
        mode: {
            type: String,
            default: 'create'
        },
    },
    data() {
        return {
            firstOpen: true,
            sequenceList: new Map(),
            form: {
                id: "",
                name: "",
                nameVisible: false,
                end: "",
                endVisible: false,
            },
            Form: {
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
            },
            rules: BlankForm.rules,
            visible: false,
            fdlVisible: false,
            OneStepDeploy: {
                form: {
                    regionID: "",
                    akID: this.$store.state.akID,
                    akSecret: this.$store.state.akSecret,
                    flowName: "",
                    flowDefinition: "",
                    flowDescription: "",
                    roleArn: "",
                },
            },
        };
    },
    methods: {
        //抽屉展示
        showDrawer(cell) {
            if (cell.id != "start" && cell.id != "end") {
                this.form.id = cell.id;
                this.form.name = cell.attrs.text.text;

                //不给choice的conditon和default步骤添加名称修改框
                if (cell.data.def != "condition" && cell.data.def != "default") {
                    this.form.nameVisible = true;
                } else {
                    this.form.nameVisible = false;
                }

                //判断是否应该添加end框
                if (
                    cell.data.def == "pass" ||
                    cell.data.def == "task" ||
                    cell.data.def == "wait" ||
                    cell.data.def == "parallel" ||
                    cell.data.def == "foreach" ||
                    cell.data.def == "choice"
                ) {
                    this.form.endVisible = true;
                    this.form.end = cell.data.end;
                }

                //映射至全局cell
                this.cell = cell;

                switch (this.cell.data.def) {
                    case "task":
                        this.Form.task.service = cell.data.service;
                        this.Form.task.fc = cell.data.fc;
                        this.Form.task.resourceArn = cell.data.resourceArn;
                        this.Form.task.timeoutSeconds = cell.data.timeoutSeconds;

                        this.Form.task.Visible = true;
                        break;
                    case "wait":
                        this.Form.wait.mode = cell.data.mode;
                        if (cell.data.duration != undefined && cell.data.duration != "")
                            this.Form.wait.duration = cell.data.duration;
                        if (cell.data.timestamp != undefined && cell.data.timestamp != "")
                            this.Form.wait.timestamp = cell.data.timestamp;

                        this.Form.wait.Visible = true;
                        break;

                    case "foreach":
                        this.Form.foreach.iterationMapping.collection =
                            cell.data.iterationMapping.collection;
                        this.Form.foreach.iterationMapping.item =
                            cell.data.iterationMapping.item;

                        this.Form.foreach.iterationMapping.index =
                            cell.data.iterationMapping.index;

                        this.Form.foreach.Visible = true;
                        break;

                    case "condition":
                        this.Form.choice.condition.condition = cell.data.condition;
                        this.Form.choice.goto = cell.data.goto;

                        this.Form.choice.condition.Visible = true;
                        break;

                    case "default":
                        this.Form.choice.goto = cell.data.goto;

                        this.Form.choice.default.Visible = true;
                        break;

                    case "fail":
                        this.Form.fail.error = cell.data.error;
                        this.Form.fail.cause = cell.data.cause;

                        this.Form.fail.Visible = true;
                        break;

                    default:
                        break;
                }
                this.visible = true;
            }
        },
        onClose() {
            this.visible = false;
            this.clearForm();
        },
        clearForm() {
            this.form = {
                id: "",
                name: "",
                nameVisible: false,
                end: "",
                endVisible: false,
            };

            // 重置Form
            this.Form = BlankForm.reset(this.Form);
        },
        submit() {
            this.cell.attrs.text.text = this.form.name;
            var status = true;

            if (
                this.cell.shape == "pass" ||
                this.cell.shape == "task" ||
                this.cell.shape == "wait" ||
                this.cell.shape == "parallel" ||
                this.cell.shape == "foreach" ||
                this.cell.shape == "choice"
            ) {
                this.cell.data.end = this.form.end;
            }

            switch (this.cell.shape) {
                case "task":
                    this.cell.data.service = this.Form.task.service;
                    this.cell.data.fc = this.Form.task.fc;
                    if (this.Form.task.resourceArn == "") {
                        status = false;
                        message.warning("请填写resourceArn");
                    }
                    this.cell.data.resourceArn = this.Form.task.resourceArn;
                    this.cell.data.timeoutSeconds = this.Form.task.timeoutSeconds;
                    break;

                case "wait":
                    if (this.Form.wait.mode == undefined || this.Form.wait.mode == "") {
                        status = false;
                        message.warning("请选择等待模式");
                    }
                    this.cell.data.mode = this.Form.wait.mode;
                    if (this.Form.wait.mode == "duration") {
                        if (this.Form.wait.duration == "") {
                            status = false;
                            message.warning("请输入duration");
                        }
                        this.cell.data.duration = this.Form.wait.duration;
                        this.cell.data.timestamp = "";
                    }
                    if (this.Form.wait.mode == "timestamp") {
                        if (this.Form.wait.timestamp == "") {
                            status = false;
                            message.warning("请输入timestamp");
                        }
                        this.cell.data.timestamp = this.Form.wait.timestamp;
                        this.cell.data.duration = "";
                    }

                    break;

                case "condition":
                    this.cell.data.condition = this.Form.choice.condition.condition;
                    if (this.Form.choice.condition.condition != "") {
                        this.cell.attrs.text.text = this.Form.choice.condition.condition;
                    } else {
                        status = false;
                        message.warning("请输入条件");
                    }
                    this.cell.data.goto = this.Form.choice.goto;
                    break;

                case "default":
                    this.cell.data.goto = this.Form.choice.goto;
                    break;

                case "foreach":
                    if (this.Form.foreach.iterationMapping.collection == "") {
                        status = false;
                        message.warning("请输入collection");
                    }
                    if (this.Form.foreach.iterationMapping.item == "") {
                        status = false;
                        message.warning("请输入item");
                    }
                    this.cell.data.iterationMapping.collection =
                        this.Form.foreach.iterationMapping.collection;
                    this.cell.data.iterationMapping.item =
                        this.Form.foreach.iterationMapping.item;
                    this.cell.data.iterationMapping.index =
                        this.Form.foreach.iterationMapping.index;
                    break;

                case "fail":
                    this.cell.data.error = this.Form.fail.error;
                    this.cell.data.cause = this.Form.fail.cause;
                    break;

                default:
                    break;
            }

            if (status == true) {
                this.onClose();
                this.graph.fromJSON(this.graph.toJSON());
            }
        },
        canvasInit() {
            //实例化开始和结束步骤块
            const startRect = new Shape.Rect(staticNode.startRect);
            const endRect = new Shape.Rect(staticNode.endRect);

            const graph = new Graph({
                container: document.getElementById("container"),
                width: 1600,
                height: 810,
                background: {
                    color: "#ffffff", // 设置画布背景颜色
                },
                snapline: true,
                history: true,
                grid: {
                    size: 10,
                    visible: true,
                },
                resizing: {
                    enabled: true,
                },
                panning: true,
                connecting: {
                    snap: true,
                    allowBlank: false,
                    allowLoop: false,
                    highlight: true,
                    connector: "rounded",
                    connectionPoint: "boundary",
                    router: {
                        name: "er",
                        args: {
                            direction: "V",
                        },
                    },
                    createEdge() {
                        return new Shape.Edge({
                            text: "",
                            attrs: {
                                line: {
                                    stroke: "#a0a0a0",
                                    strokeWidth: 1,
                                    targetMarker: {
                                        name: "classic",
                                        size: 7,
                                    },
                                },
                            },
                        });
                    },
                    validateConnection({ sourceView, targetView, targetMagnet }) {
                        if (sourceView || targetView);

                        if (!targetMagnet) {
                            return false;
                        }

                        if (targetMagnet.getAttribute("port-group") !== "in") {
                            return false;
                        }

                        return true;
                    },
                },
                embedding: {
                    enabled: true,
                    findParent({ node }) {
                        const bbox = node.getBBox();
                        return this.getNodes().filter((node) => {
                            const data = node.getData();
                            // console.log(data);
                            if (data && data.parent) {
                                const targetBBox = node.getBBox();
                                // console.log(node);
                                return bbox.isIntersectWithRect(targetBBox);
                            }
                            return false;
                        });
                    },
                },
                highlighting: {
                    embedding: {
                        name: "stroke",
                        args: {
                            padding: -14,
                            attrs: {
                                stroke: "",
                            },
                        },
                    },
                },
            });

            this.graph = graph;
            this.history = graph.history;

            //graph传递至父组件
            this.$emit("getGraph", this.graph);

            graph.addNode(startRect);
            graph.addNode(endRect);

            console.log(graph.getCellCount());

            // 组件栏
            const stencil = new Stencil({
                title: "步骤组件（全部）",
                target: graph,
                search: false,
                collapsable: true,
                stencilGraphWidth: 200,
                stencilGraphHeight: 340,
                stencilGraphPadding: 200,
                groups: [
                    {
                        name: "interalComponent",
                        title: "顺序组件",
                        layoutOptions: {
                            // resizeToFit: true,
                            columns: 1,
                            dx: 68,
                            dy: 20,
                            rowHeight: 80,
                        },
                    },
                    {
                        name: "parallelComponent",
                        title: "并行组件",
                        layoutOptions: {
                            columns: 1,
                            dx: 68,
                            dy: 100,
                            rowHeight: 100,
                        },
                    },
                    {
                        name: "switchComponent",
                        title: "选择分支组件(配套使用)",
                        layoutOptions: {
                            columns: 1,
                            dx: 68,
                            dy: 95,
                        },
                    },
                    {
                        name: "foreachComponent",
                        title: "循环组件",
                        layoutOptions: {
                            columns: 1,
                            dx: 68,
                            dy: 100,
                        },
                    },
                    {
                        name: "otherComponent",
                        title: "其他组件",
                        layoutOptions: {
                            columns: 1,
                            dx: 68,
                        },
                    },
                ],
            });
            //将组件栏添加到页面左侧位置
            this.$refs.stencilContainer.appendChild(stencil.container);

            if (this.$global_flag.editFirstLoad) {
                this.$global_flag.editFirstLoad = false;

                //注册步骤组件
                Shape.Rect.define(nodeDefine.task);
                Shape.Rect.define(nodeDefine.pass);
                Shape.Rect.define(nodeDefine.wait);
                Shape.Rect.define(nodeDefine.parallel);
                Shape.Rect.define(nodeDefine.choice);
                Shape.Rect.define(nodeDefine.condition);
                Shape.Rect.define(nodeDefine.defaultCondition);
                Shape.Rect.define(nodeDefine.foreach);
                Shape.Rect.define(nodeDefine.succeed);
                Shape.Rect.define(nodeDefine.fail);

                //实例化步骤组件
                const taskRect = graph.createNode(nodeDefine.taskNode);
                const passRect = graph.createNode(nodeDefine.passNode);
                const waitRect = graph.createNode(nodeDefine.waitNode);
                const parallelRect = graph.createNode(nodeDefine.parallelNode);
                const choiceRect = graph.createNode(nodeDefine.choiceNode);
                const conditionRect = graph.createNode(nodeDefine.conditionNode);
                const defaultConditionRect = graph.createNode(nodeDefine.defaultNode);
                const foreachRect = graph.createNode(nodeDefine.foreachNode);
                const succeedRect = graph.createNode(nodeDefine.succeedNode);
                const failRect = graph.createNode(nodeDefine.failNode);

                //载入组件栏
                stencil.load([passRect, taskRect, waitRect], "interalComponent");
                stencil.load([parallelRect], "parallelComponent");
                stencil.load(
                    [choiceRect, conditionRect, defaultConditionRect],
                    "switchComponent"
                );
                stencil.load([foreachRect], "foreachComponent");
                stencil.load([succeedRect, failRect], "otherComponent");

                this.firstOpen = false;
            }

            /** 事件响应 **/

            //双击节点弹出右侧编辑窗
            graph.on("node:dblclick", ({ e, x, y, cell, view }) => {
                console.log(e + ", " + x + ", " + y + ", " + cell + ", " + view);
                // console.log(cell.id);
                this.showDrawer(cell);
            });

            // 鼠标 Hover 时添加删除按钮
            graph.on("node:mouseenter", ({ node }) => {
                if (node.id != "start" && node.id != "end") {
                    node.addTools(
                        [
                            {
                                name: "button-remove",
                                args: { distance: 20 },
                            },
                        ],
                        "onhover" // 工具集名称，可省略
                    );
                }
            });

            //鼠标离开时删除按钮
            graph.on("node:mouseleave", ({ node }) => {
                if (node.hasTools("onhover")) {
                    node.removeTools();
                }
            });

            // 鼠标 Hover 时添加按钮
            graph.on("edge:mouseenter", ({ edge }) => {
                edge.addTools(
                    [
                        {
                            name: "button-remove",
                            args: { distance: 20 },
                        },
                    ],
                    "onhover" // 工具集名称，可省略
                );
            });

            //鼠标离开时删除按钮
            graph.on("edge:mouseleave", ({ edge }) => {
                if (edge.hasTools("onhover")) {
                    edge.removeTools();
                }
            });

            graph.on("node:change:parent", ({ node }) => {
                console.log(node.id);
            });

            //子流程改变事件
            graph.on("node:change:children", ({ node }) => {
                // console.log();
                if (node.data.def != "choice") {
                    var edges = this.graph.getEdges();
                    var startNodes = node.getChildren();

                    edges.forEach((element) => {
                        startNodes = startNodes.filter(function (node) {
                            return node.id != element.target.cell;
                        });
                    });

                    //清空原有数据
                    node.data.startNodeIDs = [];

                    //读取并行任务每条支线
                    startNodes.forEach((element) => {
                        node.data.startNodeIDs.push(element.id);
                    });

                    // console.log("node.data.startNodeIDs:");
                    // console.log(node.data.startNodeIDs);
                } else if (node.data.def == "choice") {
                    //清空原有conditions
                    node.data.conditions = [];

                    //找出所有condition和一个default
                    node.getChildren().forEach((element) => {
                        if (element.data != undefined && element.data.def != undefined) {
                            switch (element.data.def) {
                                case "condition":
                                    element.data.parent = node.id;
                                    node.data.conditions.push(element);

                                    console.log(node.data.conditions);
                                    break;

                                case "default":
                                    element.data.parent = node.id;
                                    // element.data.goto = node.data.goto;
                                    node.data.default = element;
                                    break;

                                default:
                                    break;
                            }
                        }
                    });
                }
            });
        },
        //撤销方法
        redoGraph() {
            this.history.redo();
        },
        //恢复方法
        undoGraph() {
            this.history.undo();
        },
        //画布数据加载
        async graphLoad() {
            var resp = await openapi.GetFlow(
                this.$route.query.regionID,
                this.$route.query.flowName,
                this.$store.state.akID,
                this.$store.state.akSecret
            );
            console.log(resp);

            if (resp.status) {
                this.OneStepDeploy.form.flowDescription = resp.flow.Description;
                this.OneStepDeploy.form.roleArn = resp.flow.RoleArn;

                this.graph.fromJSON(FDLtoCells.Converter(resp.flow.Definition));

                console.log(FDLtoCells.Converter(resp.flow.Definition))
            } else {
                this.$message.warning("工作流不存在");

                //不存在就跳回函数留列表
                setTimeout(() => {
                    this.$router.push("/");
                }, 1000);
            }
        }
    },
};
</script>

<style>
.content {
    font-family: sans-serif;
    display: flex;
    height: 100%;
}

.app-stencil {
    width: 250px;
    position: relative;
}

#container {
    flex: 1;
    height: 100%;
    margin-left: 10px;
    margin-right: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
}
</style>