<template>

  <div>
    <md-table v-model="searched" md-sort="username" md-sort-order="asc">
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
        <md-table-cell :md-label="$t('message.action')">
          <a @click="lockUser(item.username)" v-if="!item.locked">{{ $t("message.lock") }}</a>&nbsp;&nbsp;
          <a @click="unlockUser(item.username)" v-if="item.locked">{{ $t("message.unlock") }}</a>
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
      users: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.users.filter(
        item =>
          toLower(item.username).includes(toLower(this.search)) ||
          toLower(item.name).includes(toLower(this.search))
      );
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
    }
  }
};
</script>