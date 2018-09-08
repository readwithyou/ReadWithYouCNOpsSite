<template>
  <div class="content">
    <can I="read" a="registration">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
            <md-tabs md-alignment="fixed">

              <md-tab id="tab-ballot" md-label="报名信息">
                <registration-detail-panel :initial-registration='registration' v-on:update-registration="registration = $event"></registration-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" md-label="试课安排">
                <course-arrangement-panel :initial-registration='registration' v-on:update-registration="registration = $event"></course-arrangement-panel>
              </md-tab>

              <md-tab id="tab-result" md-label="试课结果">
                <course-result-panel :initial-registration='registration' v-on:update-registration="registration = $event"></course-result-panel>
              </md-tab>

            </md-tabs>
      </div>
    </can>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { NavTabsCard, NavTabsTable } from "components";
import {
  RegistrationDetailPanel,
  CourseArrangementPanel,
  CourseResultPanel
} from "pages";

export default {
  components: {
    Can,
    NavTabsCard,
    NavTabsTable,
    RegistrationDetailPanel,
    CourseArrangementPanel,
    CourseResultPanel
  },
  created() {
    var resource = this.$resource(
      "/api/registrations/" + this.$route.params.id
    );
    resource.get().then(
      response => {
        var reg = response.body;
        if (!reg.courseFiles) reg.courseFiles = [];
        if (!reg.courseResultFiles) reg.courseResultFiles = [];
        this.registration = reg;
      },
      response => {
        this.$notify({
          message: "服务器端获取试课报名数据失败！",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "top",
          type: "danger"
        });
      }
    );
  },
  data() {
    return {
      registration: {}
    };
  }
};
</script>
