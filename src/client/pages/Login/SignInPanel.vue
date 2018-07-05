<template>
  <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('username')">
                <md-icon>face</md-icon>
                <label for="username">{{ $t("message.username") }}</label>
                <md-input name="username" id="username" v-model="username" :disabled="sending" type="text"></md-input>
                <span class="md-error" v-if="!$v.username.required">
                  {{ $t("message.username_required_validation_error") }}
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('password')">
                <md-icon>lock_open</md-icon>
                <label for="password">{{ $t("message.password") }}</label>
                <md-input name="password" id="password" v-model="password" :disabled="sending" type="password"></md-input>
                <span class="md-error" v-if="!$v.password.required">
                  {{ $t("message.password_required_validation_error") }}
                </span>                                
            </md-field>
        </div>
    </div>
    <div class="md-layout-item md-size-100 text-center">
        <md-button type="submit" class="md-primary" :disabled="sending">{{ $t("message.confirm") }}</md-button>
    </div>
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { AUTH_REQUEST } from "store/actions/auth";

export default {
  name: "SignInPanel",
  mixins: [validationMixin],
  data() {
    return {
      username: null,
      password: null,
      sending: false
    };
  },
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry: function() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.login();
      }
    },
    login: function() {
      this.sending = true;
      const { username, password } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { username, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch(err => {
          this.sending = false;
          this.$notify({
            message: this.$i18n.t('message.signin_error'),
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger"
          });
        });
    }
  }
};
</script>