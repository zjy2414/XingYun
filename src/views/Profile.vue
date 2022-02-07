/**
 * 个人信息页面
 * 作者：东南dnf
 */

<template>
  <div>
    <!-- Header Background Image -->
    <div
      class="profile-nav-bg"
      style="background-image: url('images/bg-profile.jpg')"
    ></div>
    <!-- / Header Background Image -->

    <!-- User Profile Card -->
    <a-card
      :bordered="false"
      class="card-profile-head"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12" class="col-info">
            <a-avatar
              :size="74"
              shape="square"
              src="https://7463-tcb-nkd87viq9wheg653bca0d-a8621b-1304207482.tcb.qcloud.la/89a00170a50baeb0687707a2c75a0c5.jpg"
            />
            <div class="avatar-info">
              <h4 class="m-0 font-semibold">作者：东南dnf</h4>
              <p>计科大二，个人软件开发者</p>
            </div>
          </a-col>
          <a-col
            :span="24"
            :md="12"
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <!-- <a-button type="primary" icon="edit" @click="editProfile"
              >修改</a-button
            > -->
          </a-col>
        </a-row>
      </template>
    </a-card>
    <!-- User Profile Card -->

    <a-row type="flex" :gutter="24">
      <a-col :span="24" :md="8" class="mb-24"> </a-col>

      <!-- Profile Information Column -->
      <a-col :span="24" :md="8" class="mb-24">
        <!-- Platform Settings Card -->
        <CardPlatformSettings></CardPlatformSettings>
        <!-- / Platform Settings Card -->
      </a-col>
      <!-- / Profile Information Column -->
    </a-row>
  </div>
</template>

<script>
import CardPlatformSettings from "../components/Cards/CardPlatformSettings";

export default {
  components: {
    CardPlatformSettings,
  },
  data() {
    return {
      // Active button for the "User Profile" card's radio button group.
      profileHeaderBtns: "overview",
    };
  },
  mounted() {
    // this.checkToken();
  },
  methods: {
    editProfile() {
      console.log("editProfile");
    },
  },
};
</script>

<style lang="scss">
</style>