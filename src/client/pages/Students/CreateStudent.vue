<template>
  <div class="content">
    <div class="md-layout">
      <can I="create" a="student">
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <student-form data-background-color="purple">
          </student-form>
        </div>
      </can>
    </div>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { StudentForm } from "pages";

export default {
  components: {
    Can,
    StudentForm
  }
};
</script>
