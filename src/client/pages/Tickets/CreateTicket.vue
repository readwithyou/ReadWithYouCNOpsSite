<template>
  <div class="content">
    <can I="create" a="ticket">
      <div class="md-layout">
        <div class="md-layout-item md-medium-size-100 md-size-100">
          <form novalidate class="md-layout" @submit.prevent="validateEntry">
              <md-card class="md-layout-item md-size-100">
                  <md-card-header>
                    <div class="md-title">{{ $t("message.ticket_create_title") }}</div>
                    <div class="md-subhead">{{ $t("message.ticket_create_subtitle") }}</div>
                  </md-card-header>

                  <md-card-content>
                      <h4>{{ $t("message.basic_info") }}</h4>
                      <div class="md-layout">
                          <div class="md-layout-item md-small-size-100 md-size-50">
                              <md-field :class="getValidationClass('title')">
                                  <label for="title">{{ $t("message.title") }}</label>
                                  <md-input name="title" id="title" v-model="ticket.title" :disabled="sending" type="text"></md-input>
                                  <span class="md-error" v-if="!$v.ticket.title.required">
                                      {{ $t("message.required_validation_error") }}
                                  </span>
                              </md-field>
                          </div>
                          <div class="md-layout-item md-small-size-100 md-size-50">
                              <md-field :class="getValidationClass('type')">
                                  <label for="type">{{ $t("message.type") }}</label>
                                  <md-select name="type" id="type" v-model="ticket.type"> 
                                      <md-option value="PB_SYSTEM_BUG">{{ $t("message.ticket_type_pb_system_bug") }}</md-option>
                                      <md-option value="OPS_SYSTEM_BUG">{{ $t("message.ticket_type_ops_system_bug") }}</md-option>
                                      <md-option value="DAILY_OPS">{{ $t("message.ticket_type_ops") }}</md-option>
                                  </md-select>
                                  <span class="md-error" v-if="!$v.ticket.type.required">
                                      {{ $t("message.required_validation_error") }}
                                  </span>
                              </md-field>
                          </div>
                          <div class="md-layout-item md-small-size-100 md-size-50">
                              <md-field :class="getValidationClass('priority')">
                                  <label for="priority">{{ $t("message.priority") }}</label>
                                  <md-select name="priority" id="priority" v-model="ticket.priority"> 
                                      <md-option value="1" class='md-accent'>
                                        {{ $t("message.ticket_priority_1") }}
                                      </md-option>
                                      <md-option value="2" class='md-primary'>
                                        {{ $t("message.ticket_priority_2") }}
                                      </md-option>
                                      <md-option value="3" class='md-default'>
                                        {{ $t("message.ticket_priority_3") }}
                                      </md-option>
                                  </md-select>
                                  <span class="md-error" v-if="!$v.ticket.priority.required">
                                      {{ $t("message.required_validation_error") }}
                                  </span>
                              </md-field>
                          </div>
                          <div class="md-layout-item md-small-size-100 md-size-50">
                              <md-field :class="getValidationClass('assignTo')">
                                  <label for="assign-to">{{ $t("message.assign_to") }}</label>
                                  <md-select name="assign-to" id="assign-to" v-model="ticket.assignTo" :disabled="sending" >
                                      <md-option v-for="user in users" :key="user.username" :value="user.username">{{user.name}}</md-option>
                                  </md-select>
                                  <span class="md-error" v-if="!$v.ticket.assignTo.required">
                                      {{ $t("message.required_validation_error") }}
                                  </span>
                              </md-field>
                          </div>
                      </div>

                      <h4>{{ $t("message.content") }}</h4>
                      <div class="md-layout">
                        <div class="md-layout-item md-size-100">
                            <md-field>
                                <label for="content">{{ $t("message.content") }}({{ $t("message.optional") }})</label>
                                <md-textarea id="ticket-content" name="content" v-model="ticket.content" :disabled="sending"></md-textarea>                 
                            </md-field>
                        </div>
                      </div>

                      <h4>{{ $t("message.cc_email_list") }}</h4>
                      <div class="md-layout">
                        <div class="md-layout-item md-size-100">
                          <div v-for="email in ticket.ccEmails" :key="email">
                            <span>{{email}}</span>
                            <a v-on:click="removeEmail(email)" :value="email" :disabled="sending">{{ $t("message.delete") }}</a>
                          </div>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                                <label for="userEmails">{{ $t("message.select_user_emails") }}</label>
                                <md-select v-model="userEmailsToAdd" name="userEmails" id="userEmails" multiple>
                                    <md-option v-for="user in users" :key="user.username" :value="user.email">{{user.name}}</md-option>
                                </md-select>
                                <md-button class="md-icon-button md-primary" @click="addUserEmails()" :disabled="sending">
                                    <md-icon>add</md-icon>
                                </md-button>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field>
                                <label for="userEmails">{{ $t("message.free_format_emails") }}</label>
                                <md-input type="email" name="email" id="email" v-model="emailToAdd" />
                                <md-button class="md-icon-button md-primary" @click="addEmail()" :disabled="sending">
                                    <md-icon>add</md-icon>
                                </md-button>
                            </md-field>
                        </div>
                      </div>
                  </md-card-content>

                  <md-progress-bar md-mode="indeterminate" v-if="sending" />
                  <div class="md-layout-item md-size-100 text-center">
                      <md-button type="submit" class="md-raised md-primary" :disabled="sending">{{ $t("message.submit") }}</md-button>
                  </div>
              </md-card>
          </form>
        </div>
      </div>
    </can>
  </div>
