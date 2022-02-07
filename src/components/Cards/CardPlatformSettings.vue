<template>
  <!-- Platform Settings Card -->
  <a-card
    :bordered="false"
    class="h-full header-solid"
    :bodyStyle="{ paddingTop: 0, paddingBottom: 0 }"
  >
    <template #title>
      <h6 class="m-0 font-semibold">平台设置（仅保存至浏览器localStorage）</h6>
    </template>
    <p>阿里云(Alibaba Cloud)</p>
    <ul class="list settings-list">
      <li>
        <h6 class="text-sm list-header text-muted">AccessKey ID:</h6>
      </li>
      <li>
        <a-input placeholder="请输入AccessKey ID" v-model="akID" />
      </li>
      <li>
        <h6 class="m-0 text-sm list-header text-muted">AccessKey Secret:</h6>
      </li>
      <li>
        <a-input placeholder="请输入AccessKey Secret" v-model="akSecret" />
      </li>
    </ul>

    <a-row>
      <a-col :span="12"> </a-col>
      <a-col :span="6" align="right">
        <a-button type="danger" icon="delete" @click="clearForm">
          清除
        </a-button>
      </a-col>

      <a-col :span="6" align="right">
        <a-button type="primary" icon="check" @click="storeAccessKey">
          保存
        </a-button>
      </a-col>
    </a-row>
    <p></p>
  </a-card>
  <!-- / Platform Settings Card -->
</template>

<script>
export default {
  data() {
    return {
      // Binded model property for "Platform Settings" switch button for "Email ... follows me" .
      emailForFollows: true,

      // Binded model property for "Platform Settings" switch button for "Email ... answers me" .
      emailForAnswers: false,

      // Binded model property for "Platform Settings" switch button for "Email ... mentions me" .
      emailForMentions: true,

      // Binded model property for "Platform Settings" switch button for "New launches and projects" .
      emailForNewProjects: true,

      // Binded model property for "Platform Settings" switch button for "Monthly product updates" .
      emailForProductUpdates: false,

      // Binded model property for "Platform Settings" switch button for "Subscribe to newsletter" .
      emailForNewsletter: true,
      akID: "",
      akSecret: "",
    };
  },
  mounted() {
    this.akID = this.$store.state.akID;
    this.akSecret = this.$store.state.akSecret;

    console.log(this.akID);
    console.log(this.akSecret);
  },
  methods: {
    storeAccessKey() {
      this.$store.commit("setAkID", this.akID);
      this.$store.commit("setAkSecret", this.akSecret);

      this.$message.success("保存成功~");
    },
    clearForm() {
      this.$store.commit("setAkID", "");
      this.$store.commit("setAkSecret", "");

      this.akID = "";
      this.akSecret = "";

      this.$message.success("清除成功～")
    },
  },
};
</script>