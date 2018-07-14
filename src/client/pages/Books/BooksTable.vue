<template>

  <data-tables :data="books" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="10">
        <el-dropdown @command="handleClick">
          <el-button type="default">{{ $t("message.create") }}<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="book">{{ $t("message.book") }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5" :offset="9">
        <el-input v-model="customFilters[0].vals"></el-input>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles" :prop="title.prop" :formatter="title.formatter" :label="title.label" :key="title.prop" sortable="custom">
    </el-table-column>
    <el-table-column :label="$t('message.action')" min-width="100px">
      <template scope="scope">
        <el-button v-for="button in customButtonsForRow(scope.row)" :key="button.name" type="text" @click="button.handler">
          <md-icon>{{button.icon}}</md-icon>
        </el-button>
      </template>
    </el-table-column>
  </data-tables>
</template>

<script>
var customFilters = [
  {
    vals: ""
  },
  {
    vals: [],
    props: "Type"
  }
];

var tableProps = {
  border: false,
  stripe: true,
  defaultSort: {
    prop: "ID",
    order: "descending"
  }
};

export default {
  data() {
    return {
      titles: [
        {
          prop: "code",
          label: this.$i18n.t("message.book_code")
        },
        {
          prop: "name",
          label: this.$i18n.t("message.book_name")
        },
        {
          prop: "isbn",
          label: this.$i18n.t("message.book_isbn")
        },
        {
          prop: "level",
          label: this.$i18n.t("message.read_level"),
          formatter: (row, column, cellValue, index) => {
            if (cellValue) {
              return this.$i18n.t("message.level_" + cellValue);
            }
            return "";
          }
        },
        {
          prop: "priority",
          label: this.$i18n.t("message.priority"),
          formatter: (row, column, cellValue, index) => {
            if (cellValue) {
              return this.$i18n.t("message.priority_" + cellValue);
            }
            return "";
          }
        },
        {
          prop: "quantity",
          label: this.$i18n.t("message.inventory_quantity")
        }
      ],
      customFilters,
      tableProps,
      books: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.$router.push({ path: "/books/new" });
    },
    fetchData() {
      var resource = this.$resource("/api/books");
      resource.get().then(
        response => {
          this.books = response.body;
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
    },
    customButtonsForRow(row) {
      return [
        {
          name: this.$i18n.t("message.view"),
          icon: 'edit',
          handler: _ => {
            this.$router.push({ path: "/books/" + row.ID });
          }
        },
        {
          name: this.$i18n.t("message.preview_book"),
          icon: 'search',
          handler: _ => {
            this.$router.push({ path: "/books/" + row.ID });
          }
        }
      ];
    }
  }
};
</script>