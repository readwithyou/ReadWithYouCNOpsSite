<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <adult-registration-form v-if="type=='adult'" data-background-color="purple" :tag="tag">
        </adult-registration-form>
        <child-registration-form v-if="type=='child'" data-background-color="purple" :tag="tag">
        </child-registration-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  AdultRegistrationForm,
  ChildRegistrationForm
} from 'pages'

export default{
  components: {
    AdultRegistrationForm,
    ChildRegistrationForm
  },
  data() {
    return {
      type: this.$route.query.type,
      tag: this.$route.query.tag
    };
  }
}
</script>
