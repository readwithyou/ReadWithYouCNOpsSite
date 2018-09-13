<template>
  <div class="content">
    <can I="read" a="student">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-tabs md-alignment="fixed" md-sync-route>

          <md-tab id="tab-ballot" :md-label="$t('message.basic_info')" :to="'/students/'+this.$route.params.id">
            <student-detail-panel v-if="$can('read', 'studentDetailInfo')"></student-detail-panel>
            <student-level-panel v-if="$can('read', 'studentLevelInfo')"></student-level-panel>
          </md-tab>

          <md-tab id="tab-calendar" :md-label="$t('message.course_plan')" :to="'/students/'+this.$route.params.id+'/course-plans'" v-if="$can('read', 'studentCoursePlan')">
            <student-course-table></student-course-table>
          </md-tab>

          <md-tab id="tab-other" :md-label="$t('message.book_list')" :to="'/students/'+this.$route.params.id+'/book-lists'" v-if="$can('read', 'bookList')">
            <book-list-table></book-list-table>
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
  StudentDetailPanel,
  StudentLevelPanel,
  StudentCourseTable,
  BookListTable
} from "pages";

export default {
  components: {
    Can,
    NavTabsCard,
    NavTabsTable,
    StudentDetailPanel,
    StudentLevelPanel,
    StudentCourseTable,
    BookListTable
  },
  data() {
    return {};
  }
};
</script>
