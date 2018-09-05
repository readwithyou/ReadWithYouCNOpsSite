<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t("message.teachers_card_title") }}</div>
            <div class="md-subhead">{{ $t("message.teachers_card_subtitle") }}</div>
          </md-card-header>
          <md-card-content>
            <can I="read" a="teacher">
              <teachers-table table-header-color="purple"></teachers-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from '@casl/vue'
import { TeachersTable } from "pages";

export default {
  components: {
    Can,
    TeachersTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>