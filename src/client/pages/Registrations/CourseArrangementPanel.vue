<template>
    <form novalidate class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-datepicker name="date-slot" id="date-slot" v-model="dateSlot" md-immediately>
                <label>选择日期</label>
            </md-datepicker>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
                <label for="time-slot">时间</label>
                <md-select name="time-slot" id="time-slot" v-model="timeSlot" md-dense>
                    <md-option>请选择...</md-option>
                    <md-option value=0>00:00--01:00</md-option>
                    <md-option value=1>01:00--02:00</md-option>
                    <md-option value=2>02:00--03:00</md-option>
                    <md-option value=3>03:00--04:00</md-option>
                    <md-option value=4>04:00--05:00</md-option>
                    <md-option value=5>05:00--06:00</md-option>
                    <md-option value=6>06:00--07:00</md-option>
                    <md-option value=7>07:00--08:00</md-option>
                    <md-option value=8>08:00--09:00</md-option>
                    <md-option value=9>09:00--10:00</md-option>
                    <md-option value=10>10:00--11:00</md-option>
                    <md-option value=11>11:00--12:00</md-option>
                    <md-option value=12>12:00--13:00</md-option>
                    <md-option value=13>13:00--14:00</md-option>
                    <md-option value=14>14:00--15:00</md-option>
                    <md-option value=15>15:00--16:00</md-option>
                    <md-option value=16>16:00--17:00</md-option>
                    <md-option value=17>17:00--18:00</md-option>
                    <md-option value=18>18:00--19:00</md-option>
                    <md-option value=19>19:00--20:00</md-option>
                    <md-option value=20>20:00--21:00</md-option>
                    <md-option value=21>21:00--22:00</md-option>
                    <md-option value=22>22:00--23:00</md-option>
                    <md-option value=23>23:00--24:00</md-option>
                </md-select>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
                <label for="teacher">老师</label>
                <md-select name="teacher" id="teacher" v-model="teacher" md-dense>
                    <md-option>请选择...</md-option>
                    <md-option value="001">Marry</md-option>
                    <md-option value="002">Mike</md-option>
                </md-select>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
                <label for="teacher-local-time">老师当地时间</label>
                <md-input 
                    type="text" 
                    id="teacher-local-time" 
                    name="teacher-local-time" 
                    v-model="teacherLocalTime" 
                    disabled />
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
                <label for="teacher-arrangement">老师当前安排</label>
                <md-input 
                    type="text" 
                    id="teacher-arrangement" 
                    name="teacher-arrangement" 
                    v-model="teacherArrangement" 
                    disabled />
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
                <label for="teacher-timeoff">老师请假安排</label>
                <md-input 
                    type="text" 
                    id="teacher-timeoff" 
                    name="teacher-timeoff" 
                    v-model="teacherTimeOff" 
                    disabled />
            </md-field>
        </div>
        <div class="md-layout-item md-size-100">
            <md-field>
                <label>学生情况备注</label>
                <md-textarea v-model="remarks"></md-textarea>
            </md-field>
        </div>
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-primary" :disabled="sending">提交</md-button>
        </div>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
</template>
<script>
export default {
  name: "CourseArrangementPanel",
  data: () => ({
    dateSlot: null,
    timeSlot: null,
    teacher: null,
    remarks: null,
    teacherLocalTime: null,
    teacherArrangement: null,
    teacherTimeOff: null,
    sending: false
  })
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
