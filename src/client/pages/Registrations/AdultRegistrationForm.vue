<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
            <h4 class="title">{{ $t("message.adult_registrations_card_title") }}</h4>
            <p class="category">{{ $t("message.adult_registrations_card_subtitle") }}</p>
        </md-card-header>

        <md-card-content>
            <h4>{{ $t("message.basic_info") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('cnName')">
                        <label for="cn-name">{{ $t("message.cn_name") }}</label>
                        <md-input name="cn-name" id="cn-name" v-model="entry.cnName" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.cnName.required">
                            {{ $t("message.cn_name_required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.en_name") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.enName" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">{{ $t("message.gender") }}</label>
                        <md-select name="gender" id="gender" v-model="entry.gender" md-dense :disabled="sending">
                            <md-option>{{ $t("message.select_hint") }}</md-option>
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
                        <span class="md-error" v-if="!$v.entry.age.required">{{ $t("message.age_required_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.age.maxlength">{{ $t("message.age_max_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('phone')">
                        <label for="phone">{{ $t("message.phone") }}</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.phone.required">{{ $t("message.phone_required_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">{{ $t("message.email") }}</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.email.required">{{ $t("message.email_required_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.email.email">{{ $t("message.email_format_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>{{ $t("message.wechat") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="entry.wechat" type="text"></md-input>
                    </md-field>
                </div>
            </div>

            <h4>{{ $t("message.questionnaire") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('ifReadEnBook')">
                        <label for="if-read-en-book">{{ $t("message.question_if_read_en_book") }}</label>
                        <md-select name="if-read-en-book" id="if-read-en-book" v-model="entry.ifReadEnBookInStr" md-dense :disabled="sending">
                            <md-option>{{ $t("message.select_hint") }}</md-option>
                            <md-option value="true">{{ $t("message.yes") }}</md-option>
                            <md-option value="false">{{ $t("message.no") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.ifReadEnBook.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('numBookBought')">
                        <label for="num-book-bought">{{ $t("message.question_num_book_bought") }}</label>
                        <md-input type="number" id="num-book-bought" name="num-book-bought" autocomplete="numBookBought" v-model="entry.numBookBought" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.numBookBought.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('numBookRead')">
                        <label for="num-book-read">{{ $t("message.question_num_book_read") }}</label>
                        <md-input type="number" id="num-book-read" name="num-book-read" autocomplete="numBookRead" v-model="entry.numBookRead" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.numBookRead.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('readingBlocker')">
                        <label for="reading-blocker">{{ $t("message.question_reading_blocker") }}</label>
                        <md-textarea id="reading-blocker" name="reading-blocker" v-model="entry.readingBlocker" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.readingBlocker.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('exprience')">
                        <label for="exprience">{{ $t("message.question_exprience") }}</label>
                        <md-textarea id="exprience" name="exprience" v-model="entry.exprience" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.exprience.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('expectation')">
                        <label for="expectation">{{ $t("message.question_expectation") }}</label>
                        <md-textarea id="expectation" name="expectation" v-model="entry.expectation" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.expectation.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('favBooks')">
                        <label for="favBooks">{{ $t("message.question_fav_books") }}</label>
                        <md-textarea id="favBooks" name="favBooks" v-model="entry.favBooks" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.favBooks.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
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
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('preTimeSlot')">
                        <label for="pre-timeslot">{{ $t("message.question_pre_timeslot") }}</label>
                        <md-input type="text" id="pre-timeslot" name="pre-timeslot" autocomplete="preTimeSlot" v-model="entry.preTimeSlot" :disabled="sending" />                      
                        <span class="md-error" v-if="!$v.entry.preTimeSlot.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
            </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-primary" :disabled="sending">{{ $t("message.submit") }}</md-button>
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
      type: "adult",
      status: 0,
      cnName: null,
      enName: null,
      gender: null,
      age: null,
      phone: null,
      email: null,
      wechat: null,
      ifReadEnBookInStr: null,
      ifReadEnBook: false,
      numBookBought: null,
      numBookRead: null,
      readingBlocker: null,
      exprience: null,
      expectation: null,
      favBooks: null,
      preTimeSlot: null
    },
    sending: false,
    entrySaved: false,
    fullName: null
  }),
  watch: {
    entry: {
      handler(val) {
        this.entry.ifReadEnBook = val.ifReadEnBookInStr === "true";
      },
      deep: true
    }
  },
  validations: {
    entry: {
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
      ifReadEnBook: {
        required
      },
      numBookBought: {
        required
      },
      numBookRead: {
        required
      },
      readingBlocker: {
        required
      },
      exprience: {
        required
      },
      expectation: {
        required
      },
      favBooks: {
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
