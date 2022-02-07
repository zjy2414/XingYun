/**
 * 工作流可视化编辑页面
 */

<template>
  <div>
    <XingYunCanvas @getGraph="getGraph" mode="edit" />

    <div class="bar">
      <a-row align="middle">
        <a-col :span="17"></a-col>
        <a-col :span="3">
          <a-popconfirm
            title="确定要删除这个工作流吗？"
            ok-text="是"
            cancel-text="否"
            @confirm="DeleteConfirm"
            @cancel="DeleteCancel"
          >
            <a-button type="danger" shape="round" class="generateFdlButton">
              <a-icon type="delete" />删除
            </a-button>
          </a-popconfirm>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="outputFDL" shape="round" class="generateFdlButton">
            <a-icon type="check" />确认修改（预览FDL）
          </a-button>
        </a-col>
      </a-row>
    </div>

    <DeployUpdateDialog
      :visible="fdlVisible"
      @showDeploy="showDeployDialog"
      :fdl_value="fdl_value"
      :regionID="OneStepDeploy.form.regionID"
      :roleArn="OneStepDeploy.form.roleArn"
      :flowName="OneStepDeploy.form.flowName"
      :flowDescription="OneStepDeploy.form.flowDescription"
    />
  </div>
</template>

<script>
import converter from "@/methods/convertJsonToFDL";
import fdlFormatter from "@/methods/formatToFdlJson";
import valitator from "@/methods/validator";
import { message } from "ant-design-vue";
import BlankForm from "@/definitions/Form";
import openapi from "@/methods/OpenAPI";
import DeployUpdateDialog from "@/components/Deploy/DeployUpdateDialog"
import XingYunCanvas from "../components/Canvas/XingYunCanvas.vue";

