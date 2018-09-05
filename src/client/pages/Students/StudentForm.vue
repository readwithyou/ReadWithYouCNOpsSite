<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card class="md-layout-item md-size-100">
        <md-card-header>
            <div class="md-title">{{ $t("message.student_create_title") }}</div>
            <div class="md-subhead">{{ $t("message.student_create_subtitle") }}</div>
        </md-card-header>

        <md-card-content>
            <h4>{{ $t("message.basic_info") }}</h4>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="cn-name">{{ $t("message.cn_name") }}</label>
                        <md-input name="cn-name" id="cn-name" v-model="entry.cnName" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('enName')">
                        <label>{{ $t("message.en_name") }}</label>
                        <md-input v-model="entry.enName" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.enName.required">
                            {{ $t("message.en_name_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('type')">
                        <label for="type">{{ $t("message.registration_type") }}</label>
                        <md-select name="type" id="type" v-model="entry.type" md-dense :disabled="sending">
                            <md-option value="child">{{ $t("message.child") }}</md-option>
                            <md-option value="adult">{{ $t("message.adult") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.type.required">
                            {{ $t("message.type_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">{{ $t("message.gender") }}</label>
                        <md-select name="gender" id="gender" v-model="entry.gender" md-dense :disabled="sending">
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
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="entry.age" :disabled="sending" />
                        <span class="md-error">{{ $t("message.age_max_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33" v-if="entry.type==='child'">
                    <md-field>
                        <label for="p-name">{{ $t("message.parent_name") }}</label>
                        <md-input name="p-name" id="p-name" v-model="entry.parentName" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33" v-if="entry.type==='child'">
                    <md-field>
                        <label for="relationship">{{ $t("message.relation_to_child") }}</label>
                        <md-input name="relationship" id="relationship" v-model="entry.relationship" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('timezone')">
                        <label for="timezone">{{ $t("message.time_zone") }} {{ new Date().getTime() | moment('timezone', entry.timezone, 'YYYY-MM-DD, h:mm:ss a')}}</label>
                        <md-select name="timezone" id="timezone" v-model="entry.timezone" md-dense :disabled="sending">
                            <md-option v-for="tzString in tzStrings" :key="tzString.tz" :value="tzString.tz">{{ $t(tzString.translation) }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.timezone.required">{{ $t("message.timezone_required_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="phone">{{ $t("message.phone") }}</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="sending" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">{{ $t("message.email") }}</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                        <span class="md-error">{{ $t("message.email_format_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="zoom-id">Zoom ID</label>
                        <md-input name="zoom-id" id="zoom-id" v-model="entry.zoomId" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.wechat") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechat" type="text" :disabled="sending" ></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.wechatOpenId") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechatOpenId" type="text" :disabled="sending" ></md-input>
                    </md-field>
                </div>
            </div>

            <h4>{{ $t("message.remarks") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label for="remarks">{{ $t("message.remarks") }}({{ $t("message.optional") }})</label>
                        <md-input type="text" id="remarks" name="remarks" autocomplete="remarks" v-model="entry.remarks" :disabled="sending" />                      
                    </md-field>
                </div>
            </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-raised md-primary" :disabled="sending">{{ $t("message.submit") }}</md-button>
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
import tzUtility from "../../utils/tzUtility.js";

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
    entry: {},
    sending: false,
    entrySaved: false,
    fullName: null,
    tzStrings: tzUtility.tzStrings
  }),
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

      var resource = this.$resource("/api/students");
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
        message: "学员信息登记失败，请稍后重试！",
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
        message: "学员信息登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/students` });
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
