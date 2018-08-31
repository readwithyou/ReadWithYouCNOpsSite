<template>
  <div>
    <md-table v-model="paged" @md-selected="onSelect" :md-sort.sync="currentSort" :md-sort-order.sync="currentSortOrder" :md-sort-fn="customSort">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{ $tc('message.select_book_hint_msg', selected.length, { count: selected.length}) }}</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-start">
          <label for="filters">{{ $t('message.filter_hint') }}</label>
          <md-select v-model="filters" name="filters" id="filters" md-dense multiple @input="searchOnTable">
            <md-option v-for="tagString in bookTagStrings" :key="tagString.name" :value="tagString.name">
              {{ $t(tagString.translation) }}
            </md-option>
          </md-select>
        </md-field>
        &nbsp;
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" :md-disabled="shouldBeDisabled(item)" md-selectable="multiple" md-auto-select>
        <md-table-cell :md-label="$t('message.book_code')" md-sort-by="code">{{ item.code }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_set')" md-sort-by="set">{{ item.set }}</md-table-cell>
        <md-table-cell :md-label="$t('message.inventory_quantity')" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>
        <md-table-cell :md-label="$t('message.read_level')" md-sort-by="readLevel">{{ formatLevel(item.readLevel) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" md-sort-by="priority">{{ formatPriority(item.priority) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewInAmazon(item.isbn)" v-if="item.isbn">{{ $t("message.view_in_amazon") }}</a>
        </md-table-cell>
      </md-table-row>

      <md-table-pagination :mdPage = "page" :mdPageSize = "size" :md-total="searched.length" v-on:update-pagination="onUpdatePagination">
      </md-table-pagination>
    </md-table>
    
  </div>
</template>

<script>
import Vue from "vue";
import { MdTablePagination } from "components";
import miscUtility from "../../utils/miscUtility.js";

const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  name: "TableMultiple",
  components: {
    MdTablePagination
  },
  props: {
    studentId: {
      type: String
    },
    levelBaseline: {
      type: String
    },
    language: {
      type: String
    },
    purpose: {
      type: String
    }
  },
  data: () => ({
    page: 1,
    size: 10,
    currentSort: "inventory",
    currentSortOrder: "desc",
    filters: [],
    search: null,
    searched: [],
    selected: [],
    books: [],
    paged: [],
    bookTagStrings: miscUtility.courseNameStrings
  }),
  created() {
    this.fetchBooks();
  },
  watch: {
    selected: {
      handler(val) {
        this.$emit("books-selected", this.selected);
      }
    },
    studentId: function(newVal, oldVal) {
      this.fetchBooks();
    },
    levelBaseline: function(newVal, oldVal) {
      this.fetchBooks();
    },
    language: function(newVal, oldVal) {
      this.fetchBooks();
    }
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
    onSelect(items) {
      this.selected = items;
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

      let matchFilterInput =
        !this.filters ||
        this.filters.length === 0 ||
        this.filters.filter(value => book.tag && -1 !== book.tag.indexOf(value))
          .length > 0;

      return matchSearchInput && matchFilterInput;
    },
    shouldBeDisabled(item) {
      return item.language !== this.language;
    },
    formatLevel(level) {
      if (level !== null) {
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
    fetchBooks() {
      if (
        !this.studentId ||
        !this.levelBaseline ||
        !this.language ||
        !this.purpose
      ) {
        this.books = [];
        this.searched = this.books;
        this.selected = [];
        return;
      }

      Vue.http
        .post("/api/books/query", {
          studentId: this.studentId,
          language: this.language,
          levelBaseline: Number(this.levelBaseline),
          purpose: this.purpose
        })
        .then(response => {
          this.books = response.body;
          this.searched = this.books;
          this.selected = [];
          this.pagination();
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    viewInAmazon(isbn) {
      let amazonLink =
        "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=" +
        isbn;
      window.open(amazonLink, "_blank");
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to fetch book information from server side!",
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
.md-table + .md-table {
  margin-top: 16px;
}
</style>
