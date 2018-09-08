<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card class="md-layout-item md-size-100">
        <md-card-header>
            <div class="md-title">{{ $t("message.course_plan_create_title") }}</div>
            <div class="md-subhead">{{ $t("message.course_plan_create_subtitle") }}</div>
        </md-card-header>

        <md-card-content>
            <h4>{{ $t("message.basic_info") }}</h4>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('studentId')">
                        <label for="student_id">{{ $t("message.student_id") }}</label>
                        <md-input name="student_id" id="student_id" v-model="coursePlan.studentId" disabled type="text"></md-input>
                        <span class="md-error" v-if="!$v.coursePlan.studentId.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('studentName')">
                        <label for="student_name">{{ $t("message.student_name") }}</label>
                        <md-input name="student_name" id="student_name" v-model="coursePlan.studentName" disabled type="text"></md-input>
                        <span class="md-error" v-if="!$v.coursePlan.studentName.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('courseName')">
                        <label for="course_name">{{ $t("message.course_name") }}</label>
                        <md-select v-model="coursePlan.courseName" name="course_name" id="course_name" md-dense :disabled="sending">
                            <md-option v-for="nameString in courseNameStrings" :key="nameString.name" :value="nameString.name">{{ $t(nameString.translation) }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.coursePlan.courseName.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('courseType')">
                        <label for="course_type">{{ $t("message.course_type") }}</label>
                        <md-select v-model="coursePlan.courseType" name="course_type" id="course_type" md-dense :disabled="sending">
                            <md-option v-for="typeString in courseTypeStrings" :key="typeString.type" :value="typeString.type">{{ $t(typeString.translation) }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.coursePlan.courseType.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field :class="getValidationClass('teacherId')">
                        <label for="teacher">{{ $t("message.teacher") }}</label>
                        <md-select name="teacher" id="teacher" v-model="coursePlan.teacherId" md-dense :disabled="sending" >
                            <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">{{ [teacher.name,teacher.surname].join(" ") }}</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.coursePlan.teacherId.required">
                            {{ $t("message.required_validation_error") }}
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label>{{ $t("message.remarks") }}({{ $t("message.optional") }})</label>
                        <md-input v-model="coursePlan.remarks" type="text"></md-input>
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
import { required } from "vuelidate/lib/validators";
import miscUtility from "../../utils/miscUtility.js";

export default {
  name: "course-plan-form",
  mixins: [validationMixin],
  data: () => ({
    coursePlan: {},
    teachers: [],
    sending: false,
    courseNameStrings: miscUtility.courseNameStrings,
    courseTypeStrings: miscUtility.courseTypeStrings
  }),
  validations: {
    coursePlan: {
      studentId: { required },
      studentName: { required },
      courseName: { required },
      courseType: { required },
      teacherId: { required }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.coursePlan[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveCoursePlan();
      }
    },
    saveCoursePlan() {
      this.sending = true;

      this.$resource("/api/course-plans")
        .save(this.coursePlan)
        .then(
          response => this.notifySubmitSuccess(),
          response => this.notifySubmitError()
        );
    },
    fetchData() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body.sort(
            (a, b) => (a.name > b.name ? 1 : -1)
          );
          this.fetchStudent();
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    fetchStudent() {
      var resource = this.$resource("/api/students/" + this.$route.params.id);
      resource.get().then(
        response => {
          //ref to here: https://vuejs.org/v2/guide/reactivity.html directly set the property will not trigger vue to reactive
          this.$set(this.coursePlan, "studentId", response.body.ID);
          this.$set(this.coursePlan, "studentName", response.body.enName);
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: "Fail to create course plan entry. Please try again later!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.sending = false;
      this.$notify({
        message: "Success to create course plan entry!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: "/students/" + this.$route.params.id });
    },
    notifyFetchingError() {
      this.$notify({
        message: "Failed to get student information！",
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
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
