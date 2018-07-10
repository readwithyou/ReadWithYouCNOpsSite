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
                            <label>{{ $t("message.student_id") }}</label>
                            <md-input type="text" v-model="registration.ID" disabled />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.registration_type") }}</label>
                            <md-input type="text" v-if="registration.type==='child'" :value="$t('message.child')" disabled />
                            <md-input type="text" v-else :value="$t('message.adult')" disabled />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.registration_source") }}</label>
                            <md-input type="text" v-model="registration.tag" :disabled="!editting" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('cnName')">
                            <label>{{ $t("message.cn_name") }}</label>
                            <md-input type="text" v-model="registration.cnName" :disabled="!editting" />
                            <span class="md-error" v-if="!$v.registration.cnName.required">
                                {{ $t("message.cn_name_required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.en_name") }}</label>
                            <md-input type="text" v-model="registration.enName" :disabled="!editting" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.registration_time") }}</label>
                            <md-input type="text" :value="registration.createTime | date('%c')" disabled />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('gender')">
                            <label for="gender">{{ $t("message.gender") }}</label>
                            <md-select name="gender" id="gender" v-model="registration.gender" md-dense :disabled="!editting">
                                <md-option value="M">{{ $t("message.male") }}</md-option>
                                <md-option value="F">{{ $t("message.female") }}</md-option>
                            </md-select>
                            <span class="md-error" v-if="!$v.registration.gender.required">
                                {{ $t("message.gender_required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('age')">
                            <label>{{ $t("message.age") }}</label>
                            <md-input type="text" v-model="registration.age" :disabled="!editting" />
                            <span class="md-error" v-if="!$v.registration.age.required">{{ $t("message.age_required_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.registration.age.maxlength">{{ $t("message.age_max_validation_error") }}</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                        <md-field>
                            <label for="p-name">{{ $t("message.parent_name") }}</label>
                            <md-input name="p-name" id="p-name" v-model="registration.parentName" :disabled="!editting" type="text"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33" v-if="registration.type==='child'">
                        <md-field>
                            <label for="relationship">{{ $t("message.relation_to_child") }}</label>
                            <md-input name="relationship" id="relationship" v-model="registration.relationship" :disabled="!editting" type="text"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('phone')">
                            <label>{{ $t("message.phone") }}</label>
                            <md-input type="text" v-model="registration.phone" :disabled="!editting" />
                            <span class="md-error" v-if="!$v.registration.phone.required">{{ $t("message.phone_required_validation_error") }}</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('email')">
                            <label>Email</label>
                            <md-input type="text" v-model="registration.email" :disabled="!editting" />
                            <span class="md-error" v-if="!$v.registration.email.required">{{ $t("message.email_required_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.registration.email.email">{{ $t("message.email_format_validation_error") }}</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.wechat") }}</label>
                            <md-input type="text" v-model="registration.wechat" :disabled="!editting" />
                        </md-field>
                    </div>
                </div>

                <div class="md-layout">
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <h4>{{ $t("message.questionnaire") }}</h4>
                    </div>
                </div>

                <div class="md-layout" v-if="registration.type==='child'">
                    <div class="md-layout-item md-small-size-100 md-size-50">
                        <md-field>
                            <label for="if-read-en-book">{{ $t("message.question_if_child_read_en_book") }}</label>
                            <md-select name="if-read-en-book" id="if-read-en-book" v-model="registration.ifReadEnBook" md-dense :disabled="!editting">
                                <md-option value=true>{{ $t("message.yes") }}</md-option>
                                <md-option value=false>{{ $t("message.no") }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-50">
                        <md-field>
                            <label for="num-book-bought">{{ $t("message.question_num_book_bought") }}</label>
                            <md-input type="number" id="num-book-bought" name="num-book-bought" autocomplete="numBookBought" v-model="registration.numBookBought" :disabled="!editting" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-50">
                        <md-field>
                            <label for="if-read-for-child">{{ $t("message.question_if_read_for_child") }}</label>
                            <md-select name="if-read-for-child" id="if-read-for-child" v-model="registration.ifReadForChild" md-dense :disabled="!editting">
                                <md-option value=true>{{ $t("message.yes") }}</md-option>
                                <md-option value=false>{{ $t("message.no") }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-50">
                        <md-field>
                            <label for="if-intl-education">{{ $t("message.question_if_intl_education") }}</label>
                            <md-select name="if-intl-education" id="if-intl-education" v-model="registration.ifIntlEducation" md-dense :disabled="!editting">
                                <md-option value=true>{{ $t("message.yes") }}</md-option>
                                <md-option value=false>{{ $t("message.no") }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="reading-blocker">{{ $t("message.question_child_reading_blocker") }}</label>
                            <md-textarea id="reading-blocker" name="reading-blocker" v-model="registration.readingBlocker" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="en-book-example">{{ $t("message.question_child_reading_example") }}</label>
                            <md-textarea id="en-book-example" name="en-book-example" v-model="registration.enBookExample" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="expectation">{{ $t("message.question_expectation") }}</label>
                            <md-textarea id="expectation" name="expectation" v-model="registration.expectation" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                </div>

                <div class="md-layout" v-else>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.question_if_read_en_book") }}</label>
                            <md-select name="if-read-en-book" id="if-read-en-book" v-model="registration.ifReadEnBook" md-dense :disabled="!editting">
                                <md-option value=true>{{ $t("message.yes") }}</md-option>
                                <md-option value=false>{{ $t("message.no") }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.question_num_book_bought") }}</label>
                            <md-input type="number" v-model="registration.numBookBought" :disabled="!editting" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label>{{ $t("message.question_num_book_read") }}</label>
                            <md-input type="number" v-model="registration.numBookRead" :disabled="!editting" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="reading-blocker">{{ $t("message.question_reading_blocker") }}</label>
                            <md-textarea id="reading-blocker" name="reading-blocker" v-model="registration.readingBlocker" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="exprience">{{ $t("message.question_exprience") }}</label>
                            <md-textarea id="exprience" name="exprience" v-model="registration.exprience" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="expectation">{{ $t("message.question_expectation") }}</label>
                            <md-textarea id="expectation" name="expectation" v-model="registration.expectation" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100">
                        <md-field>
                            <label for="favBooks">{{ $t("message.question_fav_books") }}</label>
                            <md-textarea id="favBooks" name="favBooks" v-model="registration.favBooks" :disabled="!editting" ></md-textarea>
                        </md-field>
                    </div>
                </div>

                <div class="md-layout">
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <h4>{{ $t("message.other_info") }}</h4>
                    </div>
                </div>

                <div class="md-layout">
                    <div class="md-layout-item md-size-100">
                        <md-field :class="getValidationClass('preTimeSlot')">
                            <label for="pre-timeslot">{{ $t("message.question_pre_timeslot") }}</label>
                            <md-input type="text" id="pre-timeslot" name="pre-timeslot" autocomplete="preTimeSlot" v-model="registration.preTimeSlot" :disabled="!editting" />                      
                            <span class="md-error" v-if="!$v.registration.preTimeSlot.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label>{{ $t("message.remarks") }}</label>
                            <md-input type="text" id="remarks" name="remarks" autocomplete="remarks" v-model="registration.remarks" :disabled="!editting" />
                        </md-field>
                    </div>
                </div>

                <div class="md-layout-item md-size-100 text-center">
                    <md-button type="submit" class="md-primary" :disabled="!editting">{{ $t("message.save") }}</md-button>
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
  name: "RegistrationDetailPanel",
  mixins: [validationMixin],
  props: {
    initialRegistration: Object
  },
  data() {
    return {
      registration: {},
      editting: false
    };
  },
  watch: {
    initialRegistration: function() {
      this.registration = Object.assign({}, this.initialRegistration);
    }
  },
  validations: {
    registration: {
      cnName: {
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
      phone: {
        required
      },
      email: {
        required,
        email
      },
      preTimeSlot: {
        required
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.registration[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveRegistration();
      }
    },
    saveRegistration() {
      this.editting = false;
      var registration = this.$route.params.id;

      var resource = this.$resource("/api/registrations/" + registration);
      resource.update(this.registration).then(
        response => {
          this.notifySubmitSuccess();
          this.$emit("update-registration", this.registration);
        },
        response => {
          this.notifySubmitError();
          this.editting = true;
        }
      );
    },
    notifySubmitError() {
      this.$notify({
        message: "试课报名登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.$notify({
        message: "试课报名登记成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
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
