<template>
  <!-- Projects Table Card -->
  <a-card
    :bordered="false"
    class="h-full header-solid"
    :bodyStyle="{ padding: 0 }"
  >
    <template #title>
      <a-row type="flex" align="middle">
        <a-col :span="24" :md="18">
          <h6>函数工作流</h6>
        </a-col>
        <a-col
          :span="24"
          :md="6"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-col
            :span="24"
            :md="4"
            style="
              display: flex;
              align-items: middle;
              justify-content: flex-end;
            "
          >
            <a-select
              default-value="cn-hangzhou"
              @change="regionSelect"
              show-search
              placeholder="Select a person"
              option-filter-prop="children"
              style="width: 200px"
              :filter-option="filterOption"
              v-model="regionSelected"
            >
              <a-select-option value="cn-hangzhou">cn-hangzhou</a-select-option>
              <a-select-option value="cn-shanghai">cn-shanghai</a-select-option>
              <a-select-option value="cn-beijing">cn-beijing</a-select-option>
              <a-select-option value="cn-shenzhen">cn-shenzhen</a-select-option>
              <a-select-option value="us-west-1">us-west-1</a-select-option>
              <a-select-option value="ap-southeast-1"
                >ap-southeast-1</a-select-option
              >
            </a-select>
          </a-col>

          <a-col
            :span="24"
            :md="8"
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <a-button
              type="primary"
              icon="plus"
              size="small"
              @click="$router.push({ name: '创建工作流' })"
            />
          </a-col>
        </a-col>
      </a-row>
    </template>

    <a-table
      v-if="this.data != []"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :loading="tableLoading"
    >
      <template slot="name" slot-scope="name">
        <h6 class="m-0">
          {{ name }}
        </h6>
      </template>

      <template slot="description" slot-scope="description">
        <h6 class="m-0">
          {{ description }}
        </h6>
      </template>

      <template slot="editBtn" slot-scope="row">
        <a-button
          :data-id="row.key"
          icon="edit"
          class="btn-edit"
          @click="toEditFlow(row.regionID, row.name)"
        >
          编辑
        </a-button>
      </template>

      <!-- <template slot="completion" slot-scope="completion">
				<span class="text-sm font-bold text-muted">{{ completion.label ? completion.label : completion }}</span>
				<a-progress :percent="completion.value ? completion.value : completion" :show-info="false" size="small" :status="completion.status ? completion.status : 'normal'" />
			</template> -->
    </a-table>
  </a-card>
  <!-- / Projects Table Card -->
</template>

<script>
import openapi from "../../methods/OpenAPI";
var moment = require("moment");
moment.locale("zh-cn");

export default {
  inject: ["reload"],
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // Active button for the "Projects" table's card header radio button group.
      projectHeaderBtns: "all",
      data: [],
      tableLoading: true,
      regions: [
        "cn-shanghai",
        "cn-hangzhou",
        "cn-beijing",
        "cn-shenzhen",
        "us-west-1",
        "ap-southeast-1",
      ],
      regionSelected: "cn-hangzhou",
    };
  },
  created() {
    this.refreshFlows();
  },
  methods: {
    enterEdit(name) {
      console.log("hi, " + name);
    },
    async getFlows(region) {
      var resp = await openapi.GetFlows(
        region,
        this.$store.state.akID,
        this.$store.state.akSecret
      );
      // console.log(resp);

      //3s内没收到数据就暂停
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tableLoading = false;
      }, 3000);

      if (resp.status) {
        var flows = resp.flows;
        this.data.length += flows.length;

        // moment.locale();

        for (let i = 0; i < flows.length; i++) {
          this.data[i] = {
            key: i.toString(),
            name: flows[i].Name,
            regionID: region,
            description: flows[i].Description,
            createdTime: moment(flows[i].CreatedTime).format(
              "YYYY/MM/DD hh:mm:ss"
            ),
          };
        }
      } else {
        this.$message.warning("获取工作流列表失败");
      }
    },
    async refreshFlows() {
      if (this.$store.state.akID != "" && this.$store.state.akSecret != "") {
        this.tableLoading = true;
        this.data = [];

        await this.getFlows(this.regionSelected);
        this.tableLoading = false;
      } else {
        this.$message.warning("请先填写akID与akSecret~");

        setTimeout(() => {
          this.$router.push("/profile");
        }, 1000);
      }
    },
    regionSelect() {
      this.refreshFlows();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    toEditFlow(regionID, flowName) {
      this.$router.push({
        name: "编辑工作流",
        query: { regionID: regionID, flowName: flowName },
      });
    },
  },
};
</script>