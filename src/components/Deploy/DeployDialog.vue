<template>
    <a-modal
        :visible="fdlVisible"
        width="1000px"
        title="一键部署"
        cancelText="取消"
        @ok="DeployNextStep"
        @cancel="DeployCancel"
        :okText="okText"
    >
        <!-- Footer -->
        <template #footer>
            <a-button key="back" @click="DeployBackStep" v-if="!deploySuccessFully && step != 1">返回</a-button>
            <a-button
                key="submit"
                type="primary"
                :loading="loadingVisible"
                @click="DeployNextStep"
            >{{ okText }}</a-button>
        </template>

        <a-space direction="vertical" style="width: 100%" size="large">
            <a-steps>
                <a-step :status="step == 1 ? 'wait' : 'finish'" title="FDL">
                    <template #icon>
                        <a-icon type="align-left" style="color: #1890ff" />
                    </template>
                </a-step>
                <a-step :status="step > 2 ? 'finish' : 'wait'" title="配置">
                    <template #icon>
                        <a-icon type="edit" :style="step >= 2 ? 'color: #1890ff' : ''" />
                    </template>
                </a-step>
                <a-step :status="step == 3 ? 'finish' : 'wait'" title="部署">
                    <template #icon>
                        <a-icon type="rocket" />
                    </template>
                </a-step>
            </a-steps>

            <!-- Step1 -->
            <a-textarea v-model="fdl_value" placeholder="FDL流程定义语言" auto-size v-if="step == 1" />

            <!-- Step2 -->
            <a-form :model="form" :rules="rules" layout="vertical" v-else-if="step == 2">
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="regionID" name="regionID">
                            <a-select v-model="form.regionID" placeholder="选择regionID">
                                <a-select-option value="cn-shanghai">cn-shanghai</a-select-option>
                                <a-select-option value="cn-hangzhou">cn-hangzhou</a-select-option>
                                <a-select-option value="cn-beijing">cn-beijing</a-select-option>
                                <a-select-option value="cn-shenzhen">cn-shenzhen</a-select-option>
                                <a-select-option value="us-west-1">us-west-1</a-select-option>
                                <a-select-option value="ap-southeast-1">ap-southeast-1</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="roleArn(流程包含task步骤时必填)" name="roleArn">
                            <a-input v-model="form.roleArn" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="AccessID Key" name="akID">
                            <a-input v-model="form.akID" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="AccessID Secret" name="akSecret">
                            <a-input v-model="form.akSecret" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item label="工作流名称" name="flowName">
                            <a-input v-model="form.flowName" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="工作流描述" name="flowDescription">
                            <a-input v-model="form.flowDescription" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>

            <!-- Step3 -->
            <div v-else-if="step == 3">
                <!-- Success -->
                <a-result
                    status="success"
                    :title="
                        form.flowName +
                        '已成功部署至阿里云Serverless工作流!'
                    "
                    sub-title="您可以点击下方按钮运行一次工作流"
                    v-if="this.deploySuccessFully"
                >
                    <template #extra>
                        <a-button
                            key="console"
                            type="primary"
                            @click="ExecFDL"
                            :loading="execLoading"
                        >执行</a-button>
                        <a-button
                            key="goAliyun"
                            @click="GotoLink('https://fnf.console.aliyun.com/')"
                        >前往阿里云工作台</a-button>
                    </template>
                </a-result>

                <!-- Fail -->
                <a-result status="warning" title="部署失败" :subTitle="FailCause" v-else></a-result>
            </div>
        </a-space>
    </a-modal>
</template>

<script>
import { message } from "ant-design-vue";
import openapi from "@/methods/OpenAPI";
import BlankForm from "@/definitions/Form";

