<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
            <h4 class="title">{{ $t("message.child_registrations_card_title") }}</h4>
            <p class="category">{{ $t("message.child_registrations_card_subtitle") }}</p>
        </md-card-header>

        <md-card-content>
            <h4>基本信息</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label>{{ $t("message.en_name") }}</label>
                        <md-input v-model="entry.enName" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label for="cn-name">{{ $t("message.cn_name") }}({{ $t("message.optional") }})</label>
                        <md-input name="cn-name" id="cn-name" v-model="entry.cnName" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label>{{ $t("message.registration_source") }}({{ $t("message.optional") }})</label>
                        <md-input type="text" v-model="entry.tag" :disabled="sending" />
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
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
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('age')">
                        <label for="age">{{ $t("message.age") }}</label>
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="entry.age" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.age.required">{{ $t("message.age_required_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.age.maxlength">{{ $t("message.age_max_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('phone')">
                        <label for="phone">{{ $t("message.phone") }}</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.phone.required">{{ $t("message.phone_required_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">{{ $t("message.email") }}</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.email.required">{{ $t("message.email_required_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.email.email">{{ $t("message.email_format_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label>{{ $t("message.wechat") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechat" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('parentName')">
                        <label for="p-name">{{ $t("message.parent_name") }}</label>
                        <md-input name="p-name" id="p-name" v-model="entry.parentName" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.parentName.required">
                            {{ $t("message.parent_name_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('relationship')">
                        <label for="relationship">{{ $t("message.relation_to_child") }}</label>
                        <md-input name="relationship" id="relationship" v-model="entry.relationship" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.relationship.required">
                            {{ $t("message.relationship_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
            </div>

            <h4>{{ $t("message.questionnaire") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('currentLevel')">
                        <label for="current-level">{{ $t("message.current_level") }}</label>
                        <md-select name="current-level" id="current-level" v-model="entry.currentLevel" md-dense :disabled="sending">
                            <md-option value=LEVEL_ZERO>{{ $t("message.reg_LEVEL_ZERO") }}</md-option>
                            <md-option value=LEVEL_ONE>{{ $t("message.reg_LEVEL_ONE") }}</md-option>
                            <md-option value=LEVEL_TWO>{{ $t("message.reg_LEVEL_TWO") }}</md-option>
                            <md-option value=LEVEL_THREE>{{ $t("message.reg_LEVEL_THREE") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.currentLevel.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('hobby')">
                        <label for="hobby">{{ $t("message.hobby") }}</label>
                        <md-select v-model="entry.hobby" name="hobby" id="hobby" :disabled="sending" multiple>
                            <md-option value="ANIMAL">{{ $t("message.animal") }}</md-option>
                            <md-option value="PLANT">{{ $t("message.plant") }}</md-option>
                            <md-option value="ASTRONOMY">{{ $t("message.astronomy") }}</md-option>
                            <md-option value="ART">{{ $t("message.art") }}</md-option>
                            <md-option value="LITERATURE">{{ $t("message.literature") }}</md-option>
                            <md-option value="NOVEL">{{ $t("message.novel") }}</md-option>
                            <md-option value="ECONOMIC">{{ $t("message.economic") }}</md-option>
                            <md-option value="SOCIAL">{{ $t("message.social") }}</md-option>
                            <md-option value="HISTORY">{{ $t("message.history") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.hobby.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
            </div>

            <h4>{{ $t("message.remarks") }}</h4>
            <div class="md-layout-item md-size-100">
                <md-field :class="getValidationClass('preTimeSlot')">
                    <label for="pre-timeslot">{{ $t("message.question_pre_timeslot") }}</label>
                    <md-input type="text" id="pre-timeslot" name="pre-timeslot" autocomplete="preTimeSlot" v-model="entry.preTimeSlot" :disabled="sending" />                      
                    <span class="md-error" v-if="!$v.entry.preTimeSlot.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label for="remarks">{{ $t("message.remarks") }}({{ $t("message.optional") }})</label>
                        <md-textarea id="remarks" name="remarks" v-model="entry.remarks" :disabled="sending"></md-textarea>                            
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

export default {
  name: "edit-profile-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    entry: {
      type: "child",
      status: 0,
      cnName: null,
      enName: null,
      gender: null,
      age: null,
      parentName: null,
      relationship: null,
      phone: null,
      email: null,
      wechat: null,
      currentLevel: null,
      hobby: [],
      preTimeSlot: null,
      remarks: null
    },
    sending: false,
    entrySaved: false,
    fullName: null
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
      age: {
        required,
        maxLength: maxLength(3)
      },
      parentName: {
        required,
        minLength: minLength(2)
      },
      relationship: {
        required
      },
      phone: {
        required
      },
      email: {
        required,
        email
      },
      currentLevel: {
        required
      },
      hobby: {
        required
      },
      preTimeSlot: {
        required
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
      if (this.tag) {
        this.entry.tag = this.tag;
      }
      this.sending = true;

      var resource = this.$resource("/api/registrations");
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
        message: "试课报名登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.fullName = `${this.entry.cnName}`;
      this.entrySaved = true;
      this.sending = false;
      this.$notify({
        message: "试课报名登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/registrations` });
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
