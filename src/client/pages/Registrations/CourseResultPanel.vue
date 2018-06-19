<template>
    <form novalidate class="md-layout">
        <div class="md-layout-item md-size-100">
            <md-field>
                <label>课程报告下载</label>
                <md-textarea v-model="reviewComments"></md-textarea>
            </md-field>
        </div>
        <div class="md-layout-item md-size-100">
            <md-field>
                <label>审核意见</label>
                <md-textarea v-model="reviewComments"></md-textarea>
            </md-field>
        </div>
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-error" :disabled="sending">审核不通过</md-button>
            <md-button type="submit" class="md-primary" :disabled="sending">发布给学员</md-button>
        </div>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </form>
</template>
<script>
export default {
  name: "CourseResultPanel",
  data: () => ({
    reviewComments: null,
    sending: false,
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
