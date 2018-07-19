<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
            <h4 class="title">老师信息登记表</h4>
            <p class="category">填写相应信息完成添加老师。</p>
        </md-card-header>

        <md-card-content>
            <h4>基本信息</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('name')">
                        <label for="name">名字</label>
                        <md-input name="name" id="name" v-model="entry.name" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.name.required">
                            名字为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="surname">姓氏</label>
                        <md-input name="surname" id="surname" v-model="entry.surname" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">性别</label>
                        <md-select name="gender" id="gender" v-model="entry.gender" md-dense :disabled="sending">
                            <md-option value="M">男</md-option>
                            <md-option value="F">女</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.gender.required">
                            性别为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('age')">
                        <label for="age">年龄</label>
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="entry.age" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.age.maxlength">年龄是不是太大了？</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="phone">电话（选填）</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="sending" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.email.required">Email为必填项目。</span>
                        <span class="md-error" v-else-if="!$v.entry.email.email">Email地址格式错误。</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('timezone')">
                        <label for="timezone">所在时区 {{ new Date().toLocaleString() | moment('timezone', entry.timezone, 'YYYY-MM-DD, h:mm:ss a')}}</label>
                        <md-select name="timezone" id="timezone" v-model="entry.timezone" md-dense :disabled="sending">
                            <md-option value="Asia/Shanghai">Shanghai</md-option>
                            <md-option value="Asia/Tokyo">Tokyo</md-option>
                            <md-option value="America/New_York">EST observe DST</md-option>
                            <md-option value="America/Chicago">CST observe DST</md-option>
                            <md-option value="America/Los_Angeles">PST observe DST</md-option>
                            <md-option value="America/Denver">MST observe DST</md-option>
                            <md-option value="America/Phoenix">MST not observe DST</md-option>
                            <md-option value="America/Panama">Panama</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.timezone.required">
                            所在时区为必填项目。
                        </span>
                    </md-field>
                </div>
            </div>

            <h4>其他备注</h4>
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label for="remarks">备注（选填）</label>
                        <md-input type="text" id="remarks" name="remarks" autocomplete="remarks" v-model="entry.remarks" :disabled="sending" />                      
                    </md-field>
                </div>
            </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-primary" :disabled="sending">提交</md-button>
        </div>
    </md-card>
</form>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { GraphQLNonNull } from "graphql";

export default {
  name: "edit-teacher-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    entry: {
      name: null,
      gender: null,
      age: null,
      phone: null,
      email: null,
      timezone: null,
      remarks: null
    },
    sending: false,
    entrySaved: false,
    fullName: null
  }),
  validations: {
    entry: {
      name: {
        required,
        minLength: minLength(2)
      },
      gender: {
        required
      },
      age: {
        maxLength: maxLength(3)
      },
      timezone: {
        required
      },
      email: {
        required,
        email
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.entry[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveEntry();
      }
    },
    saveEntry() {
      this.sending = true;

      var resource = this.$resource("/api/teachers");
      resource.save(this.entry).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: "老师信息登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.fullName = `${this.entry.name}`;
      this.entrySaved = true;
      this.sending = false;
      this.$notify({
        message: "老师信息登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/teachers` });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
