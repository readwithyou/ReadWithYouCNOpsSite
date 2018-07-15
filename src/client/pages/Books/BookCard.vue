<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
       <img class="img" :src="cardUserImage">
    </div>

    <md-card-content>
      <h6 class="category text-gray">{{ book.set }}</h6>
      <h4 class="card-title">{{ book.name }}</h4>
      <p class="card-description">{{ book.press }}</p>
      <p class="card-description">
        [ {{ $t("message.book_code")}} ] : {{ book.code }}
      </p>
      <p class="card-description">
        [ {{ $t("message.book_isbn")}} ] : {{ book.isbn }}
      </p>
      <p class="card-description">
        [ {{ $t("message.read_level")}} ] : {{ $t("message.level_" + book.level) }}
      </p>
      <p class="card-description">
        [ {{ $t("message.priority")}} ] : {{ $t("message.priority_" + book.priority) }}
      </p>
      <md-button @click="openBook" class="md-round md-default">Open</md-button>
    </md-card-content>
  </md-card>
</template>
<script>
export default {
  name: "user-card",
  props: {
    cardUserImage: {
      type: String,
      default: require("assets/img/faces/book.jpeg")
    },
    book: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  methods: {
    openBook() {
      if (this.book.ID) {
        this.$router.push({ path: "/books/" + this.book.ID });
      }
    }
  }
};
</script>
<style>
</style>
