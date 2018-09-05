<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <md-tabs md-alignment="fixed">
              <md-tab id="tab-ballot" :md-label="$t('message.sign_in')" md-icon="ballot">
                <sign-in-panel></sign-in-panel>
              </md-tab>

              <md-tab id="tab-calendar" :md-label="$t('message.sign_on')" md-icon="person">
                <sign-on-panel></sign-on-panel>
              </md-tab>
            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
  </div>
</template>
<script>
import { NavTabsCard, NavTabsTable } from "components";
import { SignInPanel, SignOnPanel } from "pages";

export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    SignInPanel,
    SignOnPanel
  },
  data() {
    return {};
  }
};
</script>