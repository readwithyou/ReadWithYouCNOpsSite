<template>
  <div>
    <md-table v-model="searched" md-sort="ID" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_course_plan_found_message')"
        :md-description="$t('message.no_course_plan_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.course_name')" md-sort-by="courseName">{{ formatName(item.courseName) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.course_type')" md-sort-by="courseType">{{ formatType(item.courseType) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.student_name')" md-sort-by="studentName">{{ item.studentName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.remarks')">{{ item.remarks }}</md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">
           <md-chip :class="getStatusClass(item.status)">{{ formatStatus(item.status) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <md-button class="md-icon-button" @click="setCoursePlanStatus(item.ID, 1)" v-if="item.status === 0">
            <md-icon>work</md-icon>
            <md-tooltip md-direction="top">{{ $t("message.set_as_valid") }}</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="setCoursePlanStatus(item.ID, 0)" v-else>
            <md-icon>work_off</md-icon>
            <md-tooltip md-direction="top">{{ $t("message.set_as_invalid") }}</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Vue from "vue";
import miscUtility from "../../utils/miscUtility.js";

const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  data() {
    return {
      search: null,
      searched: [],
      coursePlans: [],
      teachers: []
    };
  },
  created() {
    this.fetchCoursePlans();
  },
  methods: {
    searchOnTable() {
      this.searched = this.coursePlans.filter(
        item =>
          toLower(this.formatName(item.courseName)).includes(
            toLower(this.search)
          ) || toLower(item.studentName).includes(toLower(this.search))
      );
    },
    fetchCoursePlans() {
      Vue.http
        .post("/api/course-plans/query", {
          teacherId: this.$route.params.id
        })
        .then(response => {
          this.coursePlans = response.body;
          this.searched = this.coursePlans;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    setCoursePlanStatus(id, status) {
      Vue.http
        .post("/api/course-plans/" + id + "/status", { status: status })
        .then(response => {
          this.fetchCoursePlans();
          this.notifyInvalidCoursePlanSuccess();
        })
        .catch(err => this.notifyInvalidCoursePlanError());
    },
    formatName(courseName) {
      return this.$i18n.t(miscUtility.getNameTranslation(courseName));
    },
    formatType(courseType) {
      return this.$i18n.t(miscUtility.getTypeTranslation(courseType));
    },
    formatStatus(status) {
      switch (status) {
        case 0:
          return this.$i18n.t("message.invalid_status");
        default:
          return this.$i18n.t("message.valid_status");
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 0:
          return "md-default";
        default:
          return "md-primary";
      }
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to fetch course plan lists!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyInvalidCoursePlanSuccess() {
      this.$notify({
        message: "Change course plan successfully!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    notifyInvalidCoursePlanError() {
      this.$notify({
        message: "Failed to change course plan!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>