export default {
  name: "VisualEdit",
  components: { DeployUpdateDialog, XingYunCanvas },
  inject: ["reload"],
  mounted() {
    this.OneStepDeploy.form.regionID = this.$route.query.regionID;
    console.log("regionID: " + this.OneStepDeploy.form.regionID);
    this.OneStepDeploy.form.flowName = this.$route.query.flowName;
    console.log("flowName: " + this.OneStepDeploy.form.flowName);

    this.getDescriptionAndRoleArn(
      this.OneStepDeploy.form.regionID,
      this.OneStepDeploy.form.flowName
    );
  },
  beforeDestroy() {
    this.$router.go(0);
    // this.reload();
  },
  data() {
    return {
      graph: Object,
      sequenceList: new Map(),
      fdl_value: ``,
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
    //获取Graph
    getGraph(graph) {
      this.graph = graph
    },
    //弹出一键部署窗口
    showDeployDialog(value) {
      this.fdlVisible = value
    },
    //获取Cell信息
    getCell(cellID) {
      var jsonData = this.graph.toJSON();
      var cell = {};
      jsonData.cells.forEach((element) => {
        if (element.id == cellID) {
          cell = element;
        }
      });
      return cell;
    },
    //刷新全局指向线集合
    updateLineData() {
      var json = this.graph.toJSON();

      //获取全局所有指向线
      json.cells.forEach((element) => {
        if (element.shape == "edge") {
          this.sequenceList.set(element.source.cell, element.target.cell);
        }
      });
    },
    // 遍历同一连线分支的所有节点，结果返回节点集合
    getOneList(startNodeID) {
      var node = {};
      var nodeList = [];

      this.updateLineData();

      for (
        var nodeID = startNodeID;
        node.id != "end";
        nodeID = this.sequenceList.get(nodeID)
      ) {
        node = this.getCell(nodeID);

        if (node.data != undefined && node.data.def != undefined) {
          nodeList.push(fdlFormatter.sequenceFormat(node));
        }

        if (JSON.stringify(node) === "{}") break;
      }

      return nodeList;
    },
    // 遍历同一条件分支的所有节点，结果返回节点集合
    getConditionList(startNodeID) {
      var node = {};
      var nodeList = [];

      this.updateLineData();

      for (
        var nodeID = this.sequenceList.get(startNodeID);
        node.id != "end";
        nodeID = this.sequenceList.get(nodeID)
      ) {
        node = this.getCell(nodeID);

        if (node.data != undefined && node.data.def != undefined) {
          nodeList.push(fdlFormatter.sequenceFormat(node));
        }

        if (JSON.stringify(node) === "{}") break;
      }

      return nodeList;
    },
    //获取全局Fdl对象
    getFullFdlObject(startNodeID) {
      var node = {};
      var nodeList = [];

      this.updateLineData();

      for (
        var nodeID = startNodeID;
        node.id != "end";
        nodeID = this.sequenceList.get(nodeID)
      ) {
        node = this.getCell(nodeID);

        if (node.data != undefined && node.data.def != undefined) {
          var n = fdlFormatter.Format(node);

          // 对非顺序步骤添加子流程
          switch (n.def) {
            //并行步骤
            case "parallel":
              node.data.startNodeIDs.forEach((nodeID) => {
                var steps = this.getOneList(nodeID);
                n.branches.push({ steps: steps });
              });
              break;

            //循环步骤
            case "foreach":
              n.steps = this.getOneList(node.data.startNodeIDs[0]);
              break;

            //选择步骤
            case "choice":
              //先获取所有condition
              node.data.conditions.forEach((condition) => {
                var steps = this.getConditionList(condition.id);

                var choice = {
                  condition: condition.attrs.text.text,
                  steps: steps,
                  goto: condition.data.goto,
                };

                n.choices.push(choice);
              });

              //获取default
              if (
                node.data.default != undefined &&
                node.data.default.id != undefined
              ) {
                var steps = this.getConditionList(node.data.default.id);

                n.default = {
                  steps: steps,
                  goto: node.data.default.data.goto,
                };
              }
              break;

            default:
              break;
          }

          nodeList.push(n);
        }

        if (JSON.stringify(node) === "{}") break;
      }

      return nodeList;
    },
    //FDL输出
    async outputFDL() {
      this.refreshLevel2Details();

      //全局规范化检查
      var result = valitator.Validate(this.graph.toJSON());
      switch (result.code) {
        case 1:
          //生成FDL
          var fdlJsonArray = this.getFullFdlObject("start");
          var fdl = converter.Converter(fdlJsonArray);
          console.log("FDL:");
          console.log(fdl);
          this.fdl_value = fdl;
          this.fdlVisible = true;
          break;
        default:
          console.log(result);
          message.warning(result.msg);
          break;
      }
    },
    //刷新2级细节
    refreshLevel2Details() {
      var graph = this.graph.getNodes();

      graph.forEach((node) => {
        if (node.data.def == "parallel" || node.data.def == "foreach") {
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

          console.log(node.data.startNodeIDs);
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
    //工作流删除键响应事件
    async DeleteConfirm(e) {
      console.log(e);

      var resp = await openapi.DeleteFlow(
        this.$route.query.regionID,
        this.$route.query.flowName,
        this.$store.state.akID,
        this.$store.state.akSecret
      );
      console.log(resp);

      if (resp.status) {
        message.success("删除成功～");

        //删除完成后跳回首页
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } else {
        this.$message.warning("删除失败");
      }
    },
    DeleteCancel(e) {
      // console.log(e);
      // message.error("Click on No");
    },
    async getDescriptionAndRoleArn(regionID, flowName) {
      var resp = await openapi.GetFlow(
        regionID,
        flowName,
        this.$store.state.akID,
        this.$store.state.akSecret
      );

      if (resp.status) {
        this.OneStepDeploy.form.flowDescription = resp.flow.Description;
        this.OneStepDeploy.form.roleArn = resp.flow.RoleArn;
      }
    },
  },
};
</script>

<style>
.bar {
  width: 100%;
  height: 100%;
}

.generateFdlButton {
  float: right;
  margin-top: 20px;
  margin-right: 7px;
  margin-bottom: 5px;
}
</style>
