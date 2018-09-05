<template>
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-66 md-size-66">
                <md-card>
                    <md-card-header>
                        <div class="md-title">{{ $t("message.book_" + this.type + "_title") }}</div>
                        <div class="md-subhead">{{ $t("message.book_" + this.type + "_subtitle") }}</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout-item md-size-100">
                            <md-field :class="getValidationClass('description')">
                                <label for="description">{{ $t("message.remarks") }}</label>
                                <md-input type="text" id="description" name="description" autocomplete="description" v-model="entry.description" :disabled="sending" />                      
                                <span class="md-error" v-if="!$v.entry.description.required">
                                    {{ $t("message.required_validation_error") }}
                                </span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field :class="getValidationClass('isbn')">
                                <label for="book-isbn">{{ $t("message.book_isbn") }}</label>
                                <md-input @keydown.enter="onIsbnEnter" name="book-isbn" id="book-isbn" ref='isbnInput' v-model="entry.isbn" :disabled="sending" type="text"></md-input>
                                <span class="md-error" v-if="!$v.entry.isbn.required">{{ $t("message.required_validation_error") }}</span>
                                <span class="md-error" v-else-if="!$v.entry.isbn.minLength">{{ $t("message.minlength_validation_error") }}</span>
                                <span class="md-error" v-else-if="!$v.entry.isbn.maxLength">{{ $t("message.maxlength_validation_error") }}</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field :class="getValidationClass('quantity')">
                                <label for="book-quantity">{{ $t("message.inventory_quantity") }}</label>
                                <md-input @keydown.enter="validateEntry" name="book-quantity" id="book-quantity" ref='quantityInput' v-model.number="entry.quantity" :disabled="sending" type="number"></md-input>
                                <span class="md-error" v-if="!$v.entry.quantity.required">
                                    {{ $t("message.required_validation_error") }}
                                </span>
                            </md-field>
                        </div>
                    </md-card-content>

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                    <div class="md-layout-item md-size-100 text-center">
                        <md-button type="submit" @click="validateEntry" class="md-raised md-primary" :disabled="sending">{{ $t("message.submit") }}</md-button>
                    </div>
                </md-card>
            </div>
            <div class="md-layout-item md-medium-size-33 md-size-33">
                <book-card :book="selectedBook">
                </book-card>
            </div>
        </div>
</template>
<script>
import { BookCard } from "pages";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "book-inventory-form",
  mixins: [validationMixin],
  props: {
    type: {
      type: String,
      default: "inbound"
    }
  },
  components: { BookCard },
  data: () => ({
    entry: {},
    books: [],
    selectedBook: {},
    sending: true
  }),
  validations: {
    entry: {
      isbn: {
        required,
        minLength: minLength(13),
        maxLength: maxLength(13)
      },
      quantity: {
        required
      },
      description: {
        required
      }
    }
  },
  created() {
    this.fetchBooks();
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
    onIsbnEnter(e) {
      this.books.forEach(book => {
        if (book.isbn === this.entry.isbn) {
          this.selectedBook = book;
          this.entry.BookId = book.ID;
          this.entry.type = this.type;
          this.$nextTick(() => {
            this.$refs["quantityInput"].$el.select();
            this.$refs["quantityInput"].$el.focus();
          });
        }
      });
      if (!this.entry.BookId) {
        this.notifyBookNotExistError();
      }
    },
    fetchBooks() {
      var resource = this.$resource("/api/books");
      resource.get().then(response => {
        this.books = response.body;
        this.sending = false;
      });
    },
    saveEntry() {
      this.sending = true;

      var resource = this.$resource("/api/inventory");
      resource.save(this.entry).then(
        response => {
          this.notifySubmitSuccess();
          this.entry.isbn = "";
          this.entry.BookId = "";
          this.selectedBook = {};
          this.$nextTick(() => {
            this.$refs["isbnInput"].$el.focus();
          });
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifyBookNotExistError() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.book_not_exist_error"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.book_" + this.type + "_fail"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.book_" + this.type + "_success"),
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
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
