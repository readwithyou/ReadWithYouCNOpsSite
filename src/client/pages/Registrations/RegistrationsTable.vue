<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="deleteDialogActive"
      :md-title="$t('message.confirm')"
      :md-content="$t('message.registration_delete_confirmation_message')"
      :md-confirm-text="$t('message.confirm')"
      :md-cancel-text="$t('message.cancel')"
      @md-cancel="onCancelDelete"
      @md-confirm="onConfirmDelete" />

    <md-table v-model="searched" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newChildRegistration">
                <span>{{ $t("message.child_registration") }}</span>
              </md-menu-item>
              <md-menu-item @click="newAdultRegistration">
                <span>{{ $t("message.adult_registration") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.name_search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_registration_found_message')"
        :md-description="$t('message.no_registration_found_message_detal')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.student_id')" md-sort-by="ID">{{ item.ID }}</md-table-cell>
        <md-table-cell :md-label="$t('message.en_name')" md-sort-by="enName">{{ item.enName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.cn_name')" md-sort-by="cnName">{{ item.cnName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_type')" md-sort-by="type">{{ item.type === "adult" ? "成人" : "少儿" }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_source')" md-sort-by="tag">{{ item.tag }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">
           <md-chip :class="getStatusClass(item.status)">{{ formatStatus(item.status) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.scheduled_time')" md-sort-by="scheduledTime">
          {{ item.scheduledTime?new Date(item.scheduledTime).toLocaleString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.teacher')" md-sort-by="teacher">{{ item.teacher }}</md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewRegistration(item.ID)">{{ $t("message.view") }}</a>&nbsp;&nbsp;
          <a @click="deleteRegistration(item.ID)" v-if="item.status==0">{{ $t("message.delete") }}</a>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="preloading"></md-progress-spinner>
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
      search: null,
      searched: [],
      registrations: [],
      teachers: [],
      deleteDialogActive: false,
      entryToDelete: null,
      currentSort: "createTime",
      currentSortOrder: "asc"
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.registrations.filter(
        item =>
          toLower(item.cnName).includes(toLower(this.search)) ||
          toLower(item.enName).includes(toLower(this.search))
      );
    },
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
          return "md-primary";
        case 1:
          return "md-default";
        case 2:
          return "md-default";
        default:
          return "md-accent";
      }
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(response => {
        this.teachers = response.body;
        this.fetchRegistrations();
      });
    },
    fetchRegistrations() {
      var resource = this.$resource("/api/registrations");
      resource.get().then(
        response => {
          this.registrations = response.body.sort(
            (a, b) =>
              new Date(b.createTime).getTime() -
              new Date(a.createTime).getTime()
          );
          for (var i = 0; i < this.registrations.length; i++) {
            for (var j = 0; j < this.teachers.length; j++) {
              if (this.teachers[j].ID === this.registrations[i].teacherId) {
                this.registrations[i].teacher = this.teachers[j].name;
              }
            }
          }

          this.searched = this.registrations;
          this.preloading = false;
        },
        response => {
          this.notifyFetchingError();
        }
      );
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
    newAdultRegistration() {
      this.$router.push({ path: "/registrations/new?type=adult" });
    },
    newChildRegistration() {
      this.$router.push({ path: "/registrations/new?type=child" });
    },
    viewRegistration(registrationId) {
      this.$router.push({ path: "/registrations/" + registrationId });
    },
    deleteRegistration(registrationId) {
      this.idToDelete = registrationId;
      this.deleteDialogActive = true;
    },
    onConfirmDelete() {
      var resource = this.$resource("/api/registrations/" + this.idToDelete);
      resource.delete().then(
        response => {
          this.notifyRemoveSuccess();
          this.fetchData();
        },
        response => {
          this.notifyRemoveError();
        }
      );
    },
    onCancelDelete() {
      this.idToDelete = null;
    },
    notifyRemoveError() {
      this.$notify({
        message: "试课报名删除失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyRemoveSuccess() {
      this.$notify({
        message: "试课报名删除成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;

        var leftValue = a[sortBy] ? a[sortBy].toString() : "";
        var rightValue = b[sortBy] ? b[sortBy].toString() : "";

        if (this.currentSortOrder === "desc") {
          return leftValue.localeCompare(rightValue);
        }

        return rightValue.localeCompare(leftValue);
      });
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