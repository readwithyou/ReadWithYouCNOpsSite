<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ $t("message.books_card_title") }}</div>
            <div class="md-subhead">{{ $t("message.books_card_subtitle") }}</div>
          </md-card-header>
          <md-card-content>
            <can I="read" a="book">
              <books-table table-header-color="purple"></books-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from '@casl/vue'
import { BooksTable } from "pages";

export default {
  components: {
    Can,
    BooksTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>