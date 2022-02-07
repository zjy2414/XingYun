/**
 * 工作流可视化创建页面
 */

<template>
  <div>
    <XingYunCanvas @getGraph="getGraph" />

    <div class="bar">
      <a-row>
        <a-col :span="18"></a-col>
        <a-col :span="6">
          <a-button type="primary" @click="outputFDL" shape="round" class="generateFdlButton">
            <a-icon type="thunderbolt" />生成FDL
          </a-button>
        </a-col>
      </a-row>
    </div>

    <DeployDialog :visible="fdlVisible" @showDeploy="showDeployDialog" :fdl_value="fdl_value" />
  </div>
</template>

<script>
import converter from "@/methods/convertJsonToFDL";
import fdlFormatter from "@/methods/formatToFdlJson";
import valitator from "@/methods/validator";
import { message } from "ant-design-vue";
import BlankForm from "@/definitions/Form";
import DeployDialog from '../components/Deploy/DeployDialog';
import XingYunCanvas from "../components/Canvas/XingYunCanvas.vue";

export default {
  name: "VisualEdit",
  components: { DeployDialog, XingYunCanvas },
  inject: ["reload"],
  mounted() {
  },
  beforeDestroy() {
    this.$router.go(0);
    this.reload();
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
      //全局规范化检查
      var result = valitator.Validate(this.graph.toJSON());
      switch (result.code) {
        case 1:
          //生成FDL
          var fdlJsonArray = this.getFullFdlObject("start");
          console.log(fdlJsonArray);
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
