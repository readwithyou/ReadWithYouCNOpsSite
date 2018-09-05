<template>
  <div>
    <md-table v-model="paged" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <can I="create" a="ticket">
            <md-menu>
              <md-button class="md-icon-button md-primary" md-menu-trigger>
                <md-icon>add</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="newTicket">
                  <span>{{ $t("message.tickets") }}</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </can>
        </div>  

        <md-field md-clearable class="md-toolbar-section-start">
          <label for="filters">{{ $t('message.filter_hint') }}</label>
          <md-select v-model="filters" name="filters" id="filters" md-dense multiple @input="searchOnTable">
            <md-option value="CLOSED">CLOSED Tickets</md-option>
            <md-option value="PB_SYSTEM_BUG">{{ $t("message.ticket_type_pb_system_bug") }}</md-option>
            <md-option value="OPS_SYSTEM_BUG">{{ $t("message.ticket_type_ops_system_bug") }}</md-option>
            <md-option value="DAILY_OPS">{{ $t("message.ticket_type_ops") }}</md-option>
          </md-select>
        </md-field>
        &nbsp;
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

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
        <md-table-cell :md-label="$t('message.assign_to')" md-sort-by="assignTo">{{ item.assignTo }}</md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">
           {{ item.status }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.update_time')" md-sort-by="modifyTime">
          {{ item.modifyTime?new Date(item.modifyTime).toLocaleString():'' }}
        </md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
import { Can } from "@casl/vue";
import { MdTablePagination } from "components";
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  components: {
    Can,
    MdTablePagination
  },
  data() {
    return {
      preloading: true,
      page: 1,
      size: 10,
      currentSort: "modifyTime",
      currentSortOrder: "asc",
      filters: ["PB_SYSTEM_BUG", "OPS_SYSTEM_BUG", "DAILY_OPS"],
      search: null,
      tickets: [],
      searched: [],
      paged: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    rePagination() {
      this.page = 1;
      this.pagination();
    },
    onUpdatePagination(evt) {
      this.page = evt.page;
      this.size = evt.size;
      this.pagination();
    },
    pagination() {
      this.paged = this.searched.slice(
        (this.page - 1) * this.size,
        this.page * this.size
      );
    },
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
    searchOnTable() {
      this.searched = this.tickets.filter(
        item =>
          (toLower(item.title).includes(toLower(this.search)) ||
            toLower(item.ID).includes(toLower(this.search)) ||
            toLower(item.assignTo).includes(toLower(this.search))) &&
          this.filters.includes(item.type) &&
          (this.filters.includes("CLOSED") ||
            (!this.filters.includes("CLOSED") && item.status !== "CLOSED"))
      );
      this.rePagination();
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
          this.tickets = response.body.sort(
            (a, b) => b.modifyTime - a.modifyTime
          );
          this.searched = this.tickets.filter(t => t.status != "CLOSED");
          this.pagination();
          this.preloading = false;
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
    },
    customSort(value) {
      this.searched.sort((a, b) => {
        const sortBy = this.currentSort;
        var leftValue = a[sortBy] ? a[sortBy].toString() : "";
        var rightValue = b[sortBy] ? b[sortBy].toString() : "";

        if (this.currentSortOrder === "desc") {
          return leftValue.localeCompare(rightValue);
        }

        return rightValue.localeCompare(leftValue);
      });
      this.rePagination();
      return this.paged;
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