<template>
  <div>
    <md-table v-model="searched" md-sort="createTime" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-primary" md-menu-trigger>
              <md-icon>refresh</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="refresh">
                <span>{{ $t("message.refresh") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_inventory_found_message')"
        :md-description="$t('message.no_inventory_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.time')" md-sort-by="EventTime">
          {{ item.EventTime?new Date(item.EventTime).toLocaleString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.type')" md-sort-by="type">
          <md-chip :class="getTypeClass(item.type)">{{ formatType(item.type) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.quantity')" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>
        <md-table-cell :md-label="$t('message.actor')" md-sort-by="actor">{{ item.actor }}</md-table-cell>
        <md-table-cell :md-label="$t('message.description')" md-sort-by="description" v-html="formatDescription(item.description)"></md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Vue from "vue";

const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  data() {
    return {
      search: null,
      searched: [],
      records: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.records.filter(item =>
        toLower(item.description).includes(toLower(this.search))
      );
    },
    formatDescription(description) {
      try {
        let desObj = JSON.parse(description);

        if (typeof desObj === "object") {
          return this.$i18n.t("message.outbound_description", desObj);
        }
      } catch (e) {}

      return description;
    },
    formatType(inventoryType) {
      if (inventoryType === "inbound") {
        return this.$i18n.t("message.inbound");
      }
      if (inventoryType === "outbound") {
        return this.$i18n.t("message.outbound");
      }
    },
    getTypeClass(type) {
      switch (type) {
        case "inbound":
          return "md-primary";
        case "outbound":
          return "md-accent";
        default:
          return "md-accent";
      }
    },
    refresh(command) {
      this.fetchData();
    },
    fetchData() {
      Vue.http
        .post("/api/inventory/query", {
          bookId: this.$route.params.id,
          after: 0,
          before: new Date().getTime()
        })
        .then(response => {
          this.records = response.body;
          this.searched = this.records;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>