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
                :value="entry.scheduledTime | moment('timezone', 'Asia/Shanghai', 'YYYY-MM-DD, h:mm:ss a')" disabled />
                <span class="md-error" v-if="!$v.entry.scheduledTime.required">
                    试课时间为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('teacherId')">
                <label for="teacher">老师</label>
                <md-select name="teacher" id="teacher" v-model="entry.teacherId" md-dense :disabled="sending" >
                    <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">{{teacher.name}}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.entry.teacherId.required">
                    老师为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
                <label for="teacher-local-time">老师当地时间 {{teacherTimezone}}</label>
                <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                :value="entry.scheduledTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('zoomLink')">
                <label for="zoom-link">Zoom ID</label>
                <md-input name="zoom-link" id="zoom-link" v-model="entry.zoomLink" :disabled="sending" type="text"></md-input>
                <span class="md-error" v-if="!$v.entry.zoomLink.required">
                    Zoom ID为必填项目。
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('courseRemarks')">
                <label for="course-remarks">学生情况备注</label>
                <md-textarea name="course-remarks" id="course-remarks" v-model="entry.courseRemarks" :disabled="sending"></md-textarea>
                <span class="md-error" v-if="!$v.entry.courseRemarks.required">
                    学生情况备注为必填项目。
                </span>
            </md-field>
        </div>

        <h4>资料文件</h4>
        <div class="md-layout-item md-size-100">
            <Dropzone v-bind:prefix="uploadFilePrefix" @uploaded="onUploaded" @removed="onRemoved">
            </Dropzone>
        </div>
        
        <div class="md-layout-item md-size-100">
          <div v-for="courseFile in entry.courseFiles" :key="courseFile">
            <span>{{courseFile}}</span>
            <a v-on:click="download(courseFile)" :value="courseFile" :disabled="sending">下载</a>
            <a v-on:click="remove(courseFile)" :value="courseFile" :disabled="sending">删除</a>
          </div>
        </div>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <div class="md-layout-item md-size-100 text-center">
          <md-button type="submit" class="md-primary" :disabled="sending">保存</md-button>
          <md-button @click="sendEmail" class="md-default" :disabled="sending">发送邮件</md-button>
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
  data: () => ({
    entry: {
      teacherId: null,
      scheduledTime: null,
      zoomLink: null,
      courseRemarks: null,
      courseFiles: []
    },
    teachers: [],
    teacherTimezone: null,
    dateSlot: null,
    timeSlot: null,
    sending: false,
    entrySaved: false,
    uploadFilePrefix: new Date().getTime()
  }),
  created() {
    this.fetchData();
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
    entry: {
      handler(val) {
        this.teacherTimezone = null;
        for (var i = 0; i < this.teachers.length; i++) {
          var teacher = this.teachers[i];
          if (teacher.ID === this.entry.teacherId) {
            this.teacherTimezone = teacher.timezone;
          }
        }
      },
      deep: true
    }
  },
  validations: {
    entry: {
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
    formatScheduledTime() {
      this.entry.scheduledTime = null;
      if (this.dateSlot && this.timeSlot) {
        if (this.timeSlot.split(":").length == 2) {
          var hour = parseInt(this.timeSlot.split(":")[0]);
          var min = parseInt(this.timeSlot.split(":")[1]);
          if (hour >= 0 && hour < 25 && min >= 0 && min < 60) {
            var timestamp =
              new Date(this.dateSlot).getTime() +
              hour * 60 * 60000 +
              min * 60000;
            this.entry.scheduledTime = timestamp;
          }
        }
      }
    },
    formatDateTimeSlot() {
      if (this.entry.scheduledTime) {
        var fetchedTime = new Date(this.entry.scheduledTime);
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
    fetchData() {
      var resource = this.$resource(
        "/api/registrations/" + this.$route.params.id
      );
      resource.get().then(
        response => {
          this.entry.teacherId = response.body.teacherId;
          this.entry.scheduledTime = response.body.scheduledTime;
          this.entry.zoomLink = response.body.zoomLink;
          this.entry.courseRemarks = response.body.courseRemarks;
          this.entry.courseFiles = response.body.courseFiles
            ? response.body.courseFiles
            : [];
          this.formatDateTimeSlot();
          this.uploadFilePrefix += response.body.ID;
        },
        response => {
          this.notifyFetchingError();
        }
      );
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
    saveEntry() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource(
        "/api/registrations/" + registration + "/schedule"
      );
      resource.save(this.entry).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    sendEmail() {
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
      console.log(filename);
      var formatedFileName = this.uploadFilePrefix + filename;
      console.log(formatedFileName);
      this.entry.courseFiles.push(formatedFileName);
    },
    onRemoved(filename) {
      var formatedFileName = this.uploadFilePrefix + filename;
      this.remove(formatedFileName);
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
      for (var i = this.entry.courseFiles.length - 1; i >= 0; i--) {
        if (this.entry.courseFiles[i] === filename) {
          this.entry.courseFiles.splice(i, 1);
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
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
