<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <h4 class="title">{{ $t("message.tickets_card_title") }}</h4>
            <p class="category">{{ $t("message.tickets_card_subtitle") }}</p>
          </md-card-header>
          <md-card-content>
            <tickets-table></tickets-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import { TicketsTable } from "pages";

export default {
  components: {
    TicketsTable
  },
  data() {
    return {};
  }
};
</script>
