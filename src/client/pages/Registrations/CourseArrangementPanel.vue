<template>
    <form novalidate class="md-layout" @submit.prevent="validateEntry">
        <h4>试课安排</h4>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-datepicker name="date-slot" id="date-slot" v-model="dateSlot" :disabled="sending" md-immediately>
                <label>选择日期</label>
            </md-datepicker>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
                <label for="time-slot">时间(hh:mm)</label>
                <md-input type="text" id="time-slot" name="time-slot" v-model="timeSlot" :disabled="sending" />
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('scheduledTime')">
                <label for="scheduled-time">试课时间（请先选择日期和时间）</label>
                <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                :value="registration.scheduledTime | moment('timezone', 'Asia/Shanghai', 'YYYY-MM-DD, h:mm:ss a')" disabled />
                <span class="md-error" v-if="!$v.registration.scheduledTime.required">
                    试课时间为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('teacherId')">
                <label for="teacher">老师</label>
                <md-select name="teacher" id="teacher" v-model="registration.teacherId" md-dense :disabled="sending" >
                    <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">{{teacher.surname?teacher.name+' '+teacher.surname:teacher.name}}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.registration.teacherId.required">
                    老师为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
                <label for="teacher-local-time">老师当地时间 {{teacherTimezone}}</label>
                <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                :value="registration.scheduledTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('zoomLink')">
                <label for="zoom-link">Zoom ID</label>
                <md-input name="zoom-link" id="zoom-link" v-model="registration.zoomLink" :disabled="sending" type="text"></md-input>
                <span class="md-error" v-if="!$v.registration.zoomLink.required">
                    Zoom ID为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('courseRemarks')">
                <label for="course-remarks">学员情况备注</label>
                <md-textarea name="course-remarks" id="course-remarks" v-model="registration.courseRemarks" :disabled="sending"></md-textarea>
                <span class="md-error" v-if="!$v.registration.courseRemarks.required">
                    学员情况备注为必填项目。
                </span>
            </md-field>
        </div>

        <h4>资料文件</h4>
        <div class="md-layout-item md-size-100">
            <Dropzone v-bind:prefix="uploadFilePrefix" @uploaded="onUploaded" @removed="onRemoved">
            </Dropzone>
        </div>
        
        <div class="md-layout-item md-size-100">
          <div v-for="courseFile in registration.courseFiles" :key="courseFile">
            <span>{{courseFile}}</span>
            <a v-on:click="download(courseFile)" :value="courseFile" :disabled="sending">下载</a>
            <a v-on:click="remove(courseFile)" :value="courseFile" :disabled="sending">删除</a>
          </div>
        </div>
        <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>
        <div class="md-layout-item md-size-100 text-center">
          <md-button type="submit" class="md-primary" :disabled="sending">保存</md-button>
          <md-button @click="sendEmailToStudent" class="md-default" :disabled="sending">邮件学员</md-button>
          <md-button @click="sendEmailToTeacher" class="md-default" :disabled="sending">邮件老师</md-button>
        </div>
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

import { Dropzone } from "components";

