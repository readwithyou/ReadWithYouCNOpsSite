<template>
        <div class="md-layout">
            <md-dialog :md-active.sync="showAddDialog">
                <md-dialog-content>
                    <book-selector 
                        :studentId="bookList.studentId" 
                        :levelBaseline="bookList.readLevel" 
                        :language="bookList.language" 
                        :purpose="bookList.purpose" 
                        v-on:books-selected="onBooksSelected($event)">
                    </book-selector>    
                </md-dialog-content>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="showAddDialog = false">{{ $t("message.confirm") }}</md-button>
                </md-dialog-actions>
            </md-dialog>

            <md-dialog :md-active.sync="showOutboundDialog">
                <md-dialog-title>{{ $t("message.outbound") }}</md-dialog-title>
                <md-dialog-content>
                    <md-field :class="getValidationClass('expressNo')">
                        <label>{{ $t("message.delivery_number") }}</label>
                        <md-input v-model="outboundRecord.expressNo" type="text"></md-input>
                        <span class="md-error" v-if="!$v.outboundRecord.expressNo.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                    <md-field :class="getValidationClass('isbn')">
                        <label>{{ $t("message.book_isbn") }}</label>
                        <md-input v-model="outboundRecord.isbn" type="text"></md-input>
                        <span class="md-error" v-if="!$v.outboundRecord.isbn.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                        <span class="md-error" v-else-if="!$v.outboundRecord.isbn.containsBookInBookList">
                            {{ $t("message.book_not_exist_in_book_list_error") }}
                        </span>
                    </md-field>
                </md-dialog-content>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="outboundBook">{{ $t("message.confirm") }}</md-button>
                    <md-button class="md-default" @click="showOutboundDialog = false;">{{ $t("message.complete") }}</md-button>
                </md-dialog-actions>
            </md-dialog>

            <md-dialog :md-active.sync="showProgressDialog">
                <md-dialog-title>{{ $t("message.set_progress_info") }}</md-dialog-title>
                <md-dialog-content>
                    <md-field>
                        <label>{{ $t("message.set_progress_info") }}</label>
                        <md-input v-model="readingProgress" type="number"></md-input>
                    </md-field>
                </md-dialog-content>
                <md-dialog-actions>
                    <md-button class="md-primary" @click="setReadingProgress(activeBook, readingProgress);">{{ $t("message.confirm") }}</md-button>
                </md-dialog-actions>
            </md-dialog>

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
                                <md-switch v-model="editting" class="edit-switch" v-if="bookList.status === 'PENDING_FOR_APPROVAL' || bookList.status === 'REJECTED'">
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
                                    <label for="read-level">{{ $t("message.read_level") }}</label>
                                    <md-select name="read-level" id="read-level" v-model="bookList.readLevel" disabled  md-dense>
                                        <md-option v-for="levelString in levelStrings" :key="levelString.level" :value="levelString.level">
                                            {{ $t(levelString.translation) }}
                                        </md-option>
                                    </md-select>
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
                                    <label for="purpose">{{ $t("message.purpose") }}</label>
                                    <md-select name="purpose" id="purpose" v-model="bookList.purpose" disabled md-dense>
                                        <md-option value="COURSE">{{ $t("message.course_book") }}</md-option>
                                        <md-option value="SHORT_COURSE">{{ $t("message.short_course_book") }}</md-option>
                                        <md-option value="GIFT">{{ $t("message.gift_book") }}</md-option>
                                    </md-select>
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
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.selected_books") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <a @click="showAddDialog = true" class="add-link" v-if="editting">{{ $t("message.add") }}</a>
                                <can I="outbound" a="book">
                                    <a @click="showOutboundDialog = true" class="add-link" v-if="ableToDeliver()">{{ $t("message.outbound") }}</a>
                                </can>
                            </div>
                        </div>

                        <div>
                        <md-list class="md-double-line md-dense">
                            <md-list-item v-for="book in bookList.books" :key="book.ID">
                                <md-icon class="md-default">book</md-icon>

                                <div class="md-list-item-text">
                                    <span class="md-body-2">{{book.name}}&nbsp;&nbsp;<span class="md-body-1">[{{ $t("message."+book.type+"_type") }}]</span></span>
                                    <span>{{book.set}} | {{$t('message.book_code')}} : {{book.code}} | {{$t('message.book_isbn')}} : {{book.isbn}} | {{$t('message.level_'+book.readLevel)}} </span>
                                    <span>
                                        {{$t('message.reading_progress')}} : {{book.readingProgress? book.readingProgress : 0 }} | 
                                        {{$t('message.delivery_number')}} : {{book.expressNo? book.expressNo: '---'}} 
                                    </span>
                                </div>

                                <div class="md-list-action" v-if="editting">
                                    <md-menu md-size="small">
                                        <md-button class="md-icon-button md-dense md-raised md-default" md-menu-trigger>
                                            <md-icon>edit</md-icon>
                                        </md-button>
                                        <md-menu-content>
                                            <md-menu-item @click="setBookType(book, 'TEXTBOOK')">
                                                <md-icon>bookmark</md-icon>
                                                <span>{{ $t("message.set_TEXTBOOK_type") }}</span>
                                            </md-menu-item>
                                            <md-menu-item @click="setBookType(book, 'EX_READING')">
                                                <md-icon>bookmark_border</md-icon>
                                                <span>{{ $t("message.set_EX_READING_type") }}</span>
                                            </md-menu-item>
                                            <md-menu-item @click="removeBook(book)">
                                                <md-icon>delete</md-icon>
                                                <span>{{ $t("message.delete") }}</span>
                                            </md-menu-item>
                                        </md-menu-content>
                                    </md-menu>
                                </div>

                                <div class="md-list-action" v-if="!editting">
                                    <md-button class="md-icon-button md-dense md-raised md-default" @click="activeBook = book; showProgressDialog = true">
                                        <md-icon>data_usage</md-icon>
                                        <md-tooltip>{{ $t("message.set_progress_info") }}</md-tooltip>
                                    </md-button>
                                    <md-button class="md-icon-button md-dense md-raised md-default" v-if="bookList.status !== 'FINISHED'" @click="openEBook(book.ID);">
                                        <md-icon>launch</md-icon>
                                        <md-tooltip>{{ $t("message.open_book") }}</md-tooltip>
                                    </md-button>
                                </div>
                            </md-list-item>

                        </md-list>
                        </div>
                    </md-card-content>

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                    <div class="md-layout-item md-size-100 text-center">
                        <md-button @click="saveBookList" class="md-primary" :disabled="sending" v-if="editting">{{ $t("message.submit") }}</md-button>
                    </div>
                </md-card>
            </div>
            <div class="md-layout-item md-medium-size-100 md-size-33">
                <md-card>
                    <md-card-content>
                        <h4>{{ $t("message.correspondence_card_title") }}</h4>
                        <div class="md-layout" v-for="reply in bookList.correspondence" :key="reply.time">
                            <div class="md-layout-item md-size-20">
                                <md-avatar class="md-avatar-icon">{{reply.by.charAt(0).toUpperCase()}}</md-avatar>
                            </div>
                            <div class="md-layout-item md-size-80">
                                <span class="md-body-1">{{ reply.by }}</span>
                                <span class="md-body-1">{{ $t("message.action_" + reply.action) }}</span>
                                <span class="md-caption">{{ reply.time ? new Date(reply.time).toLocaleString():'' }}</span>
                                <md-divider></md-divider>
                                <p class="md-body-2 correspondence-content">{{ reply.content }}</p>
                            </div>
                        </div>
                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <md-field>
                                    <label for="comments">{{ $t("message.review_comments") }}</label>
                                    <md-textarea id="comments" name="comments" v-model="comments" :disabled="sending"></md-textarea>                  
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout-item md-size-100 text-center">
                            <md-button @click="reply" class="md-round md-default" :disabled="sending">{{ $t("message.reply") }}</md-button>
                            <can I="review" a="bookList">
                                <md-button @click="reject" class="md-round md-default" v-if="ableToReject()" :disabled="sending">{{ $t("message.reject") }}</md-button>
                                <md-button @click="approve" class="md-round md-default" v-if="ableToApprove()" :disabled="sending">{{ $t("message.approve") }}</md-button>
                            </can>
                            <can I="outbound" a="book">
                                <md-button @click="delivered" class="md-round md-default" v-if="ableToDeliver()" :disabled="sending">{{ $t("message.mark_delivered") }}</md-button>
                            </can>
                            <md-button @click="finished" class="md-round md-default" v-if="ableToFinish()" :disabled="sending">{{ $t("message.mark_finished") }}</md-button>
                        </div>
                    </md-card-content>
                </md-card>
            </div>
        </div>
