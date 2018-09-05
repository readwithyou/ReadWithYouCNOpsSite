<template>
  <div class="content">
    <can I="read" a="myCoursePlan">
      <div class="md-layout">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
          <md-card>
            <md-card-header>
                <div class="md-title">{{ $t("message.my_course_plans_card_title") }}</div>
                <div class="md-subhead">{{ $t("message.my_course_plans_card_subtitle") }}</div>
            </md-card-header>
            <md-card-content>
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
                      <md-table-cell :md-label="$t('message.student_name')" md-sort-by="studentName">{{ item.studentName }}</md-table-cell>
                      <md-table-cell :md-label="$t('message.course_name')" md-sort-by="courseName">{{ formatName(item.courseName) }}</md-table-cell>
                      <md-table-cell :md-label="$t('message.course_type')" md-sort-by="courseType">{{ formatType(item.courseType) }}</md-table-cell>
                      <md-table-cell :md-label="$t('message.action')">
                        <md-button class="md-icon-button md-dense md-default" @click="openZoomLink(item.studentId)">
                            <md-icon>launch</md-icon>
                            <md-tooltip>{{ $t("message.open_zoom_link") }}</md-tooltip>
                        </md-button>
                        <md-button class="md-icon-button md-dense md-default" @click="openBookList(item.studentId)">
                            <md-icon>book</md-icon>
                            <md-tooltip>{{ $t("message.open_book_list") }}</md-tooltip>
                        </md-button>
                      </md-table-cell>
                  </md-table-row>
                  </md-table>
              </div>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </can>
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
      coursePlans: []
    };
  },
  created() {
    this.fetchCoursePlans();
  },
  methods: {
    searchOnTable() {
      this.searched = this.coursePlans.filter(
        item =>
          toLower(this.formatName(item.courseName)).includes(toLower(this.search)) ||
          toLower(item.studentName).includes(toLower(this.search))
      );
    },
    newCoursePlan() {
      this.$router.push({
        path: "/students/" + this.$route.params.id + "/course-plans/new"
      });
    },
    fetchCoursePlans() {
      Vue.http
        .post("/api/course-plans/mine")
        .then(response => {
          this.coursePlans = response.body;
          this.searched = this.coursePlans;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    formatName(courseName) {
      return this.$i18n.t(miscUtility.getNameTranslation(courseName));
    },
    formatType(courseType) {
      return this.$i18n.t(miscUtility.getTypeTranslation(courseType));
    },
    openZoomLink(id) {
      var resource = this.$resource("/api/students/" + id);
      resource.get().then(
        response => {
          let url = response.body.zoomId;
          window.open(url, "_blank");
        },
        response => {
          this.notifyFetchingZoomIdError();
        }
      );
    },
    openBookList(id) {
      this.$router.push({ path: "/students/" + id });
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
    notifyFetchingZoomIdError() {
      this.$notify({
        message: "Failed to fetch zoom link. Please try again later!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>