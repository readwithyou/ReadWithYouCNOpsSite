<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-tabs md-alignment="fixed">

          <md-tab id="tab-leave" :md-label="$t('message.leave_management')">
            <leave-form></leave-form>
          </md-tab>

          <md-tab id="tab-timezone" :md-label="$t('message.time_zone')">
            <time-zone-panel></time-zone-panel>
          </md-tab>

        </md-tabs>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { LeaveForm, TimeZonePanel } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    LeaveForm,
    TimeZonePanel
  },
  data() {
    return {};
  }
};
</script>
