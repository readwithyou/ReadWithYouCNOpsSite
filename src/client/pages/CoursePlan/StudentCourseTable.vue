<template>
  <div>
    <md-table v-model="searched" md-sort="createTime" md-sort-order="desc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <can I="create" a="studentCoursePlan">
            <md-menu>
              <md-button class="md-icon-button md-primary md-raised" md-menu-trigger>
                <md-icon>add</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="newCoursePlan()">
                  <span>{{ $t("message.course_plan") }}</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </can>
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
        <md-table-cell :md-label="$t('message.teacher')" md-sort-by="teacherId">{{ formatTeacher(item.teacherId) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_by')" md-sort-by="createBy">{{ item.createBy }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
        </md-table-cell>
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
import { Can } from "@casl/vue";
import miscUtility from "../../utils/miscUtility.js";

const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  components: {
    Can
  },
  data() {
    return {
      search: null,
      searched: [],
      coursePlans: [],
      teachers: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.coursePlans.filter(item =>
        toLower(this.formatName(item.courseName)).includes(toLower(this.search))
      );
    },
    newCoursePlan() {
      this.$router.push({
        path: "/students/" + this.$route.params.id + "/course-plans/new"
      });
    },
    fetchCoursePlans() {
      Vue.http
        .post("/api/course-plans/query", {
          studentId: this.$route.params.id
        })
        .then(response => {
          this.coursePlans = response.body.sort(
            (a, b) => b.createTime - a.createTime
          );
          this.searched = this.coursePlans;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body;
          this.fetchCoursePlans();
        },
        response => {
          this.notifyFetchingError();
        }
      );
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
    formatTeacher(teacherId) {
      for (var i = 0; i < this.teachers.length; i++) {
        if (this.teachers[i].ID === teacherId) {
          return [this.teachers[i].name, this.teachers[i].surname].join(" ");
        }
      }
      return teacherId;
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