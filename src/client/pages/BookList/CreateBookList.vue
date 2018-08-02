<template>
  <div>
    <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" :md-label="$t('message.basic_info')" :md-description="$t('message.mandatory_field')" :md-error="firstStepError" :md-done.sync="first">
        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field :class="getValidationClass('studentId')">
                    <label for="student_id">{{ $t("message.student_id") }}</label>
                    <md-input name="student_id" id="student_id" v-model="bookList.studentId" disabled type="text"></md-input>
                    <span class="md-error" v-if="!$v.bookList.studentId.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field :class="getValidationClass('studentName')">
                    <label for="student_name">{{ $t("message.student_name") }}</label>
                    <md-input name="student_name" id="student_name" v-model="bookList.studentName" disabled type="text"></md-input>
                    <span class="md-error" v-if="!$v.bookList.studentName.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="read-level">{{ $t("message.read_level") }}</label>
                    <md-select name="read-level" id="read-level" v-model="bookList.readLevel" disabled md-dense>
                        <md-option value="0">{{ $t("message.level_0") }}</md-option>
                        <md-option value="10">{{ $t("message.level_10") }}</md-option>
                        <md-option value="20">{{ $t("message.level_20") }}</md-option>
                        <md-option value="30">{{ $t("message.level_30") }}</md-option>
                        <md-option value="40">{{ $t("message.level_40") }}</md-option>
                        <md-option value="50">{{ $t("message.level_50") }}</md-option>
                        <md-option value="60">{{ $t("message.level_60") }}</md-option>
                        <md-option value="70">{{ $t("message.level_70") }}</md-option>
                    </md-select>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field :class="getValidationClass('name')">
                    <label for="book-list-name">{{ $t("message.book_list_name") }}</label>
                    <md-input name="book-list-name" id="book-list-name" v-model="bookList.name" type="text"></md-input>
                    <span class="md-error" v-if="!$v.bookList.name.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field :class="getValidationClass('purpose')">
                    <label for="purpose">{{ $t("message.purpose") }}</label>
                    <md-select name="purpose" id="purpose" v-model="bookList.purpose" md-dense>
                        <md-option value="COURSE">{{ $t("message.course_book") }}</md-option>
                        <md-option value="GIFT">{{ $t("message.gift_book") }}</md-option>
                    </md-select>
                    <span class="md-error" v-if="!$v.bookList.purpose.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field :class="getValidationClass('language')">
                    <label for="language">{{ $t("message.language") }}</label>
                    <md-select name="language" id="language" v-model="bookList.language" md-dense>
                        <md-option value="en">{{ $t("message.en_lang") }}</md-option>
                        <md-option value="cn">{{ $t("message.cn_lang") }}</md-option>
                        <md-option value="es">{{ $t("message.es_lang") }}</md-option>
                    </md-select>
                    <span class="md-helper-text">{{ $t("message.book_list_language_select_hint") }} </span>
                    <span class="md-error" v-if="!$v.bookList.language.required">
                        {{ $t("message.required_validation_error") }}
                    </span>
                </md-field>
            </div>
        </div>
        <md-button class="md-raised md-primary" @click="fistStepDone()">{{ $t("message.continue") }}</md-button>
      </md-step>

      <md-step id="second" :md-label="$t('message.select_book')" :md-description="$t('message.mandatory_field')" :md-error="secondStepError" :md-done.sync="second">
        <book-selector :studentId="bookList.studentId" :levelBaseline="bookList.readLevel" :language="bookList.language" :purpose="bookList.purpose" v-on:books-selected="onBooksSelected($event)">></book-selector>
        <md-button class="md-raised md-primary" @click="secondStepDone('second', 'third')">{{ $t("message.continue") }}</md-button>
      </md-step>

      <md-step id="third" :md-label="$t('message.sending_for_approval')" :md-done.sync="third">
        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>{{ $t("message.basic_info") }}</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
        </div>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.student_id") }}</label>
                    <md-input v-model="bookList.studentId" disabled type="text"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.student_name") }}</label>
                    <md-input v-model="bookList.studentName" disabled type="text"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="read-level">{{ $t("message.read_level") }}</label>
                    <md-select name="read-level" id="read-level" v-model="bookList.readLevel" disabled md-dense>
                        <md-option value="0">{{ $t("message.level_0") }}</md-option>
                        <md-option value="10">{{ $t("message.level_10") }}</md-option>
                        <md-option value="20">{{ $t("message.level_20") }}</md-option>
                        <md-option value="30">{{ $t("message.level_30") }}</md-option>
                        <md-option value="40">{{ $t("message.level_40") }}</md-option>
                        <md-option value="50">{{ $t("message.level_50") }}</md-option>
                        <md-option value="60">{{ $t("message.level_60") }}</md-option>
                        <md-option value="70">{{ $t("message.level_70") }}</md-option>
                    </md-select>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.book_list_name") }}</label>
                    <md-input v-model="bookList.name" disabled type="text"></md-input>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.purpose") }}</label>
                    <md-select name="purpose" id="purpose" v-model="bookList.purpose" disabled md-dense>
                        <md-option value="COURSE">{{ $t("message.course_book") }}</md-option>
                        <md-option value="GIFT">{{ $t("message.gift_book") }}</md-option>
                    </md-select>
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.language") }}</label>
                    <md-select name="language" id="language" v-model="bookList.language" disabled md-dense>
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
            </div>
        </div>

        <div>
          <md-list class="md-triple-line md-dense">
            <md-list-item v-for="book in bookList.books" :key="book.ID">
              <md-icon class="md-default">book</md-icon>

              <div class="md-list-item-text">
                <span>{{book.name}}</span>
                <span>{{book.set}}</span>
                <p>{{$t('message.book_code')}} : {{book.code}} | {{$t('message.book_isbn')}} : {{book.isbn}} | {{$t('message.read_level')}} : {{$t('message.level_'+book.readLevel)}} </p>
              </div>
              <div class="md-list-item-text">
                <md-field>
                  <label for="movie">Movie</label>
                  <md-select v-model="movie" name="movie" id="movie" md-dense>
                    <md-option value="fight-club">Fight Club</md-option>
                    <md-option value="godfather">Godfather</md-option>
                  </md-select>
                </md-field>
              </div>
              <md-button class="md-icon-button md-list-action" @click="removeBook(book)">
                <md-icon>delete</md-icon>
              </md-button>
            </md-list-item>

          </md-list>
        </div>

        <md-button class="md-raised md-primary" @click="thirdStepDoneone('third')">{{ $t("message.submit") }}</md-button>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
