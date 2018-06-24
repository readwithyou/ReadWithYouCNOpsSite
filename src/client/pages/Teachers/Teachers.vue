<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="purple">
            <h4 class="title">老师管理表格</h4>
            <p class="category">此表格罗列所有老师信息</p>
          </md-card-header>
          <md-card-content>
            <teachers-table table-header-color="purple"></teachers-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { TeachersTable } from "pages";

export default {
  components: {
    TeachersTable
  }
};
</script>
<style>
.md-list-item-button > .md-ripple > span {
  position: relative;
}
</style>