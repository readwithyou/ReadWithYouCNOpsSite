<template>

  <data-tables :data="records" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="10">
        <el-dropdown @command="handleClick">
          <el-button type="default">{{ $t("message.refresh") }}<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="refresh">{{ $t("message.refresh") }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5" :offset="9">
        <el-input v-model="customFilters[0].vals"></el-input>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles" :prop="title.prop" :formatter="title.formatter" :label="title.label" :key="title.prop" sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
import Vue from "vue";

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
    prop: "EventTime",
    order: "descending"
  }
};

export default {
  data() {
    return {
      titles: [
        {
          prop: "EventTime",
          label: this.$i18n.t("message.time"),
          formatter: (row, column, cellValue, index) => {
            if (cellValue) {
              return new Date(cellValue).toLocaleString();
            }
            return "";
          }
        },
        {
          prop: "type",
          label: this.$i18n.t("message.type"),
          formatter: (row, column, cellValue, index) => {
            if (cellValue === "inbound") {
              return this.$i18n.t("message.inbound");
            }
            if (cellValue === "outbound") {
              return this.$i18n.t("message.outbound");
            }
          }
        },
        {
          prop: "quantity",
          label: this.$i18n.t("message.quantity")
        },
        {
          prop: "actor",
          label: this.$i18n.t("message.actor")
        },
        {
          prop: "description",
          label: this.$i18n.t("message.description")
        }
      ],
      customFilters,
      tableProps,
      records: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.fetchData();
    },
    fetchData() {
      Vue.http
        .post("/api/inventory/query", {
          bookId: this.$route.params.id,
          after: 0,
          before: new Date().getTime()
        })
        .then(response => {
          this.records = response.body;
        })
        .catch(err => {
          notifyFetchingError();
        });
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>