<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <can I="read" a="profile">
          <edit-profile-form></edit-profile-form>
        </can>
      </div>
    </div>
  </div>
</template>

<script>
import { Can } from "@casl/vue";
import { EditProfileForm } from "pages";

export default {
  components: {
    Can,
    EditProfileForm
  }
};
</script>
