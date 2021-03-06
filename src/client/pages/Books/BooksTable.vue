<template>
  <div>
    <md-table v-model="paged" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-primary md-raised" md-menu-trigger>
              <md-icon>menu</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newBook()" v-if="$can('create', 'book')">
                <span>{{ $t("message.new_book") }}</span>
              </md-menu-item>
              <md-menu-item @click="handleInventory('inbound')" v-if="$can('inbound', 'book')">
                <span>{{ $t("message.inbound") }}</span>
              </md-menu-item>
              <md-menu-item @click="handleInventory('outbound')" v-if="$can('outbound', 'book')">
                <span>{{ $t("message.outbound") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-start">
          <label for="tag-filter">{{ $t('message.tag_filter_hint') }}</label>
          <md-select v-model="filters.tagFilter" name="tag-filter" id="tag-filter" md-dense @input="searchOnTable">
            <md-option v-for="tagString in bookTagStrings" :key="tagString.name" :value="tagString.name">
              {{ $t(tagString.translation) }}
            </md-option>
          </md-select>
        </md-field>
        &nbsp;
        <md-field md-clearable class="md-toolbar-section-start">
          <label for="level-filter">{{ $t('message.level_filter_hint') }}</label>
          <md-select v-model="filters.levelFilter" name="level-filter" id="level-filter" md-dense @input="searchOnTable">
            <md-option v-for="levelString in levelStrings" :key="levelString.level" :value="levelString.level">
                {{ $t(levelString.translation) }}
            </md-option>
          </md-select>
        </md-field>
        &nbsp;
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_book_found_message')"
        :md-description="$t('message.no_book_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.book_code')" md-sort-by="code">
          <a @click="viewBook(item.ID)">{{ item.code ? item.code : '---' }}</a>
        </md-table-cell>
        <md-table-cell :md-label="$t('message.book_name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_set')" md-sort-by="set">{{ item.set }}</md-table-cell>
        <md-table-cell :md-label="$t('message.language')" md-sort-by="language">{{  $t("message."+item.language+"_lang") }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_isbn')" md-sort-by="isbn">{{ item.isbn }}</md-table-cell>
        <md-table-cell :md-label="$t('message.read_level')" md-sort-by="readLevel">{{ formatLevel(item.readLevel) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" md-sort-by="priority">{{ formatPriority(item.priority) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.inventory_quantity')" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-primary" v-if="preloading"></md-progress-spinner>
  </div>
</template>

<script>
import { MdTablePagination } from "components";
import miscUtility from "../../utils/miscUtility.js";

const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  components: {
    MdTablePagination
  },
  data() {
    return {
      preloading: true,
      page: 1,
      size: 10,
      currentSort: "code",
      currentSortOrder: "asc",
      filters: {
        tagFilter: null,
        levelFilter: null
      },
      search: null,
      books: [],
      searched: [],
      paged: [],
      levelStrings: miscUtility.levelStrings,
      bookTagStrings: miscUtility.courseNameStrings
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
    searchOnTable() {
      this.searched = this.books.filter(this.checkIfMatchSearch);
      this.rePagination();
    },
    checkIfMatchSearch(book) {
      let matchSearchInput =
        toLower(book.code).includes(toLower(this.search)) ||
        toLower(book.name).includes(toLower(this.search)) ||
        toLower(book.set).includes(toLower(this.search)) ||
        toLower(book.isbn).includes(toLower(this.search));

      let tagFilter = this.filters.tagFilter;
      let matchTagFilterInput =
        !tagFilter ||
        tagFilter.length === 0 ||
        (book.tag && book.tag.indexOf(tagFilter) !== -1);

      let levelFilter = this.filters.levelFilter;
      let matchLevelFilterInput =
        levelFilter === null ||
        levelFilter.length === 0 ||
        book.readLevel === levelFilter;

      return matchSearchInput && matchTagFilterInput && matchLevelFilterInput;
    },
    formatLevel(level) {
      if (level != null) {
        return this.$i18n.t("message.level_" + level);
      }
      return "";
    },
    formatPriority(priority) {
      if (priority) {
        return this.$i18n.t("message.priority_" + priority);
      }
      return "";
    },
    newBook() {
      this.$router.push({ path: "/books/new" });
    },
    viewBook(bookId) {
      this.$router.push({ path: "/books/" + bookId });
    },
    handleInventory(command) {
      this.$router.push({ path: "/books/" + command });
    },
    fetchData() {
      var resource = this.$resource("/api/books");
      resource.get().then(
        response => {
          this.books = response.body;
          this.searched = this.books;
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
        message: "Fail to fetch book data from server!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    customSort(value) {
      this.searched.sort((a, b) => {
        const sortBy = this.currentSort;
        if (sortBy === "quantity" || sortBy === "locked") {
          var leftValue = a[sortBy] ? a[sortBy] : 0;
          var rightValue = b[sortBy] ? b[sortBy] : 0;

          if (this.currentSortOrder === "desc") {
            return leftValue - rightValue;
          }

          return rightValue - leftValue;
        } else {
          var leftValue = a[sortBy] ? a[sortBy].toString() : "";
          var rightValue = b[sortBy] ? b[sortBy].toString() : "";

          if (this.currentSortOrder === "desc") {
            return leftValue.localeCompare(rightValue);
          }

          return rightValue.localeCompare(leftValue);
        }
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