<template>
    <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="content">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <h4>{{ $t("message.basic_info") }}</h4>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <can I="edit" a="student">
                        <md-switch v-model="editting" class="edit-switch">{{ $t("message.edit") }}</md-switch>
                    </can>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.student_id") }}</label>
                        <md-input type="text" v-model="entry.ID" disabled />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="cn-name">{{ $t("message.cn_name") }}</label>
                        <md-input name="cn-name" id="cn-name" v-model="entry.cnName" :disabled="!editting" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('enName')">
                        <label>{{ $t("message.en_name") }}</label>
                        <md-input v-model="entry.enName" :disabled="!editting" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.enName.required">
                            {{ $t("message.en_name_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('type')">
                        <label for="type">{{ $t("message.registration_type") }}</label>
                        <md-select name="type" id="type" v-model="entry.type" md-dense :disabled="!editting">
                            <md-option value="child">{{ $t("message.child") }}</md-option>
                            <md-option value="adult">{{ $t("message.adult") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.type.required">
                            {{ $t("message.type_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="read-level">{{ $t("message.read_level") }}</label>
                        <md-select name="read-level" id="read-level" v-model="entry.readLevel" md-dense :disabled="!editting">
                            <md-option v-for="levelString in levelStrings" :key="levelString.level" :value="levelString.level">
                                {{ $t(levelString.translation) }}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">{{ $t("message.gender") }}</label>
                        <md-select name="gender" id="gender" v-model="entry.gender" md-dense :disabled="!editting">
                            <md-option value="M">{{ $t("message.male") }}</md-option>
                            <md-option value="F">{{ $t("message.female") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.gender.required">
                            {{ $t("message.gender_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('age')">
                        <label for="age">{{ $t("message.age") }}</label>
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="entry.age" :disabled="!editting" />
                        <span class="md-error">{{ $t("message.age_max_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33" v-if="entry.type==='child'">
                    <md-field>
                        <label for="p-name">{{ $t("message.parent_name") }}</label>
                        <md-input name="p-name" id="p-name" v-model="entry.parentName" :disabled="!editting" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33" v-if="entry.type==='child'">
                    <md-field>
                        <label for="relationship">{{ $t("message.relation_to_child") }}</label>
                        <md-input name="relationship" id="relationship" v-model="entry.relationship" :disabled="!editting" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('timezone')">
                        <label for="timezone">{{ $t("message.time_zone") }} {{ new Date().getTime() | moment('timezone', entry.timezone, 'YYYY-MM-DD, h:mm:ss a')}}</label>
                        <md-select name="timezone" id="timezone" v-model="entry.timezone" md-dense :disabled="!editting">
                            <md-option v-for="tzString in tzStrings" :key="tzString.tz" :value="tzString.tz">{{ $t(tzString.translation) }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.timezone.required">{{ $t("message.timezone_required_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="phone">{{ $t("message.phone") }}</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="!editting" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">{{ $t("message.email") }}</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="!editting" />
                        <span class="md-error">{{ $t("message.email_format_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="zoom-id">Zoom ID</label>
                        <md-input name="zoom-id" id="zoom-id" v-model="entry.zoomId" type="text" :disabled="!editting"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.wechat") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechat" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.wechatOpenId") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechatOpenId" type="text"></md-input>
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
                        <md-textarea v-model="entry.remarks" :disabled="!editting"></md-textarea>
                    </md-field>
                </div>
            </div>

            <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>

            <div class="md-layout-item md-size-100 text-center">
                <can I="edit" a="student">
                    <md-button type="submit" class="md-primary" :disabled="!editting">{{ $t("message.save") }}</md-button>
                </can>
            </div>
        </div>
    </div>
    </form>
</template>
<script>
import { Can } from "@casl/vue";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import tzUtility from "../../utils/tzUtility.js";
import miscUtility from "../../utils/miscUtility.js";

export default {
  mixins: [validationMixin],
  components: {
    Can
  },
  data() {
    return {
      entry: {},
      editting: false,
      sending: false,
      tzStrings: tzUtility.tzStrings,
      levelStrings: miscUtility.levelStrings
    };
  },
  validations: {
    entry: {
      enName: {
        required,
        minLength: minLength(2)
      },
      gender: {
        required
      },
      type: {
        required
      },
      age: {
        maxLength: maxLength(3)
      },
      timezone: {
        required
      },
      email: {
        email
      }
    }
  },
  created() {
    this.fetchData();
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
    fetchData() {
      var resource = this.$resource("/api/students/" + this.$route.params.id);
      resource.get().then(
        response => {
          this.entry = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    saveEntry() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource("/api/students/" + this.entry.ID);
      resource.update(this.entry).then(
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
        message: "学员信息登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });

      this.editting = true;
      this.sending = false;
    },
    notifySubmitSuccess() {
      this.$notify({
        message: "学员信息登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });

      this.sending = false;
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取学员数据失败！",
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
.md-progress-spinner {
  position: absolute;
  left: 50%;
  top: 280px;
  margin-left: -50px;
  margin-top: -50px;
}
</style>