</template>
<script>
import { Can } from "@casl/vue";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "create-ticket-form",
  mixins: [validationMixin],
  components: {
    Can
  },
  data: () => ({
    ticket: {},
    users: [],
    emailToAdd: null,
    userEmailsToAdd: [],
    sending: false
  }),
  created() {
    this.fetchUsers();
  },
  validations: {
    ticket: {
      title: { required },
      type: { required },
      priority: { required },
      assignTo: { required }
    }
  },
  methods: {
    clearEmail() {
      this.emailToAdd = null;
    },
    addUserEmails() {
      var userEmailsToAdd = this.userEmailsToAdd;
      var ccEmails = this.ticket.ccEmails ? this.ticket.ccEmails : [];

      this.$set(
        this.ticket,
        "ccEmails",
        Array.from(new Set(ccEmails.concat(userEmailsToAdd)))
      );
      this.userEmailsToAdd = [];
    },
    addEmail() {
      var emailToAdd = this.emailToAdd;
      var ccEmails = this.ticket.ccEmails ? this.ticket.ccEmails : [];

      if (ccEmails.indexOf(emailToAdd) === -1) ccEmails.push(emailToAdd);

      this.$set(this.ticket, "ccEmails", ccEmails);
      this.emailToAdd = null;
    },
    removeEmail(email) {
      var ccEmails = this.ticket.ccEmails ? this.ticket.ccEmails : [];
      ccEmails.splice(ccEmails.indexOf(email), 1);

      this.$set(this.ticket, "ccEmails", ccEmails);
    },
    getValidationClass(fieldName) {
      const field = this.$v.ticket[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveEntry();
      }
    },
    fetchUsers() {
      var resource = this.$resource("/api/users");
      resource
        .get()
        .then(
          response =>
            (this.users = response.body.sort(
              (a, b) => (a.name > b.name ? 1 : -1)
            )),
          response => this.notifyFetchingError()
        );
    },
    saveEntry() {
      this.sending = true;

      var resource = this.$resource("/api/tickets");
      resource.save(this.ticket).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifySubmitError() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.ticket_create_fail"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.sending = false;
      this.$notify({
        message: this.$i18n.t("message.ticket_create_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/tickets` });
    },
    notifyFetchingError() {
      this.$notify({
        message: this.$i18n.t("message.fetch_user_fail"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
#ticket-content {
  min-height: 200px;
}
</style>
