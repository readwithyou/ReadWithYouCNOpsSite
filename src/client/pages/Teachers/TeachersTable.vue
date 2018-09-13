<template>

  <div>
    <md-table v-model="paged" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <can I="create" a="teacher">
            <md-menu>
              <md-button class="md-icon-button md-primary md-raised" md-menu-trigger>
                <md-icon>add</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="newTeacher">
                  <span>{{ $t("message.teacher") }}</span>
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
        :md-label="$t('message.no_teacher_found_message')"
        :md-description="$t('message.no_teacher_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.teacher_id')" md-sort-by="ID">
          <a @click="viewTeacher(item.ID)">{{ item.ID }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.gender')" md-sort-by="gender">{{ formatGender(item.gender) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.time_zone')" md-sort-by="timezone">{{ formatTimezone(item.timezone) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.email')">{{ item.email }}</md-table-cell>
        <md-table-cell :md-label="$t('message.create_time')" md-sort-by="createTime">
          {{ item.createTime?new Date(item.createTime).toLocaleDateString():'' }}
        </md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-primary" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
import { Can } from '@casl/vue'
import { MdTablePagination } from "components";
import tzUtility from "../../utils/tzUtility.js";

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
      currentSort: "name",
      currentSortOrder: "asc",
      search: null,
      searched: [],
      teachers: [],
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
    formatTimezone(timezone) {
      return this.$i18n.t(tzUtility.getTranslation(timezone));
    },
    formatGender(gender) {
      return gender == "M"
        ? this.$i18n.t("message.male")
        : this.$i18n.t("message.female");
    },
    searchOnTable() {
      this.searched = this.teachers.filter(item =>
        toLower(item.name).includes(toLower(this.search))
      );
      this.rePagination();
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
          this.teachers = response.body.sort(
            (a, b) => b.createTime - a.createTime
          );
          this.searched = this.teachers;
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
        message: "服务器端获取老师数据失败！",
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