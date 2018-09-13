<template>
  <div>
    <md-table v-model="bookLists" md-sort="createTime" md-sort-order="desc">
      <md-table-empty-state
        :md-label="$t('message.no_book_list_found_message')"
        :md-description="$t('message.no_book_list_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.book_list_name')" md-sort-by="name">
          <a @click="viewBookList(item.studentName, item.ID)">{{ item.name }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.language')" md-sort-by="language">{{  $t("message."+item.language+"_lang") }}</md-table-cell>
        <md-table-cell :md-label="$t('message.student')" md-sort-by="studentName">
          <a @click="viewStudent(item.studentId)">{{ item.studentName }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.purpose')" md-sort-by="purpose">{{ formatPurpose(item.purpose) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_by')" md-sort-by="createBy">{{ item.createBy }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
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
  props: {
    filter: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      preloading: true,
      bookLists: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatLevel(level) {
      if (level) {
        return this.$i18n.t("message.level_" + level);
      }
      return "";
    },
    formatPurpose(purpose) {
      switch (purpose) {
        case "COURSE":
          return this.$i18n.t("message.course_book");
        case "GIFT":
          return this.$i18n.t("message.gift_book");
        default:
          return this.$i18n.t("message.unknown_status");
      }
    },
    formatStatus(status) {
      switch (status) {
        case "PENDING_FOR_APPROVAL":
          return this.$i18n.t("message.pending_approval_status");
        case "PENDING_FOR_DELIVERY":
          return this.$i18n.t("message.pending_for_delivery_status");
        case "REJECTED":
          return this.$i18n.t("message.rejected_status");
        default:
          return this.$i18n.t("message.unknown_status");
      }
    },
    getStatusClass(status) {
      switch (status) {
        case "REJECTED":
        case "PENDING_FOR_APPROVAL":
          return "md-accent";
        case "PENDING_FOR_DELIVERY":
          return "md-primary";
        case "DELIVERED":
        case "FINISHED":
          return "md-default";
        default:
          return "md-accent";
      }
    },
    viewBookList(studentId, bookListId) {
      this.$router.push({
        path: "/students/" + studentId + "/booklists/" + bookListId
      });
    },
    viewStudent(studentId) {
      this.$router.push({
        path: "/students/" + studentId
      });
    },
    fetchData() {
      let url = "/api/booklists/pending";
      if (this.filter === "mine") {
        url = "/api/booklists/pending/mine";
      }

      Vue.http
        .get(url)
        .then(response => {
          this.bookLists = response.body.sort(
            (a, b) => b.createTime - a.createTime
          );
          this.preloading = false;
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to fetch book lists!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>