<template>
        <div class="md-layout">
            <div class="md-layout-item md-medium-size-100 md-size-66">
                <md-card>
                    <md-card-header data-background-color="purple">
                        <h4 class="title">{{ $t("message.ticket_detail_title") }}</h4>
                        <p class="category">{{ $t("message.ticket_detail_subtitle") }}</p>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.basic_info") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-switch v-model="editting" class="edit-switch">
                                    {{ $t("message.edit") }}
                                </md-switch>
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-field :class="getValidationClass('title')">
                                    <label for="title">{{ $t("message.title") }}</label>
                                    <md-input name="title" id="title" v-model="ticket.title" :disabled="!editting" type="text"></md-input>
                                    <span class="md-error" v-if="!$v.ticket.title.required">
                                        {{ $t("message.required_validation_error") }}
                                    </span>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-field :class="getValidationClass('status')">
                                    <label for="status">{{ $t("message.status") }}</label>
                                    <md-select name="status" id="status" v-model="ticket.status" :disabled="!editting"> 
                                        <md-option value="OPEN" class='md-accent'>OPEN</md-option>
                                        <md-option value="PENDING" class='md-default'>PENDING</md-option>
                                        <md-option value="CLOSED" class='md-default'>CLOSED</md-option>
                                    </md-select>
                                    <span class="md-error" v-if="!$v.ticket.status.required">
                                        {{ $t("message.required_validation_error") }}
                                    </span>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-field>
                                    <label>{{ $t("message.create_by") }}</label>
                                    <md-select v-model="ticket.createBy" disabled>
                                        <md-option v-for="user in users" :key="user.username" :value="user.username">{{user.name}}</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-field :class="getValidationClass('assignTo')">
                                    <label for="assign-to">{{ $t("message.assign_to") }}</label>
                                    <md-select name="assign-to" id="assign-to" v-model="ticket.assignTo" :disabled="!editting">
                                        <md-option v-for="user in users" :key="user.username" :value="user.username">{{user.name}}</md-option>
                                    </md-select>
                                    <span class="md-error" v-if="!$v.ticket.assignTo.required">
                                        {{ $t("message.required_validation_error") }}
                                    </span>
                                </md-field>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <md-field :class="getValidationClass('type')">
                                    <label for="type">{{ $t("message.type") }}</label>
                                    <md-select name="type" id="type" v-model="ticket.type" :disabled="!editting"> 
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
                                    <md-select name="priority" id="priority" v-model="ticket.priority" :disabled="!editting"> 
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
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.content") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <md-field>
                                    <label for="content">{{ $t("message.content") }}({{ $t("message.optional") }})</label>
                                    <md-textarea id="content" name="content" v-model="ticket.content" :disabled="!editting"></md-textarea>                 
                                </md-field>
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-small-size-100 md-size-50">
                                <h4>{{ $t("message.cc_email_list") }}</h4>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-50">
                            </div>
                        </div>

                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <div v-for="email in ticket.ccEmails" :key="email">
                                <span>{{email}}</span>
                                <a v-on:click="removeEmail(email)" :value="email" v-if="editting">{{ $t("message.delete") }}</a>
                                </div>
                            </div>
                            <div class="md-layout-item md-small-size-100 md-size-100" v-if="editting">
                                <md-field>
                                    <md-input type="email" name="email" id="email" v-model="emailToAdd" />
                                    <md-button class="md-icon-button md-list-action" @click="addEmail()" :disabled="!editting">
                                        <md-icon>add</md-icon>
                                    </md-button>
                                </md-field>
                            </div>
                        </div>
                    </md-card-content>

                    <md-progress-bar md-mode="indeterminate" v-if="sending" />
                    <div class="md-layout-item md-size-100 text-center">
                        <md-button @click="validateEntry" class="md-primary" :disabled="sending" v-if="editting">{{ $t("message.submit") }}</md-button>
                    </div>
                </md-card>
            </div>
            <div class="md-layout-item md-medium-size-100 md-size-33">
                <md-card>
                    <md-card-content>
                        <h4>{{ $t("message.correspondence_card_title") }}</h4>
                        <div class="md-layout" v-for="reply in ticket.correspondence" :key="reply.time">
                            <div class="md-layout-item md-size-20">
                                <md-avatar class="md-avatar-icon">{{reply.by.charAt(0).toUpperCase()}}</md-avatar>
                            </div>
                            <div class="md-layout-item md-size-80">
                                <span class="md-body-1">{{ reply.by }}</span>
                                <span class="md-caption">{{ reply.time ? new Date(reply.time).toLocaleString():'' }}</span>
                                <md-divider></md-divider>
                                <p class="md-body-2 correspondence-content">{{ reply.content }}</p>
                            </div>
                        </div>
                        <div class="md-layout">
                            <div class="md-layout-item md-size-100">
                                <md-field>
                                    <label for="reply">{{ $t("message.correspondence") }}</label>
                                    <md-textarea id="reply" name="reply" v-model="reply" :disabled="sending"></md-textarea>                  
                                </md-field>
                            </div>
                        </div>
                        <div class="md-layout-item md-size-100 text-center">
                            <md-button @click="replyTicket" class="md-round md-default" :disabled="sending">{{ $t("message.reply") }}</md-button>
                        </div>
                    </md-card-content>
                </md-card>
            </div>
        </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "ticket-detail-form",
  mixins: [validationMixin],
  data: () => ({
    ticket: {},
    users: [],
    reply: null,
    emailToAdd: null,
    editting: false,
    sending: false
  }),
  validations: {
    ticket: {
      title: { required },
      type: { required },
      priority: { required },
      status: { required },
      assignTo: { required }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveTicket();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.ticket[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
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
    fetchTicket() {
      var resource = this.$resource("/api/tickets/" + this.$route.params.id);
      resource.get().then(
        response => {
          this.ticket = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    fetchData() {
      var resource = this.$resource("/api/users");
      resource.get().then(
        response => {
          this.users = response.body;
          this.fetchTicket();
        },
        response => this.notifyFetchingError()
      );
    },
    saveTicket() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource("/api/tickets/" + this.ticket.ID);
      resource.update(this.ticket).then(
        response => {
          this.ticket = response.body;
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    replyTicket() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource(
        "/api/tickets/" + this.ticket.ID + "/correspondence"
      );
      resource.save({ reply: this.reply }).then(
        response => {
          this.ticket = response.body;
          this.reply = null;
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifyFetchingError() {
      this.$notify({
        message: this.$i18n.t("message.fetch_user_fail"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.$notify({
        message: this.$i18n.t("message.tt_update_success"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });
      this.sending = false;
    },
    notifySubmitError() {
      this.$notify({
        message: this.$i18n.t("message.tt_update_fail"),
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });

      this.editting = true;
      this.sending = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-switch {
  float: right;
}
.correspondence-content {
  margin-top: 5px;
  margin-bottom: 20px;
}
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>
