<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">试课报名表格</h4>
            <p class="category">此表格罗列所有已处理和未处理的试课报名</p>
          </md-card-header>
          <md-card-content>
            <trail-reg-table table-header-color="green"></trail-reg-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { TrailRegTable } from "components";

export default {
  components: {
    TrailRegTable
  }
};
</script>
