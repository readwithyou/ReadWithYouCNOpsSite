<template>
  <div class="content">
    <can I="read" a="teacher">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-tabs md-alignment="fixed">

          <md-tab id="tab-ballot" :md-label="$t('message.basic_info')">
            <teacher-detail-panel></teacher-detail-panel>
          </md-tab>

          <md-tab id="tab-calendar" :md-label="$t('message.course_plan')">
            <teacher-course-table></teacher-course-table>
          </md-tab>

        </md-tabs>
      </div>
    </can>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { NavTabsCard, NavTabsTable } from "components";
import { TeacherDetailPanel, TeacherCourseTable } from "pages";

export default {
  components: {
    Can,
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