export default ({
    name: "DeployDialog",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        showDeploy: {
            type: Function
        },
        fdl_value: {
            type: String,
            default: "version: v1",
        },
    },
    computed: {
        fdlVisible: {
            get() {
                return this.visible;
            },
        },
    },
    data() {
        return {
            okText: "下一步",
            step: 1,
            deploySuccessFully: false,
            form: {
                regionID: "",
                akID: this.$store.state.akID,
                akSecret: this.$store.state.akSecret,
                flowName: "",
                flowDefinition: "",
                flowDescription: "",
                roleArn: "",
            },
            loadingVisible: false,
            execLoading: false,
            rules: BlankForm.rules,
        }
    },
    methods: {
        async DeployNextStep() {
            var complete = false;
            switch (this.step) {
                case 2:
                    if (
                        this.form.regionID == "" ||
                        this.form.akID == "" ||
                        this.form.akSecret == "" ||
                        this.form.flowName == "" ||
                        this.form.flowDescription == ""
                    ) {
                        message.warning("请将配置信息填写完整");
                        break;
                    }

                    this.loadingVisible = true;

                    var result = await openapi.FdlDeploy(
                        this.form.regionID,
                        this.form.akID,
                        this.form.akSecret,
                        this.form.flowName,
                        this.fdl_value,
                        this.form.flowDescription,
                        this.form.roleArn
                    );
                    this.deploySuccessFully = result.status;
                    this.FailCause = result.msg;
                    // console.log("部署结果：", this.deploySuccessFully);

                    setTimeout(() => {
                        this.loadingVisible = false;
                        this.okText = "完成";
                        this.step++;
                    }, 1000);
                    break;

                case 3:
                    // this.DeployCancel();
                    this.$router.go(0);
                    complete = true;
                    break;

                default:
                    break;
            }

            if (
                this.step >= 1 &&
                this.step < 2 &&
                !complete
            ) {
                this.step++;
            }
        },
        DeployBackStep() {
            if (this.step == 3) {
                this.okText = "下一步";
            }

            if (this.step > 1 && this.step <= 3) {
                this.step--;
            }
        },
        DeployCancel() {
            this.$emit("showDeploy", false);
            this.okText = "下一步";
            this.step = 1;
            this.from = {
                regionID: "",
                akID: "",
                akSecret: "",
                flowName: "",
                flowDefinition: "",
                flowDescription: "",
                roleArn: "",
            }
            this.rules = BlankForm.deployRules;
            this.loadingVisible = false;
            this.deploySuccessFully = false;
            this.FailCause = "";
            this.execLoading = false;

        },
        //外部链接跳转
        GotoLink(e) {
            window.open(e);
        },
        //执行FDL
        async ExecFDL() {
            this.execLoading = true;

            var runResult = await openapi.RunFDL(
                this.form.regionID,
                this.form.akID,
                this.form.akSecret,
                this.form.flowName
            );
            if (!runResult.status) {
                message.warning("工作流启动失败");
                message.warning(runResult.msg);
                this.execLoading = false;
                return;
            }

            //等待执行完毕
            setTimeout(() => {
                this.getExecResult(runResult);
            }, 3600);
        },
        async getExecResult(runResult) {
            var ExecResult = await openapi.GetExecutionResult(
                this.form.regionID,
                this.form.akID,
                this.form.akSecret,
                this.form.flowName,
                runResult.executionName
            );
            if (
                !ExecResult.status &&
                ExecResult.msg != "ExecutionSucceeded" &&
                ExecResult.msg != "ExecutionStarted" &&
                ExecResult.msg != "StepStarted" &&
                ExecResult.msg != "StepSucceeded"
            ) {
                message.warning(ExecResult.msg);
                message.warning("请前往阿里云Serverless工作流控制台查看详情");
                this.execLoading = false;
                return;
            } else if (
                ExecResult.msg == "ExecutionStarted" ||
                ExecResult.msg == "StepStarted"
            ) {
                message.success("工作流正在执行中，请前往阿里云控制台查看执行结果");
                this.execLoading = false;
                return;
            }

            message.success("工作流执行成功");
            this.execLoading = false;
        },
    }
})
</script>