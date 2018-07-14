<template>

  <data-tables :data="students" :show-action-bar="false" :custom-filters="customFilters" :table-props="tableProps">
    <md-dialog-confirm
      :md-active.sync="deleteDialogActive"
      md-title="确认"
      md-content="操作不能恢复，确定删除学员信息么？"
      md-confirm-text="确认"
      md-cancel-text="取消"
      @md-cancel="onCancelDelete"
      @md-confirm="onConfirmDelete" />
    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="10">
        <el-dropdown @command="handleClick">
          <el-button type="default">{{ $t("message.create") }}<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="student">{{ $t("message.student") }}</el-dropdown-item>
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
          prop: "ID",
          label: this.$i18n.t("message.student_id")
        },
        {
          prop: "cnName",
          label: this.$i18n.t("message.cn_name")
        },
        {
          prop: "enName",
          label: this.$i18n.t("message.en_name")
        },
        {
          prop: "gender",
          label: this.$i18n.t("message.gender")
        },
        {
          prop: "age",
          label: this.$i18n.t("message.age")
        },
        {
          prop: "type",
          label: this.$i18n.t("message.registration_type"),
          formatter: (row, column, cellValue, index) => {
            return this.$i18n.t("message." + cellValue);
          }
        },
        {
          prop: "createTime",
          label: this.$i18n.t("message.create_time"),
          formatter: (row, column, cellValue, index) => {
            if (cellValue) {
              return new Date(cellValue).toLocaleString();
            }
            return "";
          }
        }
      ],
      customFilters,
      tableProps,
      students: [],
      deleteDialogActive: false,
      entryToDelete: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.$router.push({ path: "/students/new" });
    },
    fetchData() {
      var resource = this.$resource("/api/students");
      resource.get().then(
        response => {
          this.students = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取学员数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    customButtonsForRow(row) {
      return [
        {
          name: 'view',
          icon: 'edit',
          handler: _ => {
            this.$router.push({ path: "/students/" + row.ID });
          }
        },
        {
          name: 'delete',
          icon: 'delete',
          handler: _ => {
            this.entryToDelete = row;
            this.deleteDialogActive = true;
          }
        }
      ];
    },
    onConfirmDelete() {
      var resource = this.$resource("/api/students/" + this.entryToDelete.ID);
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
        message: "学员信息删除失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyRemoveSuccess() {
      this.$notify({
        message: "学员信息删除成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    }
  }
};
</script>