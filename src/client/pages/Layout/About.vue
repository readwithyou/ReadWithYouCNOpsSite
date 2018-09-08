<template>
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100 md-medium-size-66 md-size-50 card-parent">
        <md-card class="md-card-example">
          <md-card-area md-inset>
            <md-card-media md-ratio="16:9">
              <img :src="dashboardImg" alt="Coffee House">
            </md-card-media>

            <md-card-content>
              <h2 class="md-title">
                Read With You
                <img :src="imgLogo" class="logo-mini" alt="">
              </h2>
              <div class="md-subhead">
                <span>Welcome to Read With You OPS Site! We hope you enjoy it for your daily work! </span>
              </div>
            </md-card-content>

            <md-card-content>
              <md-icon>mail</md-icon><a href="mailto: readwithyou@sina.com">Email us</a> if any suggestions!
            </md-card-content>
          </md-card-area>
        </md-card>
      </div>
    </div>
</template>

<script>
export default {
  name: "ImgDashBoard",
  props: {
    dashboardImg: {
      type: String,
      default: require("assets/img/welcome.png")
    },
    imgLogo: {
      type: String,
      default: require("assets/img/nlogo.jpg")
    }
  }
};
</script>

<style lang="scss" scoped>
.logo-mini {
  height: 20px;
  width: 20px;
  margin-bottom: 8px;
}

.card-parent{
  margin: 8% auto;
}

.md-card {
  width: 100%;
  display: inline-block;
}

.md-card-example {
  .md-subhead {
    .md-icon {
      $size: 16px;

      width: $size;
      min-width: $size;
      height: $size;
      font-size: $size !important;
    }

    span {
      vertical-align: middle;
    }
  }

  .card-reservation {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .md-icon {
      margin: 8px;
    }
  }

  .md-button-group {
    display: flex;

    .md-button {
      min-width: 60px;
      border-radius: 2px;
    }
  }
}
</style>