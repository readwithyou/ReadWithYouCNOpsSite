<template>
  <form>
    <md-card>
      <md-card-header data-background-color="purple">
          <h4 class="title">{{ $t("message.edit_profile_title") }}</h4>
          <p class="category">{{ $t("message.edit_profile_subtitle") }}</p>
      </md-card-header>

      <md-card-content>
        <form novalidate class="md-layout" @submit.prevent="validateEntry">
          <div class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-50">
                  <h4>{{ $t("message.basic_info") }}</h4>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-50">
                <can I="edit" a="profile">
                  <md-switch v-model="editting" class="edit-switch">{{ $t("message.edit") }}</md-switch>
                </can>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                      <md-icon>face</md-icon>
                      <label for="signon-username">{{ $t("message.username") }}</label>
                      <md-input name="signon-username" id="signon-username" v-model="entry.username" disabled type="text"></md-input>
                  </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field>
                      <md-icon>group</md-icon>
                      <label for="s-group">{{ $t("message.group") }}</label>
                      <md-input name="group" id="group" :value="$t('message.'+entry.group)" disabled type="text"></md-input>
                  </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field :class="getValidationClass('name')">
                      <md-icon>person</md-icon>
                      <label for="signon-name">{{ $t("message.name") }}</label>
                      <md-input name="signon-name" id="signon-name" v-model="entry.name" :disabled="!editting"  type="text"></md-input>
                      <span class="md-error" v-if="!$v.entry.name.required">
                        {{ $t("message.name_required_validation_error") }}
                      </span>
                  </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-100">
                  <md-field :class="getValidationClass('email')">
                      <md-icon>mail</md-icon>
                      <label for="email">{{ $t("message.email") }}</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="!editting"  />
                      <span class="md-error" v-if="!$v.entry.email.required">{{ $t("message.email_required_validation_error") }}</span>
                      <span class="md-error" v-else-if="!$v.entry.email.email">{{ $t("message.email_format_validation_error") }}</span>
                  </md-field>
              </div>
          </div>
          <div class="md-layout-item md-size-100 text-center" v-if="editting">
              <can I="edit" a="profile">
                <md-button type="submit" class="md-primary" :disabled="!editting">{{ $t("message.submit") }}</md-button>
              </can>
          </div>
        </form>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>
import { Can } from "@casl/vue";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "EditProfileForm",
  mixins: [validationMixin],
  components: {
    Can
  },
  data() {
    return {
      entry: {},
      editting: false,
      sending: false
    };
  },
  validations: {
    entry: {
      name: {
        required
      },
      email: {
        required,
        email
      }
    }
  },
  created() {
    this.fetchData();
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
        this.saveEntry();
      }
    },
    saveEntry() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource("/api/users/me");
      resource.update(this.entry).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    fetchData() {
      var resource = this.$resource("/api/users/me");
      resource.get().then(
        response => {
          this.entry = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: "Fail to fetch profile information, please try again later!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitError() {
      this.$notify({
        message: "Failed to Update profile!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });

      this.editting = true;
      this.sending = false;
    },
    notifySubmitSuccess() {
      this.$notify({
        message: "Update profile successfully!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });

      this.sending = false;
    }
  }
};
</script>
<style lang="scss" scoped>
p.text-muted {
  color: #9e9e9e;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
}
.edit-switch {
  float: right;
}
.md-progress-spinner {
  position: absolute;
  left: 50%;
  top: 280px;
  margin-left: -50px;
  margin-top: -50px;
}
</style>
