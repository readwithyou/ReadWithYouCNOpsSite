<template>

  <div>
    <md-dialog-confirm
      :md-active.sync="dialogStatus.showLockDialog"
      :md-title="$t('message.confirm_lock_user_title')"
      :md-content="$t('message.confirm_lock_user_content')"
      :md-confirm-text="$t('message.confirm')"
      :md-cancel-text="$t('message.cancel')"
      @md-confirm="lockUser(activeItem.username)" />
      
    <md-dialog-confirm
      :md-active.sync="dialogStatus.showUnlockDialog"
      :md-title="$t('message.confirm_unlock_user_title')"
      :md-content="$t('message.confirm_unlock_user_content')"
      :md-confirm-text="$t('message.confirm')"
      :md-cancel-text="$t('message.cancel')"
      @md-confirm="unlockUser(activeItem.username)" />
      
    <md-dialog-confirm
      :md-active.sync="dialogStatus.showResetDialog"
      :md-title="$t('message.confirm_reset_user_title')"
      :md-content="$t('message.confirm_reset_user_content')"
      :md-confirm-text="$t('message.confirm')"
      :md-cancel-text="$t('message.cancel')"
      @md-confirm="reset(activeItem.username)" />

    <md-table v-model="paged" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_user_found_message')"
        :md-description="$t('message.no_user_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.username')" md-sort-by="username">{{ item.username }}</md-table-cell>
        <md-table-cell :md-label="$t('message.name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.email')" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell :md-label="$t('message.user_group')" md-sort-by="group">{{ item.group }}</md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="locked">
          <md-chip :class="getStatusClass(item.locked)">{{ formatStatus(item.locked) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')" v-if="$can('edit', 'user')">
          <a @click="activeItem=item;dialogStatus.showLockDialog=true;" v-if="!item.locked">{{ $t("message.lock") }}</a>
          <a @click="activeItem=item;dialogStatus.showUnlockDialog=true;" v-if="item.locked">{{ $t("message.unlock") }}</a>&nbsp;&nbsp;
          <a @click="activeItem=item;dialogStatus.showResetDialog=true;">{{ $t("message.reset_password") }}</a>
        </md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
import { MdTablePagination } from "components";
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  components: {
    MdTablePagination
  },
  data() {
    return {
      preloading: true,
      page: 1,
      size: 10,
      currentSort: "username",
      currentSortOrder: "asc",
      search: null,
      users: [],
      searched: [],
      paged: [],
      dialogStatus: {
        showResetDialog: false,
        showLockDialog: false,
        showUnlockDialog: false
      }
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
    searchOnTable() {
      this.searched = this.users.filter(
        item =>
          toLower(item.username).includes(toLower(this.search)) ||
          toLower(item.name).includes(toLower(this.search))
      );
      this.rePagination();
    },
    formatStatus(locked) {
      return locked
        ? this.$i18n.t("message.locked")
        : this.$i18n.t("message.unlocked");
    },
    getStatusClass(locked) {
      return locked ? "md-accent" : "md-default";
    },
    fetchData() {
      var resource = this.$resource("/api/users");
      resource.get().then(
        response => {
          this.users = response.body;
          this.searched = this.users;
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
        message: "服务器端获取用户数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    lockUser(username) {
      var resource = this.$resource("/api/users/" + username + "/lock");
      resource.save().then(
        response => {
          this.notifyLockSuccess();
          this.fetchData();
        },
        response => {
          this.notifyLockError();
        }
      );
    },
    unlockUser(username) {
      var resource = this.$resource("/api/users/" + username + "/unlock");
      resource.save().then(
        response => {
          this.notifyLockSuccess();
          this.fetchData();
        },
        response => {
          this.notifyLockError();
        }
      );
    },
    reset(username) {
      var resource = this.$resource("/api/users/" + username + "/reset");
      resource.save().then(
        response => {
          this.notifyResetSuccess();
        },
        response => {
          this.notifyResetError();
        }
      );
    },
    notifyLockError() {
      this.$notify({
        message: "锁定账户失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyLockSuccess() {
      this.$notify({
        message: "锁定账户成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    notifyResetError() {
      this.$notify({
        message: "重置密码失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyResetSuccess() {
      this.$notify({
        message: "重置密码成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
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