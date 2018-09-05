<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card class="md-layout-item md-size-100">
        <md-card-header>
            <div class="md-title">{{ $t("message.book_create_title") }}</div>
            <div class="md-subhead">{{ $t("message.book_create_subtitle") }}</div>
        </md-card-header>

        <md-card-content>
            <h4>{{ $t("message.basic_info") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('code')">
                        <label for="book-code">{{ $t("message.book_code") }}</label>
                        <md-input name="book-code" id="book-code" v-model="entry.code" :disabled="sending" type="text"></md-input>
                        <md-button class="md-icon-button" v-if="entry.readLevel && entry.readLevel !== '999'" @click="generateCode()">
                            <md-icon>refresh</md-icon>
                        </md-button>
                        <span class="md-error" v-if="!$v.entry.code.minLength">{{ $t("message.minlength_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.code.maxLength">{{ $t("message.maxlength_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('name')">
                        <label for="book-name">{{ $t("message.book_name") }}</label>
                        <md-input name="book-name" id="book-name" v-model="entry.name" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.name.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="book-set">{{ $t("message.book_set") }}</label>
                        <md-input name="book-set" id="book-set" v-model="entry.set" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('language')">
                        <label for="language">{{ $t("message.language") }}</label>
                        <md-select name="language" id="language" v-model="entry.language" md-dense> 
                            <md-option value="en">{{ $t("message.en_lang") }}</md-option>
                            <md-option value="cn">{{ $t("message.cn_lang") }}</md-option>
                            <md-option value="es">{{ $t("message.es_lang") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.language.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="book-press">{{ $t("message.book_press") }}</label>
                        <md-input name="book-press" id="book-press" v-model="entry.press" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('isbn')">
                        <label for="book-isbn">{{ $t("message.book_isbn") }}</label>
                        <md-input name="book-isbn" id="book-isbn" v-model="entry.isbn" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.isbn.required">{{ $t("message.required_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.isbn.minLength">{{ $t("message.minlength_validation_error") }}</span>
                        <span class="md-error" v-else-if="!$v.entry.isbn.maxLength">{{ $t("message.maxlength_validation_error") }}</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('readLevel')">
                        <label for="book-level">{{ $t("message.read_level") }}</label>
                        <md-select name="book-level" id="book-level" v-model="entry.readLevel" md-dense :disabled="sending">
                            <md-option v-for="levelString in levelStrings" :key="levelString.level" :value="levelString.level">
                                {{ $t(levelString.translation) }}
                            </md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.readLevel.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('priority')">
                        <label for="book-priority">{{ $t("message.priority") }}</label>
                        <md-select name="book-priority" id="book-priority" v-model="entry.priority" md-dense :disabled="sending">
                            <md-option v-for="priorityString in priorityStrings" :key="priorityString.name" :value="priorityString.name">
                                {{ $t(priorityString.translation) }}
                            </md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.priority.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="tag">{{ $t("message.tag") }}</label>
                        <md-select v-model="entry.tag" name="tag" id="tag" multiple md-dense :disabled="sending">
                            <md-option v-for="tagString in bookTagStrings" :key="tagString.name" :value="tagString.name">{{ $t(tagString.translation) }}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label for="book-url">{{ $t("message.ebook_url") }}</label>
                        <md-input name="book-url" id="book-url" v-model="entry.ebookUrl" :disabled="sending" type="text"></md-input>
                    </md-field>
                </div>
            </div>

            <h4>{{ $t("message.other_info") }}</h4>
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label for="remarks">{{ $t("message.remarks") }}({{ $t("message.optional") }})</label>
                        <md-textarea id="remarks" name="remarks" v-model="entry.description" :disabled="sending" ></md-textarea>                 
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
import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import miscUtility from "../../utils/miscUtility.js";

export default {
  name: "edit-book-form",
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
      tag: []
    },
    sending: false,
    levelStrings: miscUtility.levelStrings,
    priorityStrings: miscUtility.priorityStrings,
    bookTagStrings: miscUtility.courseNameStrings,
  }),
  validations: {
    entry: {
      code: {
        minLength: minLength(4),
        maxLength: maxLength(4)
      },
      name: {
        required
      },
      isbn: {
        required,
        minLength: minLength(13),
        maxLength: maxLength(13)
      },
      readLevel: {
        required
      },
      priority: {
        required
      },
      language: {
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
      this.sending = true;

      var resource = this.$resource("/api/books");
      resource.save(this.entry).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    generateCode() {
      Vue.http
        .post("/api/books/generate-code", {
          level: Number(this.entry.readLevel)
        })
        .then(response => {
          this.$set(this.entry, "code", response.body.code);
        });
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.book_create_fail"),
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
        message: this.$i18n.t("message.book_create_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/books` });
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
