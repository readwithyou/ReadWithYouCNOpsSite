<template>
  <footer class="footer">
    <div class="container">
        <nav>
            <ul>
                <li @click="back" v-if="canGoBack()">
                    <a href="#">
                        <md-icon>arrow_back</md-icon>{{ $t("message.return") }}
                    </a>
                </li>
                <li>
                    <router-link :to="{path:'/dashboard'}">主页</router-link>
                </li>
                <li>
                    <a href="#">
                        Company
                    </a>
                </li>
                <li>
                    <a href="#">
                        Portfolio
                    </a>
                </li>
                <li>
                    <a href="#">
                        Blog
                    </a>
                </li>
            </ul>
        </nav>
        <div class="copyright text-center">
          &copy; {{ new Date().getFullYear() }} <a href="#" target="_blank">Read with You</a>, made with <i class="fa fa-heart heart"></i> for a better world
        </div>
    </div>
  </footer>

</template>
<script>
export default {
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    canGoBack: function() {
      return this.$route.path.toString().split("/").length > 2;
    }
  }
};
</script>
<style>

</style>