export default {
  name: "CourseArrangementPanel",
  mixins: [validationMixin],
  components: {
    Dropzone
  },
  props: {
    initialRegistration: Object
  },
  data: () => ({
    teachers: [],
    registration: {},
    teacherTimezone: null,
    dateSlot: null,
    timeSlot: null,
    sending: false,
    entrySaved: false,
    uploadFilePrefix: new Date().getTime()
  }),
  created() {
    this.fetchTeachers();
  },
  watch: {
    dateSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    timeSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    initialRegistration: function() {
      this.registration = Object.assign({}, this.initialRegistration);
      this.formatDateTimeSlot();
    },
    teachers: {
      handler(val) {
        this.resetTeacherTimezone();
      }
    },
    registration: {
      handler(val) {
        this.resetTeacherTimezone();
      },
      deep: true
    }
  },
  validations: {
    registration: {
      scheduledTime: {
        required
      },
      teacherId: {
        required
      },
      zoomLink: {
        required
      },
      courseRemarks: {
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
    resetTeacherTimezone() {
      for (var i = 0; i < this.teachers.length; i++) {
        var teacher = this.teachers[i];
        if (teacher.ID === this.registration.teacherId) {
          this.teacherTimezone = teacher.timezone;
        }
      }
    },
    formatScheduledTime() {
      this.registration.scheduledTime = null;
      if (this.dateSlot && this.timeSlot) {
        if (this.timeSlot.split(":").length == 2) {
          var hour = parseInt(this.timeSlot.split(":")[0]);
          var min = parseInt(this.timeSlot.split(":")[1]);
          if (hour >= 0 && hour < 25 && min >= 0 && min < 60) {
            var timestamp =
              new Date(this.dateSlot).getTime() +
              hour * 60 * 60000 +
              min * 60000;
            this.registration.scheduledTime = timestamp;
          }
        }
      }
    },
    formatDateTimeSlot() {
      if (this.registration.scheduledTime) {
        var fetchedTime = new Date(this.registration.scheduledTime);
        this.dateSlot = fetchedTime.toLocaleDateString();

        var hour =
          fetchedTime.getHours() < 10
            ? "0" + fetchedTime.getHours()
            : fetchedTime.getHours();
        var min =
          fetchedTime.getMinutes() < 10
            ? "0" + fetchedTime.getMinutes()
            : fetchedTime.getMinutes();
        this.timeSlot = hour + ":" + min;
      }
    },
    fetchTeachers() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    saveRegistration() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource("/api/registrations/" + registration);
      resource.update(this.registration).then(
        response => {
          this.notifySubmitSuccess();
          this.$emit("update-registration", this.registration);
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    sendEmailToStudent() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource(
        "/api/registrations/" + registration + "/student-scheduling-mail"
      );
      resource.save().then(
        response => {
          this.notifyMailSuccess();
        },
        response => {
          this.notifyMailError();
        }
      );
    },
    sendEmailToTeacher() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource(
        "/api/registrations/" + registration + "/teacher-scheduling-mail"
      );
      resource.save().then(
        response => {
          this.notifyMailSuccess();
        },
        response => {
          this.notifyMailError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "服务器端获取老师数据失败！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: "试课课程安排失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.entrySaved = true;
      this.sending = false;
      this.$notify({
        message: "试课课程安排成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    notifyMailError() {
      this.sending = false;
      this.$notify({
        message: "邮件发送失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifyMailSuccess() {
      this.sending = false;
      this.$notify({
        message: "邮件发送成功！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
    },
    onUploaded(filename) {
      var formatedFileName = this.uploadFilePrefix + filename;
      this.registration.courseFiles.push(formatedFileName);
    },
    onRemoved(filename) {
      var formatedFileName = this.uploadFilePrefix + filename;
      this.registration.courseFiles.remove(formatedFileName);
    },
    download(filename) {
      Vue.http
        .post("/api/registrations/download-url", { filePath: filename })
        .then(response => {
          this.downloadURI(response.data.url, filename);
        })
        .catch(err => {
          console.log("Failed to get an S3 signed download URL", err);
        });
    },
    remove(filename) {
      for (var i = this.registration.courseFiles.length - 1; i >= 0; i--) {
        if (this.registration.courseFiles[i] === filename) {
          this.registration.courseFiles.splice(i, 1);
        }
      }
    },
    downloadURI(sUrl) {
      var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
      var isSafari = navigator.userAgent.toLowerCase().indexOf("safari") > -1;
      //iOS devices do not support downloading. We have to inform user about this.
      if (/(iP)/g.test(navigator.userAgent)) {
        //alert('Your device does not support files downloading. Please try again in desktop browser.');
        window.open(sUrl, "_blank");
        return false;
      }

      //If in Chrome or Safari - download via virtual link click
      if (isChrome || isSafari) {
        //Creating new link node.
        var link = document.createElement("a");
        link.href = sUrl;
        link.setAttribute("target", "_blank");

        if (link.download !== undefined) {
          //Set HTML5 download attribute. This will prevent file from opening if supported.
          var fileName = sUrl.substring(sUrl.lastIndexOf("/") + 1, sUrl.length);
          link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
          var e = document.createEvent("MouseEvents");
          e.initEvent("click", true, true);
          link.dispatchEvent(e);
          return true;
        }
      }

      // Force file download (whether supported by server).
      if (sUrl.indexOf("?") === -1) {
        sUrl += "?download";
      }

      window.open(sUrl, "_blank");
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.md-progress-spinner {
  position: absolute;
  left: 150%;
  top: 280px;
  margin-left: -50px;
  margin-top: -50px;
}
</style>