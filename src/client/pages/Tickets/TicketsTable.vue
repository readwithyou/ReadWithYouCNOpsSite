<template>
  <div>
    <md-table v-model="searched" md-sort="createTime" md-sort-order="desc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newTicket">
                <span>{{ $t("message.tickets") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_ticket_found_message')"
        :md-description="$t('message.no_ticket_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.ticket_id')" md-sort-by="ID">{{ item.ID }}</md-table-cell>
        <md-table-cell :md-label="$t('message.title')" md-sort-by="title">{{ item.title }}</md-table-cell>
        <md-table-cell :md-label="$t('message.ticket_type')" md-sort-by="type">{{ formatType(item.type) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" md-sort-by="priority">{{ formatPriority(item.priority) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.assign_to')" md-sort-by="assignTo">{{ item.assignTo }}</md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">{{ item.status }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewTicket(item.ID)">{{ $t("message.view") }}</a>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  data() {
    return {
      search: null,
      searched: [],
      tickets: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatType(type) {
      switch (type) {
        case "PB_SYSTEM_BUG":
          return this.$i18n.t("message.ticket_type_pb_system_bug");
        case "OPS_SYSTEM_BUG":
          return this.$i18n.t("message.ticket_type_ops_system_bug");
        case "DAILY_OPS":
          return this.$i18n.t("message.ticket_type_ops");
        default:
          return this.$i18n.t("message.unknown_ticket_type");
      }
    },
    formatPriority(priority) {
      return this.$i18n.t("message.ticket_priority_" + priority);
    },
    formatStatus(status) {
      return "unknown status";
    },
    searchOnTable() {
      this.searched = this.tickets.filter(
        item =>
          toLower(item.title).includes(toLower(this.search)) ||
          toLower(item.ID).includes(toLower(this.search))
      );
    },
    newTicket() {
      this.$router.push({ path: "/tickets/new" });
    },
    viewTicket(id) {
      this.$router.push({ path: "/tickets/" + id });
    },
    fetchData() {
      var resource = this.$resource("/api/tickets");
      resource.get().then(
        response => {
          this.tickets = response.body;
          this.searched = this.tickets;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message:
          "Failed to fetch tickets data from server side, please try again later.",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>