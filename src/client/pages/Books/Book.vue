<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-ballot" :md-label="$t('message.basic_info')" md-icon="book">
                <book-detail-panel></book-detail-panel>
              </md-tab>

              <md-tab id="tab-calendar" :md-label="$t('message.inventory_info')" md-icon="ballot">
                <book-inventory-panel></book-inventory-panel>
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { BookDetailPanel, BookInventoryPanel } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    BookDetailPanel,
    BookInventoryPanel
  },
  data() {
    return {};
  }
};
</script>
