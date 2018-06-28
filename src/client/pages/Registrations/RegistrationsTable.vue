<template>

  <data-tables :data="regs" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
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
            <el-dropdown-item command="child">少儿</el-dropdown-item>
            <el-dropdown-item command="adult">成人</el-dropdown-item>
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
    label: "学号"
  },
  {
    prop: "cnName",
    label: "姓名"
  },
  {
    prop: "type",
    label: "报名类型",
    formatter: (row, column, cellValue, index) => {
      if (cellValue === "adult") {
        return "成人";
      }
      if (cellValue === "child") {
        return "少儿";
      }
    }
  },
  {
    prop: "tag",
    label: "报名来源"
  },
  {
    prop: "createTime",
    label: "报名时间",
    formatter: (row, column, cellValue, index) => {
      if (cellValue) {
        return new Date(cellValue).toLocaleString();
      }
      return "";
    }
  },
  {
    prop: "status",
    label: "状态",
    formatter: (row, column, cellValue, index) => {
      if (cellValue === 0) {
        return "未处理";
      }
      if (cellValue === 1) {
        return "已预约";
      }
      if (cellValue === 2) {
        return "已完成";
      }
    }
  },
  {
    prop: "scheduledTime",
    label: "试课时间",
    formatter: (row, column, cellValue, index) => {
      if (cellValue) {
        return new Date(cellValue).toLocaleString();
      }
      return "";
    }
  },
  {
    prop: "teacher",
    label: "老师"
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
      regs: [],
      deleteDialogActive: false,
      entryToDelete: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.$router.push({ path: "/registrations/new?type=" + command });
    },
    fetchRegistrations() {
      var resource = this.$resource("/api/registrations");
      resource.get().then(
        response => {
          this.regs = response.body;
          for (var i = 0; i < this.regs.length; i++) {
            for (var j = 0; j < this.teachers.length; j++) {
              if (this.teachers[j].ID === this.regs[i].teacherId) {
                this.regs[i].teacher = this.teachers[j].name;
              }
            }
          }
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(response => {
        this.teachers = response.body;
        this.fetchRegistrations();
      });
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取试课报名数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    customButtonsForRow(row) {
      if (row.status === 0) {
        return [
          {
            name: "查看",
            handler: _ => {
              this.$router.push({ path: "/registrations/" + row.ID });
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
      } else {
        return [
          {
            name: "查看",
            handler: _ => {
              this.$router.push({ path: "/registrations/" + row.ID });
            }
          }
        ];
      }
    },
    onConfirmDelete() {
      var resource = this.$resource(
        "/api/registrations/" + this.entryToDelete.ID
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
        message: "试课报名删除失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyRemoveSuccess() {
      this.$notify({
        message: "试课报名删除成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    }
  }
};
</script>