import { BookSelector } from "pages";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "CreateBookList",
  mixins: [validationMixin],
  components: {
    BookSelector
  },
  data: () => ({
    active: "first",
    first: false,
    firstStepError: null,
    second: false,
    secondStepError: null,
    third: false,
    bookList: {}
  }),
  validations: {
    bookList: {
      studentId: { required },
      studentName: { required },
      name: { required },
      readLevel: { required },
      language: { required },
      purpose: { required }
    }
  },
  created() {
    this.fetchStudent();
  },
  methods: {
    fistStepDone() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        this.firstStepError = this.$i18n.t("message.error_found_message");
      } else {
        this.firstStepError = null;
        this.first = true;
        this.active = "second";
      }
    },
    secondStepDone() {
      this.second = true;
      this.active = "third";
    },
    thirdStepDoneone() {
      this.third = true;

      this.$resource("/api/booklists")
        .save(this.bookList)
        .then(
          response => this.notifySubmitSuccess(),
          response => this.notifySubmitError()
        );
    },
    getValidationClass(fieldName) {
      const field = this.$v.bookList[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    fetchStudent() {
      var resource = this.$resource("/api/students/" + this.$route.params.id);
      resource.get().then(
        response => {
          //ref to here: https://vuejs.org/v2/guide/reactivity.html directly set the property will not trigger vue to reactive
          this.$set(this.bookList, "studentId", response.body.ID);
          this.$set(this.bookList, "studentName", response.body.enName);
          this.$set(this.bookList, "readLevel", response.body.readLevel + "");
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    onBooksSelected(selectedBooks) {
      this.bookList.books = [];
      selectedBooks.forEach(b => {
        this.bookList.books.push({
          ID: b.ID,
          code: b.code,
          isbn: b.isbn,
          name: b.name,
          set: b.set,
          readLevel: b.readLevel
        });
      });
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
        message: "Failed to get student information！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitError() {
      this.$notify({
        message: "Create book list failed, please try again later.",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.$notify({
        message: "Create book list successfully.",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: "/students/" + this.$route.params.id });
    }
  }
};
</script>