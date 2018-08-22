<template>
  <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>{{ $t("message.timezone_query") }}</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
        </div>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="timezone">{{ $t("message.time_zone") }}</label>
                    <md-select name="timezone" id="timezone" v-model="selectedTimeZone" md-dense>
                        <md-option v-for="tzString in tzUtility.tzStrings" :key="tzString.tz" :value="tzString.tz">{{ $t(tzString.translation) }}</md-option>
                    </md-select>
                </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.current_local_time") }}</label>
                    <md-input type="text" :value="new Date().getTime() | moment('timezone', selectedTimeZone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
                </md-field>
            </div>
        </div>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <h4>老师时区查询</h4>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
            </div>
        </div>

        <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="teacher">{{ $t('message.teacher') }}</label>
                    <md-select name="teacher" id="teacher" v-model="selectedTeacherID" md-dense>
                        <md-option v-for="teacher in teachers" :key="teacher.ID" :value="teacher.ID">
                            {{teacher.surname?teacher.name+' '+teacher.surname:teacher.name}}
                        </md-option>
                    </md-select>
                </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label for="timezone">{{ $t("message.time_zone") }}</label>
                    <md-select name="timezone" id="timezone" v-model="selectedTeacherTimeZone" md-dense disabled>
                        <md-option v-for="tzString in tzUtility.tzStrings" :key="tzString.tz" :value="tzString.tz">{{ $t(tzString.translation) }}</md-option>
                    </md-select>
                </md-field>
            </div>

            <div class="md-layout-item md-small-size-100 md-size-50">
                <md-field>
                    <label>{{ $t("message.current_local_time") }}</label>
                    <md-input type="text" :value="new Date().getTime() | moment('timezone', selectedTeacherTimeZone, 'YYYY-MM-DD, h:mm:ss a')" disabled />
                </md-field>
            </div>
        </div>
    </div>
  </form>
</template>
<script>
import Vue from "vue";
import tzUtility from "../../utils/tzUtility.js";

export default {
  name: "TimeZonePanel",
  data: () => ({
    tzUtility: tzUtility,
    selectedTimeZone: null,
    selectedTeacherID: null,
    selectedTeacherTimeZone: null,
    teachers: []
  }),
  created() {
    this.fetchTeachers();
  },
  watch: {
    selectedTeacherID: {
      handler(val) {
        for (var i = 0; i < this.teachers.length; i++) {
          var teacher = this.teachers[i];
          if (teacher.ID === this.selectedTeacherID) {
            this.selectedTeacherTimeZone = teacher.timezone;
          }
        }
      }
    }
  },
  methods: {
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
    }
  }
};
</script>