</template>
<script>
import Vue from "vue";
import { Can } from "@casl/vue";
import { BookSelector } from "pages";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import miscUtility from "../../utils/miscUtility.js";

function containsBookInBookList(value) {
  return (
    this.bookList.books
      .filter(b => !b.expressNo)
      .map(b => b.isbn)
      .indexOf(value) !== -1
  );
}

export default {
  name: "book-list-form",
  mixins: [validationMixin],
  components: {
    Can,
    BookSelector
  },
  data: () => ({
    editting: false,
    sending: false,
    showAddDialog: false,
    showOutboundDialog: false,
    showProgressDialog: false,
    readingProgress: null,
    comments: null,
    outboundRecord: {
      expressNo: null,
      isbn: null
    },
    bookList: { books: [] },
    levelStrings: miscUtility.levelStrings
  }),
  validations: {
    outboundRecord: {
      expressNo: { required },
      isbn: { required, containsBookInBookList }
    }
  },
  created() {
    this.fetchBookList();
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.outboundRecord[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
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
    setBookType(book, type) {
      var i = this.findBookIndex(book);

      if (i != -1) {
        this.bookList.books[i].type = type;
        this.$set(this, "bookList", this.bookList);
      }
    },
    outboundBook() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        Vue.http
          .post(
            "/api/booklists/" + this.bookList.ID + "/outbound",
            this.outboundRecord
          )
          .then(response => {
            this.notifyOutboundSuccess();

            this.bookList = response.body;
            this.$set(this, "bookList", this.bookList);
            this.outboundRecord.isbn = null;
          })
          .catch(err => {
            this.notifyOutboundError();
          });
      }
    },
    setReadingProgress(book, readingProgress) {
      var i = this.findBookIndex(book);

      if (i != -1) {
        this.bookList.books[i].readingProgress = readingProgress;
        this.$set(this, "bookList", this.bookList);
        this.saveBookList();
      }

      this.showProgressDialog = false;
      this.readingProgress = null;
    },
    removeBook(book) {
      var i = this.findBookIndex(book);

      if (i != -1) {
        this.bookList.books.splice(i, 1);
        this.$set(this, "bookList", this.bookList);
      }
    },
    findBookIndex(book) {
      var i = -1;

      this.bookList.books.forEach(b => {
        if (b.ID === book.ID) {
          i = this.bookList.books.indexOf(b);
        }
      });

      return i;
    },
    reply() {
      if (!this.comments) {
        return;
      }
      this.review("REPLY");
    },
    reject() {
      this.review("REJECT");
    },
    approve() {
      this.review("APPROVE");
    },
    delivered() {
      this.review("DELIVERED");
    },
    finished() {
      this.review("FINISHED");
    },
    review(action) {
      this.editting = false;
      this.sending = true;

      let url = "/api/booklists/" + this.$route.params.bookListId + "/review";
      this.$resource(url)
        .save({ comments: this.comments, action: action })
        .then(
          response => {
            this.bookList = response.body;
            this.comments = null;
            this.notifySubmitSuccess();
          },
          response => {
            this.notifySubmitError();
          }
        );
    },
    ableToReject() {
      return (
        this.bookList.status === "PENDING_FOR_APPROVAL" ||
        this.bookList.status === "PENDING_FOR_DELIVERY"
      );
    },
    ableToApprove() {
      return (
        this.bookList.status === "PENDING_FOR_APPROVAL" ||
        this.bookList.status === "REJECTED"
      );
    },
    ableToDeliver() {
      return this.bookList.status === "PENDING_FOR_DELIVERY";
    },
    ableToFinish() {
      return this.bookList.status === "DELIVERED";
    },
    onBooksSelected(selectedBooks) {
      selectedBooks.forEach(b => {
        var i = this.findBookIndex(b);
        if (i === -1) {
          this.bookList.books.push({
            ID: b.ID,
            code: b.code,
            isbn: b.isbn,
            name: b.name,
            set: b.set,
            readLevel: b.readLevel,
            type: "TEXTBOOK"
          });
        }
      });
    },
    openEBook(bookId) {
      /*
      var urlArray = window.location.href.split("#")[0].split("/");
      urlArray.pop();
      var url = urlArray.join("/") + "/preview.html?id=" + bookId;
      window.open(url, "_blank");
      */

      var resource = this.$resource("/api/books/" + bookId);
      resource.get().then(
        response => {
          let url = response.body.ebookUrl;
          window.open(url, "_blank");
        },
        response => {
          this.notifyFetchingError();
        }
      );
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
    },
    notifyOutboundSuccess() {
      this.$notify({
        message: this.$i18n.t("message.book_outbound_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    notifyOutboundError() {
      this.$notify({
        message: this.$i18n.t("message.book_outbound_fail"),
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
.edit-switch {
  float: right;
}
.add-link {
  margin-top: 12px;
  float: right;
}
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
