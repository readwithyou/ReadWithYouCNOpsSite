<template>

  <data-tables :data="users" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="10">
        <el-dropdown @command="handleClick">
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
    prop: "username",
    label: "用户名"
  },
  {
    prop: "name",
    label: "姓名"
  },
  {
    prop: "email",
    label: "Email"
  },
  {
    prop: "group",
    label: "用户组"
  },
  {
    prop: "locked",
    label: "状态",
    formatter: (row, column, cellValue, index) => {
      if (cellValue === false) {
        return "正常";
      }
      if (cellValue === true) {
        return "锁定";
      }
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
    prop: "username",
    order: "descending"
  }
};

export default {
  data() {
    return {
      titles,
      customFilters,
      tableProps,
      users: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      var resource = this.$resource("/api/users");
      resource.get().then(
        response => {
          this.users = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取用户数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    customButtonsForRow(row) {
      if ((row.locked === true)) {
        return [
          {
            name: "解锁",
            handler: _ => {
              this.unlockUser(row);
            }
          }
        ];
      } else {
        return [
          {
            name: "锁定",
            handler: _ => {
              this.lockUser(row);
            }
          }
        ];
      }
    },
    lockUser(user) {
      var resource = this.$resource("/api/users/" + user.username + "/lock");
      resource.save().then(
        response => {
          this.notifyLockSuccess();
          this.fetchData();
        },
        response => {
          this.notifyLockError();
        }
      );
    },
    unlockUser(user) {
      var resource = this.$resource("/api/users/" + user.username + "/unlock");
      resource.save().then(
        response => {
          this.notifyLockSuccess();
          this.fetchData();
        },
        response => {
          this.notifyLockError();
        }
      );
    },
    notifyLockError() {
      this.$notify({
        message: "老师信息删除失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyLockSuccess() {
      this.$notify({
        message: "老师信息删除成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    }
  }
};
</script>