<template>
  <div class="content">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <h4>基本信息</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>中文名</label>
                    <md-input type="text" v-model="registration.cnName" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>英文名</label>
                    <md-input type="text" v-model="registration.enName" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>报名时间</label>
                    <md-input type="text" :value="registration.createTime | date('%c')" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>报名类型</label>
                    <md-input type="text" v-if="registration.type==='child'" value="少儿" disabled />
                    <md-input type="text" v-else value="成人" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>性别</label>
                    <md-input type="text" v-if="registration.gender==='M'" value="男" disabled />
                    <md-input type="text" v-else value="女" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>年龄</label>
                    <md-input type="text" v-model="registration.age" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                <md-field>
                    <label>家长姓名</label>
                    <md-input type="text" v-model="registration.parentName" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                <md-field>
                    <label>与孩子关系</label>
                    <md-input type="text" v-model="registration.relationship" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>电话</label>
                    <md-input type="text" v-model="registration.phone" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>Email</label>
                    <md-input type="text" v-model="registration.email" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                    <label>微信</label>
                    <md-input type="text" v-model="registration.wechat" disabled />
                </md-field>
            </div>
        </div>

        <h4>问卷调查</h4>

        <div class="md-layout" v-if="registration.type==='child'">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>孩子目前在读英文书吗？</label>
                    <md-input type="text" v-if="registration.ifReadEnBook" value="是" disabled />
                    <md-input type="text" v-else value="否" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>每年购买英文书的数量：</label>
                    <md-input type="text" v-model="registration.numBookBought" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>您亲自给孩子读英文绘本吗？</label>
                    <md-input type="text" v-if="registration.ifReadForChild" value="是" disabled />
                    <md-input type="text" v-else value="否" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>你是否为孩子规划国际教育路线？</label>
                    <md-input type="text" v-if="registration.ifIntlEducation" value="是" disabled />
                    <md-input type="text" v-else value="否" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>在为孩子读英文绘本时遇到哪些困难？</label>
                    <md-textarea v-model="registration.readingBlocker" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>目前在读英文书目举例：</label>
                    <md-textarea v-model="registration.enBookExample" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>您对陪你读书的陪读服务的期望是什么？</label>
                    <md-textarea v-model="registration.expectation" disabled></md-textarea>
                </md-field>
            </div>
        </div>

        <div class="md-layout" v-else>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>目前在读英文书吗？</label>
                    <md-input type="text" v-if="registration.ifReadEnBook" value="是" disabled />
                    <md-input type="text" v-else value="否" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>每年购买英文书的数量：</label>
                    <md-input type="text" v-model="registration.numBookBought" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>完整阅读完的英文书数量：</label>
                    <md-input type="text" v-model="registration.numBookRead" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>阅读图书，英文邮件，文档等内容时，您遇到的最大障碍是：</label>
                    <md-textarea v-model="registration.readingBlocker" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>简述您的英文学习经历：</label>
                    <md-textarea v-model="registration.exprience" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>您对陪你读书的陪读服务的期望是什么？（6个月短期和1-2年的长期期望）</label>
                    <md-textarea v-model="registration.expectation" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>您喜欢读哪些种类的图书呢？ 目前在读书目举例（中英文都可以）</label>
                    <md-textarea v-model="registration.favBooks" disabled></md-textarea>
                </md-field>
            </div>
        </div>

        <h4>其他备注</h4>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>备注</label>
                    <md-textarea v-model="registration.remarks" disabled></md-textarea>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label>期待试课时间</label>
                    <md-textarea v-model="registration.preTimeSlot" disabled></md-textarea>
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
  line-height: 16px;
}
</style>