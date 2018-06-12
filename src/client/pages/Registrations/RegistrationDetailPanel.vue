<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <h4>基本信息</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">中文名</p>
                <h5 class="text-muted">{{registration.cnName}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">英文名</p>
                <h5 class="text-muted">{{registration.enName}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">报名类型</p>
                <h5 class="text-muted" v-if="registration.type==='child'"> 少儿 </h5>
                <h5 class="text-muted" v-else> 成人 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">性别</p>
                <h5 class="text-muted" v-if="registration.gender==='M'"> 男 </h5>
                <h5 class="text-muted" v-else> 女 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">年龄</p>
                <h5 class="text-muted">{{registration.age}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                <p class="text-muted">家长姓名</p>
                <h5 class="text-muted">{{registration.parentName}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                <p class="text-muted">与孩子关系</p>
                <h5 class="text-muted">{{registration.relationship}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">电话</p>
                <h5 class="text-muted">{{registration.phone}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">Email</p>
                <h5 class="text-muted">{{registration.email}} </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <p class="text-muted">微信</p>
                <h5 class="text-muted">{{registration.wechat}} </h5>
            </div>
        </div>

        <md-divider></md-divider>
        <h4>问卷调查</h4>

        <div class="md-layout" v-if="registration.type==='child'">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">孩子目前在读英文书吗？</p>
                <h5 class="text-muted" v-if="registration.ifReadEnBook"> 是 </h5>
                <h5 class="text-muted" v-else> 否 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">每年购买英文书的数量：</p>
                <h5 class="text-muted">{{registration.numBookBought}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">您亲自给孩子读英文绘本吗？</p>
                <h5 class="text-muted" v-if="registration.ifReadForChild"> 是 </h5>
                <h5 class="text-muted" v-else> 否 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">你是否为孩子规划国际教育路线？</p>
                <h5 class="text-muted" v-if="registration.ifIntlEducation"> 是 </h5>
                <h5 class="text-muted" v-else> 否 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">在为孩子读英文绘本时遇到哪些困难？</p>
                <h5 class="text-muted">{{registration.readingBlocker}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">目前在读英文书目举例：</p>
                <h5 class="text-muted">{{registration.enBookExample}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">您对陪你读书的陪读服务的期望是什么？</p>
                <h5 class="text-muted">{{registration.expectation}}</h5>
            </div>
        </div>

        <div class="md-layout" v-else>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">目前在读英文书吗？</p>
                <h5 class="text-muted" v-if="registration.ifReadEnBook"> 是 </h5>
                <h5 class="text-muted" v-else> 否 </h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">每年购买英文书的数量：</p>
                <h5 class="text-muted">{{registration.numBookBought}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <p class="text-muted">完整阅读完的英文书数量：</p>
                <h5 class="text-muted">{{registration.numBookRead}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">阅读图书，英文邮件，文档等内容时，您遇到的最大障碍是：</p>
                <h5 class="text-muted">{{registration.readingBlocker}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">简述您的英文学习经历：</p>
                <h5 class="text-muted">{{registration.exprience}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">您对陪你读书的陪读服务的期望是什么？（6个月短期和1-2年的长期期望）</p>
                <h5 class="text-muted">{{registration.expectation}}</h5>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">您喜欢读哪些种类的图书呢？ 目前在读书目举例（中英文都可以）</p>
                <h5 class="text-muted">{{registration.favBooks}}</h5>
            </div>
        </div>

        <md-divider></md-divider>
        <h4>其他备注</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
                <p class="text-muted">备注</p>
                <h5 class="text-muted">{{registration.remarks}}</h5>
            </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      registration: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      var resource = this.$resource(
        "/api/registrations/" + this.$route.params.id
      );
      resource.get().then(
        response => {
          this.registration = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
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
<style lang="scss" scoped>
p.text-muted {
  color: #9e9e9e;
  font-weight: 400;
  font-size: 13px;
  line-height: 13px;
}
</style>