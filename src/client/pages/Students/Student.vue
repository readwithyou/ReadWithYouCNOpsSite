<template>
  <div class="content">
    <can I="read" a="student">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-ballot" :md-label="$t('message.basic_info')" md-icon="ballot">
                <student-detail-panel></student-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" :md-label="$t('message.course_plan')" md-icon="calendar_today" v-if="$can('read', 'studentCoursePlan')">
                <student-course-table></student-course-table>
              </md-tab>

              <md-tab id="tab-other" :md-label="$t('message.book_list')" md-icon="collections_bookmark" v-if="$can('read', 'bookList')">
                <book-list-table></book-list-table>
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
    </can>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { NavTabsCard, NavTabsTable } from "components";
import { StudentDetailPanel, StudentCourseTable, BookListTable } from "pages";

export default {
  components: {
    Can,
    NavTabsCard,
    NavTabsTable,
    StudentDetailPanel,
    StudentCourseTable,
    BookListTable
  },
  data() {
    return {};
  }
};
</script>
