<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">
          <md-button class="md-icon-button md-dense md-raised md-default" @click="back" v-if="canGoBack()">
            <md-icon>arrow_back</md-icon>
          </md-button>&nbsp;
          {{$route.name}}
        </h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-just-icon md-simple md-toolbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-autocomplete">
            <md-autocomplete class="search" v-model="selectedEmployee" :md-options="employees">
              <label>Search...</label>
            </md-autocomplete>
          </div>
          <md-list>
            <md-list-item :to="getCurrentUrl()" class="dropdown">
              <drop-down>
                <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="material-icons">language</i>
                  <p class="hidden-lg hidden-md">Language</p>
                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li>
                    <a :href="getCurrentUrl()" class="flag-img-link" @click="changeLang('CN')"><img :src="cnflag" class="flag-img" alt="">中文</a>
                  </li>
                  <li>
                    <a :href="getCurrentUrl()" class="flag-img-link" @click="changeLang('EN')"><img :src="enflag" class="flag-img" alt="">English</a>
                  </li>
                </ul>
              </drop-down>
            </md-list-item>
            <md-list-item :to="getCurrentUrl()" class="dropdown">
              <drop-down>
                <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="material-icons">person</i>
                  <p class="hidden-lg hidden-md">Profile</p>
                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li><a href="#" @click="logout">登出</a></li>
                </ul>
              </drop-down>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>

  </md-toolbar>
</template>

<script>
import { AUTH_LOGOUT } from "store/actions/auth";

export default {
  props: {
    cnflag: {
      type: String,
      default: require("assets/img/Flag_of_China.png")
    },
    enflag: {
      type: String,
      default: require("assets/img/Flag_of_USA.png")
    }
  },
  data() {
    return {
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone"
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    back: function() {
      this.$router.go(-1);
    },
    canGoBack: function() {
      return this.$route.path.toString().split("/").length > 2;
    },
    changeLang: function(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("rwy-locale", locale);
    },
    getCurrentUrl: function(){
      return window.location.href.split("#")[1];
    }
  }
};
</script>
<style lang="css">
.flag-img {
  width: 20px;
  margin-right: 5px;
}
</style>
