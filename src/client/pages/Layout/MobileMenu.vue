<template>
  <ul class="nav nav-mobile-menu">
    <!--li>
      <md-field>
        <label>Search</label>
        <md-input v-model="search" type="text"></md-input>
      </md-field>
    </li>
    <li><a href="#" class="dropdown-toggle" data-toggle="dropdown">
      <i class="material-icons">dashboard</i>
      <p>Dashboard</p></a>
    </li-->
    <li>
      <drop-down>
        <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
          <i class="material-icons">language</i>
          <p>Language</p>
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><a href="#" class="flag-img-link" @click="changeLang('CN')">中文</a></li>
          <li><a href="#" class="flag-img-link" @click="changeLang('EN')">English</a></li>
        </ul>
      </drop-down>
    </li>
    <li>
      <drop-down>
        <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
          <i class="material-icons">person</i>
          <p>Profile</p>
        </a>
        <ul class="dropdown-menu dropdown-menu-right">
          <li><a href="#" @click="logout">登出</a></li>
        </ul>
      </drop-down>
    </li>
  </ul>
</template>
<script>
import { AUTH_LOGOUT } from "store/actions/auth";

export default {
  data() {
    return {
      search: null,
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
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
    },
    changeLang: function(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("rwy-locale", locale);
    }
  }
};
</script>
