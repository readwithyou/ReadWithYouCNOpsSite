<template>
    <form novalidate class="md-layout" @submit.prevent="saveRegistration">
        <md-dialog-confirm
          :md-active.sync="promotionDialogActive"
          :md-title="$t('message.confirm')"
          :md-content="$t('message.confirm_promotion_message')"
          :md-confirm-text="$t('message.confirm')"
          :md-cancel-text="$t('message.cancel')"
          @md-cancel="onCancelPromotion"
          @md-confirm="onConfirmPromotion" />
        <h4>试课报告</h4>
        <div class="md-layout-item md-size-100">
            <Dropzone v-bind:prefix="uploadFilePrefix" @uploaded="onUploaded" @removed="onRemoved">
            </Dropzone>
        </div>
        
        <div class="md-layout-item md-size-100">
          <div v-for="courseFile in registration.courseResultFiles" :key="courseFile">
            <span>{{courseFile}}</span>
            <a v-on:click="download(courseFile)" :value="courseFile" :disabled="sending">下载</a>
            <a v-on:click="remove(courseFile)" :value="courseFile" :disabled="sending">删除</a>
          </div>
        </div>

        <div class="md-layout-item md-size-100">
            <md-field>
                <label>审核意见</label>
                <md-textarea v-model="registration.resultRemarks"></md-textarea>
            </md-field>
        </div>

        <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>

        <div class="md-layout-item md-size-100 text-center">
          <md-button type="submit" class="md-raised md-primary" :disabled="sending">{{ $t("message.save") }}</md-button>
          <md-button @click="promoteStudent" class="md-default" :disabled="sending">{{ $t("message.promote_student") }}</md-button>
          <md-button @click="sendEmailToStudent" class="md-default" :disabled="sending">{{ $t("message.email_to_student") }}</md-button>
          <md-button @click="sendEmailToTeacher" class="md-default" :disabled="sending">{{ $t("message.email_to_teacher") }}</md-button>
        </div>
    </form>
</template>
<script>
import Vue from "vue";
import { Dropzone } from "components";

export default {
  name: "CourseResultPanel",
  components: {
    Dropzone
  },
  props: {
    initialRegistration: Object
  },
  data: () => ({
    registration: {},
    uploadFilePrefix: new Date().getTime(),
    sending: false,
    promotionDialogActive: false
  }),
  watch: {
    initialRegistration: function() {
      this.registration = Object.assign({}, this.initialRegistration);
    }
  },
  methods: {
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
    promoteStudent() {
      this.promotionDialogActive = true;
    },
    onConfirmPromotion() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource(
        "/api/registrations/" + registration + "/promote"
      );
      resource.save().then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    onCancelPromotion() {
      this.promotionDialogActive = false;
    },
    sendEmailToStudent() {
      this.sending = true;
      var registration = this.$route.params.id;

      var resource = this.$resource(
        "/api/registrations/" + registration + "/student-report-mail"
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
        "/api/registrations/" + registration + "/teacher-report-mail"
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
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: "提交失败，请稍后重试！",
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
        message: "提交成功！",
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
      this.registration.courseResultFiles.push(formatedFileName);
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
      for (
        var i = this.registration.courseResultFiles.length - 1;
        i >= 0;
        i--
      ) {
        if (this.registration.courseResultFiles[i] === filename) {
          this.registration.courseResultFiles.splice(i, 1);
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
  left: 250%;
  top: 280px;
  margin-left: -50px;
  margin-top: -50px;
}
</style>