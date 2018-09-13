<template>

  <div>
    <md-table v-model="paged" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <can I="create" a="student">
            <md-menu>
              <md-button class="md-icon-button md-primary md-raised" md-menu-trigger>
                <md-icon>add</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="newStudent">
                  <span>{{ $t("message.student") }}</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </can>
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
        <md-table-cell :md-label="$t('message.student_id')" md-sort-by="ID">
          <a @click="viewStudent(item.ID)">{{ item.ID }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.en_name')" md-sort-by="enName">{{ item.enName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.cn_name')" md-sort-by="cnName">{{ item.cnName }}</md-table-cell>
        <md-table-cell :md-label="$t('message.gender')" md-sort-by="gender">{{ formatGender(item.gender) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_type')" md-sort-by="type">{{ formatType(item.type) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.registration_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <md-menu>
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon>book</md-icon>
              <md-tooltip>{{ $t("message.new_book_list") }}</md-tooltip>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newBookList(item.ID,'COURSE')" v-if="$can('create', 'courseBookList')">
                <span>{{ $t("message.new_course_book_list") }}</span>
              </md-menu-item>
              <md-menu-item @click="newBookList(item.ID,'SHORT_COURSE')" v-if="$can('create', 'shortCourseBookList')">
                <span>{{ $t("message.new_short_course_book_list") }}</span>
              </md-menu-item>
              <md-menu-item @click="newBookList(item.ID,'GIFT')" v-if="$can('create', 'giftBookList')">
                <span>{{ $t("message.new_gift_book_list") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-primary" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
import { Can } from "@casl/vue";
import { MdTablePagination } from "components";
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  components: {
    Can,
    MdTablePagination
  },
  data() {
    return {
      preloading: true,
      page: 1,
      size: 10,
      currentSort: "enName",
      currentSortOrder: "asc",
      search: null,
      searched: [],
      students: [],
      paged: []
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
      this.rePagination();
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
          this.students = response.body.sort(
            (a, b) => b.createTime - a.createTime
          );
          this.searched = this.students;
          this.pagination();
          this.preloading = false;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    newBookList(id, purpose) {
      this.$router.push({
        path: "/students/" + id + "/booklists/new?purpose=" + purpose
      });
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取学员数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
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