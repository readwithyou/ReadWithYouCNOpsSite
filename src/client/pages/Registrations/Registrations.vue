<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <h4 class="title">{{ $t("message.registrations_card_title") }}</h4>
            <p class="category">{{ $t("message.registrations_card_subtitle") }}</p>
          </md-card-header>
          <md-card-content>
            <can I="read" a="registration">
              <registrations-table table-header-color="purple"></registrations-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from '@casl/vue'
import { RegistrationsTable } from "pages";

export default {
  components: {
    Can,
    RegistrationsTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>