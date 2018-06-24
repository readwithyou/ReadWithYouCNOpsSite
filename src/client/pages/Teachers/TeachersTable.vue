<template>

  <data-tables :data="teachers" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
    <md-dialog-confirm
      :md-active.sync="deleteDialogActive"
      md-title="确认"
      md-content="操作不能恢复，确定删除试课报名信息么？"
      md-confirm-text="确认"
      md-cancel-text="取消"
      @md-cancel="onCancelDelete"
      @md-confirm="onConfirmDelete" />
    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="10">
        <el-dropdown @command="handleClick">
          <el-button type="default">新增<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="teacher">老师</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5" :offset="9">
        <el-input v-model="customFilters[0].vals"></el-input>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles" :prop="title.prop" :formatter="title.formatter" :label="title.label" :key="title.prop" sortable="custom">
    </el-table-column>
    <el-table-column label="处理" min-width="100px">
      <template scope="scope">
        <el-button v-for="button in customButtonsForRow(scope.row)" :key="button.name" type="text" @click="button.handler">
          {{ button.name }}
        </el-button>
      </template>
    </el-table-column>
  </data-tables>
</template>

<script>
var titles = [
  {
    prop: "ID",
    label: "号码"
  },
  {
    prop: "name",
    label: "姓名"
  },
  {
    prop: "gender",
    label: "性别"
  },
  {
    prop: "timezone",
    label: "时区"
  },
  {
    prop: "email",
    label: "邮箱"
  },
  {
    prop: "createTime",
    label: "创建时间",
    formatter: (row, column, cellValue, index) => {
      if (cellValue) {
        return new Date(cellValue).toLocaleString();
      }
      return "";
    }
  }
];

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
      titles,
      customFilters,
      tableProps,
      teachers: [],
      deleteDialogActive: false,
      entryToDelete: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.$router.push({ path: "/teachers/new" });
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body;
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
    customButtonsForRow(row) {
      return [
        {
          name: "查看",
          handler: _ => {
            this.$router.push({ path: "/teachers/" + row.ID });
          }
        },
        {
          name: "删除",
          handler: _ => {
            this.entryToDelete = row;
            this.deleteDialogActive = true;
          }
        }
      ];
    },
    onConfirmDelete() {
      var resource = this.$resource(
        "/api/teachers/" + this.entryToDelete.ID
      );
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
      this.entryToDelete = null;
    },
    notifyRemoveError() {
      this.$notify({
        message: "老师信息删除失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyRemoveSuccess() {
      this.$notify({
        message: "老师信息删除成功！",
        icon: "add_alert",
        horizontalAlign: "right",
        verticalAlign: "top",
        type: "success"
      });
    }
  }
};
</script>