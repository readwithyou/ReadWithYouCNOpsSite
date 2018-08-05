<template>
  <div>
    <md-table v-model="searched" @md-selected="onSelect">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{ $tc('message.select_book_hint_msg', selected.length, { count: selected.length}) }}</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-row 
      slot="md-table-row" 
      slot-scope="{ item }" 
      :md-disabled="shouldBeDisabled(item)"
      md-selectable="multiple" md-auto-select>
        <md-table-cell :md-label="$t('message.book_code')" md-sort-by="code">{{ item.code }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_set')" md-sort-by="set">{{ item.set }}</md-table-cell>
        <md-table-cell :md-label="$t('message.language')" md-sort-by="language">{{  $t("message."+item.language+"_lang") }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_isbn')" md-sort-by="isbn">{{ item.isbn }}</md-table-cell>
        <md-table-cell :md-label="$t('message.read_level')" md-sort-by="readLevel">{{ formatLevel(item.readLevel) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" md-sort-by="priority">{{ formatPriority(item.priority) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.inventory_quantity')" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>      
        <md-table-cell :md-label="$t('message.locked_quantity')" md-sort-by="locked">{{ item.locked }}</md-table-cell>    
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
  name: "TableMultiple",
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
    search: null,
    searched: [],
    selected: [],
    books: []
  }),
  created(){
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
    onSelect(items) {
      this.selected = items;
    },
    searchOnTable() {
      this.searched = this.books.filter(
        item =>
          toLower(item.code).includes(toLower(this.search)) ||
          toLower(item.name).includes(toLower(this.search)) ||
          toLower(item.set).includes(toLower(this.search)) ||
          toLower(item.isbn).includes(toLower(this.search))
      );
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
        })
        .catch(err => {
          this.notifyFetchingError();
        });
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to fetch book information from server side!",
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
.md-table + .md-table {
  margin-top: 16px;
}
</style>
