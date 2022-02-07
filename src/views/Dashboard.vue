/**
 * 工作流列表页面
 * 作者：东南dnf
 */

<template>
  <div>
    <a-row :gutter="24" type="flex" align="stretch">
      <a-col :span="24" :lg="16" class="mb-24">
        <!-- 函数工作流列表 -->
        <CardProjectTable
          :data="tableData"
          :columns="tableColumns"
        ></CardProjectTable>
      </a-col>

      <a-col :span="24" :lg="8" class="mb-24">
        <!-- 时间线 -->
        <CardOrderHistory></CardOrderHistory>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CardProjectTable from "../components/Cards/CardProjectTable";
import CardOrderHistory from "../components/Cards/CardOrderHistory";


const tableColumns = [
  {
    title: "名称",
    dataIndex: "name",
    scopedSlots: "name",
    width: 133,
  },
  {
    title: "地域",
    dataIndex: "regionID",
    scopedSlots: "regionID",
  },
  {
    title: "描述",
    dataIndex: "description",
    scopedSlots: "description",
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    scopedSlots: "createdTime",
  },
  {
    title: "",
    scopedSlots: { customRender: "editBtn" },
    width: 50,
  },
];

export default {
  components: {
    CardProjectTable,
    CardOrderHistory,
  },
  data() {
    return {
      tableData: [],
      tableColumns,
    };
  },
  mounted() {
    // this.checkToken();
    // this.checkAK()
  },
  methods: {
  },
};
</script>

<style lang="scss">
</style>