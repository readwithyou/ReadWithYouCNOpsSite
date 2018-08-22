<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="deleteDialogActive"
      :md-title="$t('message.confirm')"
      :md-content="$t('message.book_list_delete_confirmation_message')"
      :md-confirm-text="$t('message.confirm')"
      :md-cancel-text="$t('message.cancel')"
      @md-cancel="onCancelDelete"
      @md-confirm="onConfirmDelete" />
    <md-table v-model="searched" md-sort="ID" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
              <md-icon>add</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newCourseBookList()">
                <span>{{ $t("message.new_course_book_list") }}</span>
              </md-menu-item>
              <md-menu-item @click="newShortCourseBookList()">
                <span>{{ $t("message.new_short_course_book_list") }}</span>
              </md-menu-item>
              <md-menu-item @click="newGiftBookList()">
                <span>{{ $t("message.new_gift_book_list") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_book_list_found_message')"
        :md-description="$t('message.no_book_list_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.book_list_name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.language')" md-sort-by="language">{{  $t("message."+item.language+"_lang") }}</md-table-cell>
        <md-table-cell :md-label="$t('message.read_level')" md-sort-by="readLevel">{{ formatLevel(item.readLevel) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.purpose')" md-sort-by="purpose">{{ formatPurpose(item.purpose) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_by')" md-sort-by="createBy">{{ item.createBy }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.status')" md-sort-by="status">
           <md-chip :class="getStatusClass(item.status)">{{ formatStatus(item.status) }}</md-chip>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewBookList(item.ID)">{{ $t("message.view") }}</a>&nbsp;&nbsp;
          <a @click="deleteBookList(item.ID)" v-if="item.status==='PENDING_FOR_APPROVAL' || item.status==='REJECTED'">{{ $t("message.delete") }}</a>
        </md-table-cell>
      </md-table-row>
    </md-table>
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
      search: null,
      searched: [],
      bookLists: [],
      deleteDialogActive: false,
      idToDelete: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.bookLists.filter(item =>
        toLower(item.name).includes(toLower(this.search))
      );
    },
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
          return this.$i18n.t("message.pending_status");
        case "PENDING_FOR_DELIVERY":
          return this.$i18n.t("message.approved_status");
        case "REJECTED":
          return this.$i18n.t("message.rejected_status");
        case "DELIVERED":
          return this.$i18n.t("message.delivered_status");
        case "FINISHED":
          return this.$i18n.t("message.finished_status");
        default:
          return this.$i18n.t("message.unknown_status");
      }
    },
    getStatusClass(status) {
      switch (status) {
        case "REJECTED":
          return "md-accent";
        default:
          return "md-default";
      }
    },
    newShortCourseBookList() {
      this.$router.push({
        path:
          "/students/" +
          this.$route.params.id +
          "/booklists/new?purpose=SHORT_COURSE"
      });
    },
    newCourseBookList() {
      this.$router.push({
        path:
          "/students/" + this.$route.params.id + "/booklists/new?purpose=COURSE"
      });
    },
    newGiftBookList() {
      this.$router.push({
        path:
          "/students/" + this.$route.params.id + "/booklists/new?purpose=GIFT"
      });
    },
    viewBookList(bookListId) {
      this.$router.push({
        path: "/students/" + this.$route.params.id + "/booklists/" + bookListId
      });
    },
    deleteBookList(bookListId) {
      this.idToDelete = bookListId;
      this.deleteDialogActive = true;
    },
    onConfirmDelete() {
      var resource = this.$resource("/api/booklists/" + this.idToDelete);
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
    fetchData() {
      Vue.http
        .post("/api/booklists/query", {
          studentId: this.$route.params.id
        })
        .then(response => {
          this.bookLists = response.body;
          this.searched = this.bookLists;
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
    },
    notifyRemoveError() {
      this.$notify({
        message: "Failed to delete book list, please try again later.",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyRemoveSuccess() {
      this.$notify({
        message: "Delete book list successfully!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    }
  }
};
</script>