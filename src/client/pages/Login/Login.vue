<template>
  <div class="content">
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-small-size-100 md-medium-size-100 md-size-100">
        <form novalidate class="md-layout" @submit.prevent="validateEntry">
            <md-card>
                <md-card-header data-background-color="purple">
                    <h4 class="title">登录</h4>
                    <p class="category">需成功登录才能使用系统。</p>
                </md-card-header>
                <md-card-content>
                    <div class="md-layout">
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field :class="getValidationClass('username')">
                                <md-icon>face</md-icon>
                                <label for="username">用户名</label>
                                <md-input name="username" id="username" v-model="username" :disabled="sending" type="text"></md-input>
                                <span class="md-error" v-if="!$v.username.required">
                                  请填写用户名。
                                </span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-small-size-100 md-size-100">
                            <md-field :class="getValidationClass('password')">
                                <md-icon>lock_open</md-icon>
                                <label for="password">密码</label>
                                <md-input name="password" id="password" v-model="password" :disabled="sending" type="password"></md-input>
                                <span class="md-error" v-if="!$v.password.required">
                                  请填写密码。
                                </span>                                
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-progress-bar md-mode="indeterminate" v-if="sending" />
                <div class="md-layout-item md-size-100 text-center">
                    <md-button type="submit" class="md-primary" :disabled="sending">确定</md-button>
                </div>
            </md-card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { AUTH_REQUEST } from "store/actions/auth";

export default {
  name: "login",
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
            message: "用户名或密码错误，请重试！",
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
<style lang="scss" scoped>
.md-progress-bar {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
}
</style>