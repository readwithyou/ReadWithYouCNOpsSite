<template>
  <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('username')">
                <md-icon>face</md-icon>
                <label for="signon-username">{{ $t("message.username") }}</label>
                <md-input name="signon-username" id="signon-username" v-model="entry.username" :disabled="sending" type="text"></md-input>
                <span class="md-error" v-if="!$v.entry.username.required">
                  {{ $t("message.username_required_validation_error") }}
                </span>               
                 <span class="md-error" v-if="!$v.entry.username.alphaNum">
                  {{ $t("message.alphanumerics_validation_error") }}
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('name')">
                <md-icon>person</md-icon>
                <label for="signon-name">{{ $t("message.name") }}</label>
                <md-input name="signon-name" id="signon-name" v-model="entry.name" :disabled="sending" type="text"></md-input>
                <span class="md-error" v-if="!$v.entry.name.required">
                  {{ $t("message.name_required_validation_error") }}
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('email')">
                <md-icon>mail</md-icon>
                <label for="email">{{ $t("message.email") }}</label>
                <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                <span class="md-error" v-if="!$v.entry.email.required">{{ $t("message.email_required_validation_error") }}</span>
                <span class="md-error" v-else-if="!$v.entry.email.email">{{ $t("message.email_format_validation_error") }}</span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('group')">
                <md-icon>group</md-icon>
                <label for="s-group">{{ $t("message.group") }}</label>
                <md-select name="group" id="group" v-model="entry.group" md-dense :disabled="sending">
                    <md-option value="sales">{{ $t("message.sales") }}</md-option>
                    <md-option value="ops_admin">{{ $t("message.ops_admin") }}</md-option>
                    <md-option value="ops">{{ $t("message.ops") }}</md-option>
                    <md-option value="teacher_admin">{{ $t("message.teacher_admin") }}</md-option>
                    <md-option value="teacher">{{ $t("message.teacher") }}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.entry.group.required">
                    {{ $t("message.group_required_validation_error") }}
                </span>
            </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('password')">
                <md-icon>lock_open</md-icon>
                <label for="signon-password">{{ $t("message.password") }}</label>
                <md-input name="signon-password" id="signon-password" v-model="entry.password" :disabled="sending" type="password"></md-input>
                <span class="md-error" v-if="!$v.entry.password.required">
                  {{ $t("message.password_required_validation_error") }}
                </span>                                
            </md-field>
        </div>
    </div>
    <div class="md-layout-item md-size-100 text-center">
        <md-button type="submit" class="md-primary" :disabled="sending">{{ $t("message.submit") }}</md-button>
    </div>
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, alphaNum, email } from "vuelidate/lib/validators";
import { AUTH_REQUEST } from "store/actions";

export default {
  name: "SignInPanel",
  mixins: [validationMixin],
  data() {
    return {
      entry: {
        username: null,
        name: null,
        email: null,
        group: null,
        password: null
      },
      sending: false
    };
  },
  validations: {
    entry: {
      username: {
        required,
        alphaNum
      },
      name: {
        required
      },
      email: {
        required,
        email
      },
      group: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.entry[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry: function() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.signon();
      }
    },
    signon: function() {
      this.sending = true;

      var resource = this.$resource("/api/auth/signon");
      resource.save(this.entry).then(
        response => {
          this.notifySignOnSuccess();
        },
        response => {
          this.notifySignOnError(response);
        }
      );
    },
    notifySignOnError(response) {
      this.sending = false;
      var message =
        response.status === 409
          ? this.$i18n.t("message.username_exist_error")
          : this.$i18n.t("message.server_error");
      this.$notify({
        message: message,
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySignOnSuccess() {
      this.$notify({
        message: this.$i18n.t("message.signon_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/login` });
    }
  }
};
</script>