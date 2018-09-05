<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t("message.students_card_title") }}</div>
            <div class="md-subhead">{{ $t("message.students_card_subtitle") }}</div>
          </md-card-header>
          <md-card-content>
            <can I="read" a="studentList">
              <students-table table-header-color="purple"></students-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from "@casl/vue";
import { StudentsTable } from "pages";

export default {
  components: {
    Can,
    StudentsTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>