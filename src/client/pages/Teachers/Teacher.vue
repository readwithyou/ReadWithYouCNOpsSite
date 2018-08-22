<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-ballot" md-label="基本信息" md-icon="ballot">
                <teacher-detail-panel></teacher-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" md-label="课程安排" md-icon="calendar_today">
                <teacher-course-table></teacher-course-table>
              </md-tab>

              <md-tab id="tab-other" md-label="其他信息" md-icon="archive">
                under construction... please be patient...:)
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { TeacherDetailPanel, TeacherCourseTable } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    TeacherDetailPanel,
    TeacherCourseTable
  },
  data() {
    return {};
  }
};
</script>
