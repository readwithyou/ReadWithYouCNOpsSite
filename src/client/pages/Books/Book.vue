<template>
  <div class="content">
    <can I="read" a="book">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
          <md-tabs md-alignment="fixed">

            <md-tab id="tab-ballot" :md-label="$t('message.basic_info')">
              <book-detail-panel></book-detail-panel>
            </md-tab>

            <md-tab id="tab-calendar" :md-label="$t('message.inventory_info')">
              <book-inventory-panel></book-inventory-panel>
            </md-tab>

          </md-tabs>
      </div>
    </can>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { NavTabsCard, NavTabsTable } from "components";
import { BookDetailPanel, BookInventoryPanel } from "pages";

export default {
  components: {
    Can,
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
