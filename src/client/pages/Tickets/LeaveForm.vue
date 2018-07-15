<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <form novalidate class="md-layout" @submit.prevent="validateEntry">    
            <md-card>
                <md-card-header data-background-color="purple">
                    <h4 class="title">请假邮件表</h4>
                    <p class="category">填写相应信息发送请假邮件给老师。</p>
                </md-card-header>

                <md-card-content>
                    <h4>请假安排</h4>

                  <div class="md-layout-item md-small-size-100 md-size-100">
                      <md-field>
                          <label for="student-name">学生姓名</label>
                          <md-input name="student-name" id="student-name" v-model="entry.studentName" :disabled="sending" type="text"></md-input>
                      </md-field>
                  </div>

                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="teacher">老师</label>
                            <md-select name="teacher" id="teacher" v-model="entry.teacherId" md-dense :disabled="sending" >
                                <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">{{teacher.name}}</md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <h4>请假开始时间</h4>

                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-datepicker name="start-date-slot" id="start-date-slot" v-model="startDateSlot" :disabled="sending" md-immediately>
                            <label>日期</label>
                        </md-datepicker>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="start-time-slot">时间(hh:mm)</label>
                            <md-input type="text" id="start-time-slot" name="start-time-slot" v-model="startTimeSlot" :disabled="sending" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="start-leave-time">请假开始时间（请先选择日期和时间）</label>
                            <md-input type="text" id="start-leave-time" name="start-leave-time" 
                            :value="entry.startLeaveTime | moment('timezone', 'Asia/Shanghai', 'YYYY-MM-DD, h:mm:ss a')" disabled />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="teacher-local-time">老师当地时间 {{teacherTimezone}}</label>
                            <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                            :value="entry.startLeaveTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
                        </md-field>
                    </div>

                    <h4>请假结束时间</h4>

                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-datepicker name="end-date-slot" id="end-date-slot" v-model="endDateSlot" :disabled="sending" md-immediately>
                            <label>日期</label>
                        </md-datepicker>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="end-time-slot">时间(hh:mm)</label>
                            <md-input type="text" id="end-time-slot" name="end-time-slot" v-model="endTimeSlot" :disabled="sending" />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="end-leave-time">请假结束时间（请先选择日期和时间）</label>
                            <md-input type="text" id="end-leave-time" name="end-leave-time" 
                            :value="entry.endLeaveTime | moment('timezone', 'Asia/Shanghai', 'YYYY-MM-DD, h:mm:ss a')" disabled />
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-100">
                        <md-field>
                            <label for="teacher-local-time">老师当地时间 {{teacherTimezone}}</label>
                            <md-input type="text" id="teacher-local-time" name="teacher-local-time" 
                            :value="entry.endLeaveTime | moment('timezone', teacherTimezone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
                        </md-field>
                    </div>
                </md-card-content>

                <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>

                <div class="md-layout-item md-size-100 text-center">
                    <md-button @click="sendEmailToTeacher" class="md-default" :disabled="sending">邮件老师</md-button>
                </div>
            </md-card>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  name: "LeaveForm",
  data: () => ({
    entry: {},
    teachers: [],
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
          this.notify('失败', 'dange');
          this.sending = false;
        }
      );
    },
    sendEmailToTeacher() {
      this.sending = true;

      var resource = this.$resource("/api/tickets/leave-mail");
      resource.save(this.entry).then(
        response => {
          this.notify('成功', 'success');
          this.sending = false;
        },
        response => {
          this.notify('失败', 'dange');
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
  top: 880px;
  margin-left: -50px;
  margin-top: -50px;
}
</style>