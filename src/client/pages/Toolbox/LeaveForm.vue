<template>
  <form novalidate class="md-layout" @submit.prevent="validateEntry">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
          <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-50">
                  <h4>请假安排</h4>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-50">
                  <md-switch v-model="oneDayLeave" class="edit-switch">单日请假</md-switch>
              </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="student-name">{{ $t('message.student_name') }}</label>
                    <md-input name="student-name" id="student-name" v-model="entry.studentName" :disabled="sending" type="text"></md-input>
                </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="teacher">{{ $t('message.teacher') }}</label>
                    <md-select name="teacher" id="teacher" v-model="entry.teacherId" md-dense :disabled="sending" >
                        <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">{{teacher.surname?teacher.name+' '+teacher.surname:teacher.name}}</md-option>
                    </md-select>
                </md-field>
            </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>请假开始时间</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-datepicker name="start-date-slot" id="start-date-slot" v-model="startDateSlot" :disabled="sending" md-immediately>
                    <label>日期</label>
                </md-datepicker>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label for="start-day-half">上午／下午</label>
                    <md-select name="start-day-half" id="start-day-half" v-model="startTimeSlot" md-dense :disabled="sending">
                        <md-option value="08:00">上午</md-option>
                        <md-option value="20:00">下午</md-option>
                    </md-select>
                </md-field>
            </div>
          </div>

          <div class="md-layout" v-if="!oneDayLeave">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>请假结束时间</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
          </div>

          <div class="md-layout" v-if="!oneDayLeave">
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-datepicker name="end-date-slot" id="end-date-slot" v-model="endDateSlot" :disabled="sending" md-immediately>
                    <label>日期</label>
                </md-datepicker>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-100">
                <md-field>
                    <label for="end-day-half">上午／下午</label>
                    <md-select name="end-day-half" id="end-day-half" v-model="endTimeSlot" md-dense :disabled="sending">
                        <md-option value="08:00">上午</md-option>
                        <md-option value="20:00">下午</md-option>
                    </md-select>
                </md-field>
            </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>发给老师的请假时间预览</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="teacher-local-time">老师当地开始时间 {{$t(tzUtility.getTranslation(teacherTimezone))}}</label>
                    <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                    :value="entry.startLeaveTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD')" disabled />
                </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50" v-if="!oneDayLeave">
                <md-field>
                    <label for="teacher-local-time">老师当地结束时间 {{$t('message.'+tzUtility.getTranslation(teacherTimezone))}}</label>
                    <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                    :value="entry.endLeaveTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD')" disabled />
                </md-field>
            </div>
          </div>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />

          <div class="md-layout-item md-size-100 text-center">
              <md-button @click="sendEmailToTeacher" class="md-default" :disabled="sending">{{ $t('message.email_to_teacher') }}</md-button>
          </div>
      </div>
  </form>
</template>
<script>
import Vue from "vue";
import tzUtility from "../../utils/tzUtility.js";

export default {
  name: "LeaveForm",
  data: () => ({
    tzUtility: tzUtility,
    entry: {},
    teachers: [],
    oneDayLeave: true,
    teacherTimezone: null,
    startDateSlot: null,
    startTimeSlot: null,
    endDateSlot: null,
    endTimeSlot: null,
    sending: true
  }),
  created() {
    this.fetchTeachers();
  },
  watch: {
    startDateSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    startTimeSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    endDateSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    endTimeSlot: {
      handler(val) {
        this.formatScheduledTime();
      }
    },
    entry: {
      handler(val) {
        this.resetTeacherTimezone();
      },
      deep: true
    }
  },
  methods: {
    validateEntry() {},
    resetTeacherTimezone() {
      for (var i = 0; i < this.teachers.length; i++) {
        var teacher = this.teachers[i];
        if (teacher.ID === this.entry.teacherId) {
          this.teacherTimezone = teacher.timezone;
        }
      }
    },
    formatScheduledTime() {
      this.entry.startLeaveTime = null;
      if (this.startDateSlot && this.startTimeSlot) {
        if (this.startTimeSlot.split(":").length == 2) {
          var hour = parseInt(this.startTimeSlot.split(":")[0]);
          var min = parseInt(this.startTimeSlot.split(":")[1]);
          if (hour >= 0 && hour < 25 && min >= 0 && min < 60) {
            var timestamp =
              new Date(this.startDateSlot).getTime() +
              hour * 60 * 60000 +
              min * 60000;
            this.entry.startLeaveTime = timestamp;
          }
        }
      }

      this.entry.endLeaveTime = null;
      if (this.endDateSlot && this.endTimeSlot) {
        if (this.endTimeSlot.split(":").length == 2) {
          var hour = parseInt(this.endTimeSlot.split(":")[0]);
          var min = parseInt(this.endTimeSlot.split(":")[1]);
          if (hour >= 0 && hour < 25 && min >= 0 && min < 60) {
            var timestamp =
              new Date(this.endDateSlot).getTime() +
              hour * 60 * 60000 +
              min * 60000;
            this.entry.endLeaveTime = timestamp;
          }
        }
      }
    },
    fetchTeachers() {
      var resource = this.$resource("/api/teachers");
      resource.get().then(
        response => {
          this.teachers = response.body;
          this.sending = false;
        },
        response => {
          this.notify("失败", "dange");
          this.sending = false;
        }
      );
    },
    sendEmailToTeacher() {
      this.sending = true;

      if (this.oneDayLeave) {
        this.entry.endLeaveTime = null;
      }

      var resource = this.$resource("/api/tickets/leave-mail");
      resource.save(this.entry).then(
        response => {
          this.notify("成功", "success");
          this.sending = false;
        },
        response => {
          this.notify("失败", "danger");
          this.sending = false;
        }
      );
    },
    notify(message, type) {
      this.$notify({
        message: message,
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: type
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-progress-spinner {
  position: absolute;
  left: 50%;
  top: 280px;
  margin-left: -50px;
  margin-top: -50px;
}
.edit-switch {
  float: right;
}
</style>