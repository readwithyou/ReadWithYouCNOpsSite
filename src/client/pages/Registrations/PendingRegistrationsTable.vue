<template>
  <div>
    <md-table v-model="registrations" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-empty-state
        :md-label="$t('message.no_registration_found_message')"
        :md-description="$t('message.no_registration_found_message_detal')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.student_id')" md-sort-by="ID">
          <a @click="viewRegistration(item.ID)">{{ item.ID }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.en_name')" md-sort-by="enName">{{ item.enName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_type')" md-sort-by="type">{{ item.type === "adult" ? "成人" : "少儿" }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_source')" md-sort-by="tag">{{ item.tag }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">
           <md-chip :class="getStatusClass(item.status)">{{ formatStatus(item.status) }}</md-chip>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-primary" v-if="preloading"></md-progress-spinner>
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
      preloading: true,
      currentSort: "createTime",
      currentSortOrder: "asc",
      search: null,
      registrations: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatStatus(status) {
      switch (status) {
        case 0:
          return this.$i18n.t("message.pending_status");
        case 1:
          return this.$i18n.t("message.scheduled_status");
        case 2:
          return this.$i18n.t("message.finished_status");
        default:
          return this.$i18n.t("message.unknown_status");
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "md-accent";
        case 1:
          return "md-default";
        case 2:
          return "md-default";
        default:
          return "md-accent";
      }
    },
    fetchData() {
      this.fetchRegistrations();
    },
    fetchRegistrations() {
      Vue.http
        .get("/api/registrations/pending")
        .then(response => {
          this.registrations = response.body.sort(
            (a, b) =>
              new Date(b.createTime).getTime() -
              new Date(a.createTime).getTime()
          );

          this.preloading = false;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取试课报名数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    viewRegistration(registrationId) {
      this.$router.push({ path: "/registrations/" + registrationId });
    },
    customSort(value) {
      this.registrations.sort((a, b) => {
        const sortBy = this.currentSort;

        var leftValue = a[sortBy] ? a[sortBy].toString() : "";
        var rightValue = b[sortBy] ? b[sortBy].toString() : "";

        if (this.currentSortOrder === "desc") {
          return leftValue.localeCompare(rightValue);
        }

        return rightValue.localeCompare(leftValue);
      });

      return this.registrations;
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