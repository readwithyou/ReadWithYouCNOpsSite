<template>
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-size-66">
                <md-card>
                    <md-card-header data-background-color="purple">
                        <h4 class="title">{{ $t("message.book_list_card_title") }}</h4>
                        <p class="category">{{ $t("message.book_list_card_subtitle") }}</p>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.basic_info") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-switch v-model="editting" class="edit-switch" 
                                    v-if="bookList.status==='PENDING_FOR_APPROVAL' || bookList.status==='REJECTED'">
                                    {{ $t("message.edit") }}
                                </md-switch>
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-33">
                                <md-field>
                                    <label>{{ $t("message.student_id") }}</label>
                                    <md-input v-model="bookList.studentId" disabled type="text"></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-33">
                                <md-field>
                                    <label>{{ $t("message.student_name") }}</label>
                                    <md-input v-model="bookList.studentName" disabled  type="text"></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-33">
                                <md-field>
                                    <label>{{ $t("message.book_list_name") }}</label>
                                    <md-input v-model="bookList.name" :disabled="!editting"  type="text"></md-input>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-33">
                                <md-field>
                                    <label>{{ $t("message.language") }}</label>
                                    <md-select name="language" id="language" v-model="bookList.language" disabled  md-dense>
                                        <md-option value="en">{{ $t("message.en_lang") }}</md-option>
                                        <md-option value="cn">{{ $t("message.cn_lang") }}</md-option>
                                        <md-option value="es">{{ $t("message.es_lang") }}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-33">
                                <md-field>
                                    <label for="read-level">{{ $t("message.read_level") }}</label>
                                    <md-select name="read-level" id="read-level" v-model="bookList.readLevel" disabled  md-dense>                                
                                        <md-option value="10">{{ $t("message.level_10") }}</md-option>
                                        <md-option value="20">{{ $t("message.level_20") }}</md-option>
                                        <md-option value="30">{{ $t("message.level_30") }}</md-option>
                                        <md-option value="40">{{ $t("message.level_40") }}</md-option>
                                        <md-option value="50">{{ $t("message.level_50") }}</md-option>
                                        <md-option value="60">{{ $t("message.level_60") }}</md-option>
                                        <md-option value="65">{{ $t("message.level_65") }}</md-option>
                                        <md-option value="70">{{ $t("message.level_70") }}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.selected_books") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                            </div>
                        </div>

                        <div>
                        <md-list class="md-double-line md-dense">
                            <md-list-item v-for="book in bookList.books" :key="book.ID">
                            <md-icon class="md-default">book</md-icon>

                            <div class="md-list-item-text">
                                <span>{{book.name}}</span>
                                <span>{{book.set}} | {{$t('message.book_code')}} : {{book.code}} | {{$t('message.book_isbn')}} : {{book.isbn}} </span>
                            </div>

                            <md-button class="md-icon-button md-list-action" :disabled="!editting" @click="removeBook(book)">
                                <md-icon>delete</md-icon>
                            </md-button>
                            </md-list-item>

                        </md-list>
                        </div>
                    </md-card-content>

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                    <div class="md-layout-item md-size-100 text-center">
                        <md-button @click="validateEntry" class="md-primary" :disabled="sending||!editting">{{ $t("message.submit") }}</md-button>
                    </div>
                </md-card>
            </div>
            <div class="md-layout-item md-medium-size-100 md-size-33">
                <md-card>
                    <md-card-content>
                        <h4>{{ $t("message.review_history_card_title") }}</h4>
                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <md-field>
                                    <label for="comments">{{ $t("message.review_comments") }}</label>
                                    <md-textarea id="comments" name="comments"></md-textarea>                  
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout-item md-size-100 text-center">
                            <md-button class="md-round md-default">{{ $t("message.submit") }}</md-button>
                        </div>
                    </md-card-content>
                </md-card>
            </div>
        </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "book-list-form",
  mixins: [validationMixin],
  data: () => ({
    editting: false,
    sending: false,
    bookList: {}
  }),
  validations: {
    bookList: {
      studentId: { required },
      studentName: { required },
      name: { required },
      readLevel: { required },
      language: { required }
    }
  },
  validations: {},
  created() {
    this.fetchBookList();
  },
  methods: {
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveBookList();
      }
    },
    saveBookList() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource("/api/booklists/" + this.bookList.ID);
      resource.update(this.bookList).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    fetchBookList() {
      var resource = this.$resource(
        "/api/booklists/" + this.$route.params.bookListId
      );
      resource.get().then(
        response => {
          this.bookList = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    removeBook(book) {
      var i = -1;
      this.bookList.books.forEach(b => {
        if (b.ID === book.ID) {
          i = this.bookList.books.indexOf(b);
        }
      });

      if (i != -1) {
        this.bookList.books.splice(i, 1);
        this.$set(this.bookList, "bookList", this.bookList);
      }
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to get book list information！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
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
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-switch {
  float: right;
}
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
