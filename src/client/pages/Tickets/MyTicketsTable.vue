<template>
  <div>
    <md-table v-model="tickets" md-sort="createTime" md-sort-order="desc">

      <md-table-empty-state
        :md-label="$t('message.no_ticket_found_message')"
        :md-description="$t('message.no_ticket_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.ticket_id')" md-sort-by="ID">
          <a @click="viewTicket(item.ID)">{{ item.ID }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.title')" md-sort-by="title">{{ item.title }}</md-table-cell>
        <md-table-cell :md-label="$t('message.ticket_type')" md-sort-by="type">{{ formatType(item.type) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" :class="getPriorityClass(item.priority)" md-sort-by="priority">
          <md-chip :class="getPriorityClass(item.priority)">{{ formatPriority(item.priority) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-primary" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  data() {
    return {
      preloading: true,
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
    getPriorityClass(priority) {
      switch (priority) {
        case "1":
          return "md-accent";
        case "2":
          return "md-primary";
        case "3":
          return "md-default";
        default:
          return "md-accent";
      }
    },
    fetchData() {
      var resource = this.$resource("/api/tickets/mine");
      resource.get().then(
        response => {
          this.tickets = response.body.sort(
            (a, b) => b.createTime - a.createTime
          );
          this.preloading = false;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    viewTicket(id) {
      this.$router.push({ path: "/tickets/" + id });
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
    },
    customSort(value) {
      this.tickets.sort((a, b) => {
        const sortBy = this.currentSort;
        var leftValue = a[sortBy] ? a[sortBy].toString() : "";
        var rightValue = b[sortBy] ? b[sortBy].toString() : "";

        if (this.currentSortOrder === "desc") {
          return leftValue.localeCompare(rightValue);
        }

        return rightValue.localeCompare(leftValue);
      });
      return this.tickets;
    }
  }
};
</script>
<style lang="scss" scoped>
.md-progress-spinner {
  position: absolute;
  left: 50%;
  top: 80px;
  margin-left: -50px;
  margin-top: 150px;
}
</style>