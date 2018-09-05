<template>
  <md-card class="md-card-profile">
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">{{ book.name }}</div>
        <div class="md-subhead">{{ book.set }}</div>
      </md-card-header-text>

      <md-card-media>
        <img :src="cardUserImage">
      </md-card-media>
    </md-card-header>

    <md-card-content>
      <p class="card-description">{{ book.press }}</p>
      <p class="card-description">
        [ {{ $t("message.book_code")}} ] : {{ book.code }}
      </p>
      <p class="card-description">
        [ {{ $t("message.book_isbn")}} ] : {{ book.isbn }}
      </p>
      <p class="card-description">
        [ {{ $t("message.read_level")}} ] : {{ $t("message.level_" + book.readLevel) }}
      </p>
      <p class="card-description">
        [ {{ $t("message.priority")}} ] : {{ $t("message.priority_" + book.priority) }}
      </p>
    </md-card-content>

    <md-card-actions>
      <md-button @click="openBook" class="md-round md-default">Open</md-button>
    </md-card-actions>
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
