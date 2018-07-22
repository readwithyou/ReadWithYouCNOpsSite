<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-ballot" :md-label="$t('message.basic_info')" md-icon="ballot">
                <student-detail-panel></student-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" :md-label="$t('message.course_plan')" md-icon="calendar_today">
                under construction... please be patient...:)
              </md-tab>

              <md-tab id="tab-other" :md-label="$t('message.book_list')" md-icon="collections_bookmark">
                <book-list-table></book-list-table>
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { StudentDetailPanel, BookListTable } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    StudentDetailPanel,
    BookListTable
  },
  data() {
    return {};
  }
};
</script>
