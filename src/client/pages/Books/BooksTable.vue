<template>
  <div>
    <md-table v-model="searched" md-sort="code" md-sort-order="asc">
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <md-menu>
            <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
              <md-icon>menu</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="newBook()">
                <span>{{ $t("message.new_book") }}</span>
              </md-menu-item>
              <md-menu-item @click="handleInventory('inbound')">
                <span>{{ $t("message.inbound") }}</span>
              </md-menu-item>
              <md-menu-item @click="handleInventory('outbound')">
                <span>{{ $t("message.outbound") }}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input :placeholder="$t('message.search_hint')" v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        :md-label="$t('message.no_book_found_message')"
        :md-description="$t('message.no_book_found_message_detail')">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell :md-label="$t('message.book_code')" md-sort-by="code">{{ item.code }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_name')" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell :md-label="$t('message.book_isbn')" md-sort-by="isbn">{{ item.isbn }}</md-table-cell>
        <md-table-cell :md-label="$t('message.read_level')" md-sort-by="level">{{ formatLevel(item.level) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.priority')" md-sort-by="priority">{{ formatPriority(item.priority) }}</md-table-cell>
        <md-table-cell :md-label="$t('message.inventory_quantity')" md-sort-by="quantity">{{ item.quantity }}</md-table-cell>      
        <md-table-cell :md-label="$t('message.action')">
          <a @click="viewBook(item.ID)">{{ $t("message.view") }}</a>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
const toLower = text => {
  return text ? text.toString().toLowerCase() : "";
};

export default {
  data() {
    return {
      search: null,
      searched: [],
      books: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    searchOnTable() {
      this.searched = this.books.filter(
        item =>
          toLower(item.code).includes(toLower(this.search)) ||
          toLower(item.name).includes(toLower(this.search)) ||
          toLower(item.isbn).includes(toLower(this.search))
      );
    },
    formatLevel(level) {
      if (level) {
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
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取图书数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>