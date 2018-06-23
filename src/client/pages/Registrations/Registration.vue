<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-ballot" md-label="报名信息" md-icon="ballot">
                <registration-detail-panel></registration-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" md-label="试课安排" md-icon="calendar_today">
                <course-arrangement-panel></course-arrangement-panel>
              </md-tab>

              <md-tab id="tab-result" md-label="试课结果" md-icon="check_circle_outline">
                <course-result-panel></course-result-panel>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { RegistrationDetailPanel, CourseArrangementPanel, CourseResultPanel } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    RegistrationDetailPanel,
    CourseArrangementPanel,
    CourseResultPanel
  },
  data() {
    return {};
  }
};
</script>
