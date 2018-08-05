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
              <md-menu-item @click="newStudent">
                <span>{{ $t("message.student") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.name_search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_student_found_message')"
        :md-description="$t('message.no_student_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.student_id')" md-sort-by="ID">{{ item.ID }}</md-table-cell>
        <md-table-cell :md-label="$t('message.en_name')" md-sort-by="enName">{{ item.enName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.cn_name')" md-sort-by="cnName">{{ item.cnName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.gender')" md-sort-by="gender">{{ formatGender(item.gender) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_type')" md-sort-by="type">{{ formatType(item.type) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewStudent(item.ID)">{{ $t("message.view") }}</a>
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
      students: []
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
    formatType(type) {
      return type == "adult"
        ? this.$i18n.t("message.adult")
        : this.$i18n.t("message.child");
    },
    searchOnTable() {
      this.searched = this.students.filter(
        item =>
          toLower(item.cnName).includes(toLower(this.search)) ||
          toLower(item.enName).includes(toLower(this.search))
      );
    },
    newStudent() {
      this.$router.push({ path: "/students/new" });
    },
    viewStudent(id) {
      this.$router.push({ path: "/students/" + id });
    },
    fetchData() {
      var resource = this.$resource("/api/students");
      resource.get().then(
        response => {
          this.students = response.body.sort((a, b) => b.createTime - a.createTime);
          this.searched = this.students;
          this.preloading = false;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取学员数据失败！",
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