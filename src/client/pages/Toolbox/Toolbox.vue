<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-sync-route class="md-primary" md-alignment="fixed">

              <md-tab id="tab-leave" :md-label="$t('message.leave_management')" md-icon="insert_invitation">
                <leave-form></leave-form>
              </md-tab>

              <md-tab id="tab-timezone" :md-label="$t('message.time_zone')" md-icon="av_timer">
                <time-zone-panel></time-zone-panel>
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
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
