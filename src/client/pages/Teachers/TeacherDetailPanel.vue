<template>
    <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="content">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <h4>{{ $t("message.basic_info") }}</h4>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-switch v-model="editting" class="edit-switch">{{ $t("message.edit") }}</md-switch>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.teacher_id") }}</label>
                        <md-input type="text" v-model="teacher.ID" disabled />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('name')">
                        <label>{{ $t("message.name") }}</label>
                        <md-input type="text" v-model="teacher.name" :disabled="!editting" />
                        <span class="md-error" v-if="!$v.teacher.name.required">
                            姓名为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.create_time") }}</label>
                        <md-input type="text" :value="teacher.createTime | date('%c')" disabled />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">{{ $t("message.gender") }}</label>
                        <md-select name="gender" id="gender" v-model="teacher.gender" md-dense :disabled="!editting">
                            <md-option value="M">{{ $t("message.male") }}</md-option>
                            <md-option value="F">{{ $t("message.female") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.teacher.gender.required">
                            性别为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('age')">
                        <label>{{ $t("message.age") }}</label>
                        <md-input type="text" v-model="teacher.age" :disabled="!editting" />
                        <span class="md-error" v-if="!$v.teacher.age.maxlength">年龄是不是太大了？</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.phone") }}</label>
                        <md-input type="text" v-model="teacher.phone" :disabled="!editting" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label>Email</label>
                        <md-input type="text" v-model="teacher.email" :disabled="!editting" />
                        <span class="md-error" v-if="!$v.teacher.email.required">Email为必填项目。</span>
                        <span class="md-error" v-else-if="!$v.teacher.email.email">Email地址格式错误。</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-66">
                    <md-field :class="getValidationClass('timezone')">
                        <label for="timezone">{{ $t("message.time_zone") }} {{ new Date().toLocaleString() | moment('timezone', teacher.timezone, 'YYYY-MM-DD, h:mm:ss a')}}</label>
                        <md-select name="timezone" id="timezone" v-model="teacher.timezone" md-dense :disabled="!editting">
                            <md-option value="Asia/Shanghai">Shanghai</md-option>
                            <md-option value="Asia/Tokyo">Tokyo</md-option>
                            <md-option value="America/New_York">EST observe DST</md-option>
                            <md-option value="America/Chicago">CST observe DST</md-option>
                            <md-option value="America/Los_Angeles">PST observe DST</md-option>
                            <md-option value="America/Denver">MST observe DST</md-option>
                            <md-option value="America/Phoenix">MST not observe DST</md-option>
                            <md-option value="America/Panama">Panama</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.teacher.timezone.required">
                            所在时区为必填项目。
                        </span>
                    </md-field>
                </div>
            </div>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                    <h4>{{ $t("message.other_info") }}</h4>
                </div>
            </div>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                    <md-field>
                        <label>{{ $t("message.remarks") }}</label>
                        <md-textarea v-model="teacher.remarks" :disabled="!editting"></md-textarea>
                    </md-field>
                </div>
            </div>

            <div class="md-layout-item md-size-100 text-center">
                <md-button type="submit" class="md-primary" :disabled="!editting">{{ $t("message.submit") }}</md-button>
            </div>
        </div>
    </div>
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

export default {
  mixins: [validationMixin],
  data() {
    return {
      teacher: {},
      editting: false
    };
  },
  validations: {
    teacher: {
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
  created() {
    this.fetchData();
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.teacher[fieldName];

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
    fetchData() {
      var resource = this.$resource("/api/teachers/" + this.$route.params.id);
      resource.get().then(
        response => {
          this.teacher = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    saveEntry() {
      this.editting = false;

      var resource = this.$resource("/api/teachers/" + this.teacher.ID);
      resource.update(this.teacher).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifySubmitError() {
      this.$notify({
        message: "老师信息登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });

      this.editting = true;
    },
    notifySubmitSuccess() {
      this.$notify({
        message: "老师信息登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
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
.edit-switch {
  float: right;
}
</style>
