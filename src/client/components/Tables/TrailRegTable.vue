<template>
  <data-tables :data="regs" :show-action-bar="false" :custom-filters="customFilters">

    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="5">
        <el-button type="primary" @command="handleClick">添加<i class="el-icon-plus el-icon--right"></i></el-button>
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
    prop: "chineseName",
    label: "姓名"
  },
  {
    prop: "Type",
    label: "报名类型"
  },
  {
    prop: "CreateTime",
    label: "报名时间"
  },
  {
    prop: "age",
    label: "状态"
  },
  {
    prop: "CreateTime",
    label: "试课时间"
  },
  {
    prop: "englishName",
    label: "老师"
  },
  {
    prop: "englishName",
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