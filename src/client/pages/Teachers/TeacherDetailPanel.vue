<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <h4>基本信息</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>号码</label>
                    <md-input type="text" v-model="teacher.ID" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>姓名</label>
                    <md-input type="text" v-model="teacher.name" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>创建时间</label>
                    <md-input type="text" :value="teacher.createTime | date('%c')" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>性别</label>
                    <md-input type="text" v-if="teacher.gender==='M'" value="男" disabled />
                    <md-input type="text" v-else value="女" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>年龄</label>
                    <md-input type="text" v-model="teacher.age" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>电话</label>
                    <md-input type="text" v-model="teacher.phone" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>Email</label>
                    <md-input type="text" v-model="teacher.email" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>所在时区 {{ new Date().toLocaleString() | moment('timezone', teacher.timezone, 'YYYY-MM-DD, h:mm:ss a')}}</label>
                    <md-input type="text" v-model="teacher.timezone" disabled />
                </md-field>
            </div>
        </div>

        <h4>其他备注</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>备注</label>
                    <md-textarea v-model="teacher.remarks" disabled></md-textarea>
                </md-field>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      teacher: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      var resource = this.$resource(
        "/api/teachers/" + this.$route.params.id
      );
      resource.get().then(
        response => {
          this.teacher = response.body;
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
    }
  }
};
</script>
<style lang="scss" scoped>
p.text-muted {
  color: #9e9e9e;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
}
</style>