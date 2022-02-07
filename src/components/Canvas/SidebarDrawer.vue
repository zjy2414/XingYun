<template>
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
    <a-form :model="Form.task" :rules="rules" layout="vertical" v-if="Form.task.Visible">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="资源Arn*" name="resourceArn">
            <a-input v-model="Form.task.resourceArn" placeholder="请输入resourceArn" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="任务超时时间" name="timeoutSeconds">
            <a-input v-model="Form.task.timeoutSeconds" placeholder="请输入timeoutSeconds" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- Wait -->
    <a-form :model="Form.wait" :rules="rules" layout="vertical" v-if="Form.wait.Visible">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="等待模式*" name="waitmode">
            <a-select ref="select" v-model="Form.wait.mode" style="width: 210px">
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
            <a-input v-model="Form.foreach.iterationMapping.item" placeholder="请输入item" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="迭代元素位置(index)" name="index">
            <a-input v-model="Form.foreach.iterationMapping.index" placeholder="请输入index" />
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
            <a-input v-model="Form.choice.condition.condition" placeholder="请输入condition" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-form :model="Form.choice" :rules="rules" layout="vertical">
      <a-row :gutter="16" v-if="Form.choice.condition.Visible || Form.choice.default.Visible">
        <a-col :span="24">
          <a-form-item label="目标步骤(goto)*" name="goto">
            <a-input v-model="Form.choice.goto" placeholder="请输入目标步骤名称" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- Fail -->
    <a-form :model="Form.fail" :rules="rules" layout="vertical" v-if="Form.fail.Visible">
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
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
    };
  },
  methods: {
    onClose() {
      this.visible = false;
      this.clearForm();
    },
  }
};
</script>