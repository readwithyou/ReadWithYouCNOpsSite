<template>
  <div class="content">
    <div class="md-layout">
      <can I="create" a="book">
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <book-form data-background-color="purple">
          </book-form>
        </div>
      </can>
    </div>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { BookForm } from "pages";

export default {
  components: {
    Can,
    BookForm
  }
};
</script>
