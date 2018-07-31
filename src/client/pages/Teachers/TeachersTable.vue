<template>

  <div>
    <md-table v-model="searched" md-sort="createTime" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newTeacher">
                <span>{{ $t("message.teacher") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.name_search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_teacher_found_message')"
        :md-description="$t('message.no_teacher_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.teacher_id')" md-sort-by="ID">{{ item.ID }}</md-table-cell>
        <md-table-cell :md-label="$t('message.name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.gender')" md-sort-by="gender">{{ formatGender(item.gender) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.time_zone')" md-sort-by="timezone">{{ item.timezone }}</md-table-cell>
        <md-table-cell :md-label="$t('message.email')">{{ item.email }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewTeacher(item.ID)">{{ $t("message.view") }}</a>
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
      teachers: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatGender(gender) {
      return gender == "M"
        ? this.$i18n.t("message.male")
        : this.$i18n.t("message.female");
    },
    searchOnTable() {
      this.searched = this.teachers.filter(item =>
        toLower(item.name).includes(toLower(this.search))
      );
    },
    newTeacher() {
      this.$router.push({ path: "/teachers/new" });
    },
    viewTeacher(id) {
      this.$router.push({ path: "/teachers/" + id });
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body.sort((a, b) => b.createTime - a.createTime);
          this.searched = this.teachers;
          this.preloading = false;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取老师数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
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