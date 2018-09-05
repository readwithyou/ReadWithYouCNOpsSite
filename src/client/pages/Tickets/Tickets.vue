<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t("message.tickets_card_title") }}</div>
            <div class="md-subhead">{{ $t("message.tickets_card_subtitle") }}</div>
          </md-card-header>
          <md-card-content>
            <can I="read" a="ticket">
              <tickets-table table-header-color="purple"></tickets-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { TicketsTable } from "pages";

export default {
  components: {
    Can,
    TicketsTable
  },
  data() {
    return {};
  }
};
</script>
