<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <h4 class="title">{{ $t("message.users_card_title") }}</h4>
            <p class="category">{{ $t("message.users_card_subtitle") }}</p>
          </md-card-header>
          <md-card-content>
            <can I="read" a="user">
              <users-table table-header-color="purple"></users-table>
            </can>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from '@casl/vue'
import { UsersTable } from "pages";

export default {
  components: {
    Can,
    UsersTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>