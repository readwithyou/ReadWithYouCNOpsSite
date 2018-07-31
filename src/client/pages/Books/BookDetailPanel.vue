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
                        <md-field :class="getValidationClass('code')">
                            <label for="book-code">{{ $t("message.book_code") }}</label>
                            <md-input name="book-code" id="book-code" v-model="entry.code" :disabled="!editting" type="text"></md-input>
                            <span class="md-error" v-if="!$v.entry.code.required">{{ $t("message.required_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.entry.code.minLength">{{ $t("message.minlength_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.entry.code.maxLength">{{ $t("message.maxlength_validation_error") }}</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('name')">
                            <label for="book-name">{{ $t("message.book_name") }}</label>
                            <md-input name="book-name" id="book-name" v-model="entry.name" :disabled="!editting" type="text"></md-input>
                            <span class="md-error" v-if="!$v.entry.name.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('set')">
                            <label for="book-set">{{ $t("message.book_set") }}</label>
                            <md-input name="book-set" id="book-set" v-model="entry.set" :disabled="!editting" type="text"></md-input>
                            <span class="md-error" v-if="!$v.entry.set.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('language')">
                            <label for="language">{{ $t("message.language") }}</label>
                            <md-select name="language" id="language" v-model="entry.language" md-dense :disabled="!editting">
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
                            <md-input name="book-press" id="book-press" v-model="entry.press" :disabled="!editting" type="text"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('isbn')">
                            <label for="book-isbn">{{ $t("message.book_isbn") }}</label>
                            <md-input name="book-isbn" id="book-isbn" v-model="entry.isbn" :disabled="!editting" type="text"></md-input>
                            <span class="md-error" v-if="!$v.entry.isbn.required">{{ $t("message.required_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.entry.isbn.minLength">{{ $t("message.minlength_validation_error") }}</span>
                            <span class="md-error" v-else-if="!$v.entry.isbn.maxLength">{{ $t("message.maxlength_validation_error") }}</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('price')">
                            <label for="book-price">{{ $t("message.book_price") }}</label>
                            <md-input name="book-price" id="book-price" v-model="entry.price" :disabled="!editting" type="number"></md-input>
                            <md-icon>attach_money</md-icon>
                            <span class="md-error" v-if="!$v.entry.price.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label for="inventory-quantity">{{ $t("message.inventory_quantity") }}</label>
                            <md-input name="inventory-quantity" id="inventory-quantity" v-model="entry.quantity" disabled type="number"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label for="locked-price">{{ $t("message.locked_quantity") }}</label>
                            <md-input name="locked-quantity" id="locked-quantity" v-model="entry.locked" disabled type="number"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('readLevel')">
                            <label for="book-level">{{ $t("message.read_level") }}</label>
                            <md-select name="book-level" id="book-level" v-model="entry.readLevel" md-dense :disabled="!editting">
                                <md-option value="999">{{ $t("message.level_999") }}</md-option>
                                <md-option value="0">{{ $t("message.level_0") }}</md-option>                                
                                <md-option value="10">{{ $t("message.level_10") }}</md-option>
                                <md-option value="20">{{ $t("message.level_20") }}</md-option>
                                <md-option value="30">{{ $t("message.level_30") }}</md-option>
                                <md-option value="40">{{ $t("message.level_40") }}</md-option>
                                <md-option value="50">{{ $t("message.level_50") }}</md-option>
                                <md-option value="60">{{ $t("message.level_60") }}</md-option>
                                <md-option value="70">{{ $t("message.level_70") }}</md-option>
                                <md-option value="75">{{ $t("message.level_75") }}</md-option>
                            </md-select>
                            <span class="md-error" v-if="!$v.entry.readLevel.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('priority')">
                            <label for="book-priority">{{ $t("message.priority") }}</label>
                            <md-select name="book-priority" id="book-priority" v-model="entry.priority" md-dense :disabled="!editting">
                                <md-option value="RECOMMENDED">{{ $t("message.priority_RECOMMENDED") }}</md-option>
                                <md-option value="OPTIONAL">{{ $t("message.priority_OPTIONAL") }}</md-option>
                                <md-option value="NONRECOMMENDED">{{ $t("message.priority_NONRECOMMENDED") }}</md-option>
                                <md-option value="UNAVAILABLE">{{ $t("message.priority_UNAVAILABLE") }}</md-option>
                            </md-select>
                            <span class="md-error" v-if="!$v.entry.priority.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field :class="getValidationClass('ebookUrl')">
                            <label for="book-url">{{ $t("message.ebook_url") }}</label>
                            <md-input name="book-url" id="book-url" v-model="entry.ebookUrl" :disabled="!editting" type="text"></md-input>
                            <span class="md-error" v-if="!$v.entry.ebookUrl.required">
                                {{ $t("message.required_validation_error") }}
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                        <md-field>
                            <label for="book-retail-url">{{ $t("message.book_retail_url") }}</label>
                            <md-input name="book-retail-url" id="book-retail-url" v-model="entry.retailUrl" :disabled="!editting" type="text"></md-input>
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
                        <md-field>
                            <label for="remarks">{{ $t("message.remarks") }}({{ $t("message.optional") }})</label>
                            <md-textarea id="remarks" name="remarks" v-model="entry.description" :disabled="!editting"></md-textarea>                
                        </md-field>
                    </div>
                </div>
            </div>

            <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>

            <div class="md-layout-item md-size-100 text-center">
                <md-button type="submit" class="md-primary" :disabled="!editting">{{ $t("message.save") }}</md-button>
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
  name: "book-detail-panel",
  mixins: [validationMixin],
  data: () => ({
    entry: {},
    editting: false,
    sending: false
  }),
  validations: {
    entry: {
      code: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(4)
      },
      name: {
        required
      },
      set: {
        required
      },
      isbn: {
        required,
        minLength: minLength(13),
        maxLength: maxLength(13)
      },
      price: {
        required
      },
      ebookUrl: {
        required
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
      var resource = this.$resource("/api/books/" + this.$route.params.id);
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

      var resource = this.$resource("/api/books/" + this.entry.ID);
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
        message: this.$i18n.t("message.book_update_fail"),
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
        message: this.$i18n.t("message.book_update_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.sending = false;
    },
    notifyFetchingError() {
      this.$notify({
        message: this.$i18n.t("message.book_fetch_success"),
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
