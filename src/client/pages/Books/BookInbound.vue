<template>
    <div class="content">
        <Book-Inventory-Form type="inbound">
        </Book-Inventory-Form>
    </div>
</template>
<script>
import { BookInventoryForm } from "pages";
export default {
  name: "book-inventory-form",
  components: { BookInventoryForm }
};
</script>