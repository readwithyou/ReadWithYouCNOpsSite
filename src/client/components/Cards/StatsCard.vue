<template>
  <md-card :class="getStyleClass()" id="stats-cards">
    <md-card-header>
      <md-card-header-text>
        <slot name="content"></slot>
      </md-card-header-text>

      <md-card-media>
        <slot name="header"></slot>
      </md-card-media>
    </md-card-header>

    <md-card-actions>
      <slot name="footer"></slot>
    </md-card-actions>
  </md-card>
</template>
<script>
export default {
  name: "stats-card",
  props: {
    theme: {
      type: String,
      default: ""
    }
  },
  methods: {
    getStyleClass() {
      return this.theme + "-theme";
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  margin-bottom: 20px;
  vertical-align: top;
}
#stats-cards {
  color: #fff;
}
.md-card.orange-theme {
  background-color: orange;
}
.md-card.purple-theme {
  background-color: #9c27b0;
}
.md-card.green-theme {
  background-color: #4caf50;
}
.md-card.blue-theme {
  background-color: #448aff;
}
.md-card.red-theme {
  background-color: #ff5252;
}
</style>