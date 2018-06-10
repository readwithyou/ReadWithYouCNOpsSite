<template>
  <data-tables :data="regs" :show-action-bar="false" :custom-filters="customFilters">

    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="5">
        <el-dropdown @command="handleClick">
          <el-button type="primary">新增<i class="el-icon-plus el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="child">少儿</el-dropdown-item>
            <el-dropdown-item command="adult">成人</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5">
        <el-select v-model="customFilters[1].vals" multiple="multiple">
          <el-option label="少儿" value="child"></el-option>
          <el-option label="成人" value="adult"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :offset="9">
        <el-input v-model="customFilters[0].vals"></el-input>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop" sortable="custom">
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
    label: "报名类型"
  },
  {
    prop: "createTime",
    label: "报名时间"
  },
  {
    prop: "age",
    label: "状态"
  },
  {
    prop: "courseTime",
    label: "试课时间"
  },
  {
    prop: "teacher",
    label: "老师"
  },
  {
    prop: "email",
    label: "处理"
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

export default {
  data() {
    return {
      titles,
      customFilters,
      regs: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleClick(command) {
      this.$message(`click drapdown button ${command}`);
    },
    fetchData() {
      fetch("/api/registrations")
        .then(res => res.json())
        .then(res => (this.regs = res))
        .catch(res => {
          this.notifyFetchingError();
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
    }
  }
};
</script>