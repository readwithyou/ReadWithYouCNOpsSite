<template>
<form novalidate class="md-layout" @submit.prevent="validateEntry">
    <md-card>
        <md-card-header :data-background-color="dataBackgroundColor">
            <h4 class="title">成人英文陪读试课登记表</h4>
            <p class="category">填写相应信息完成添加试课报名。</p>
        </md-card-header>

        <md-card-content>
            <h4>基本信息</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('cnName')">
                        <label for="cn-name">中文名</label>
                        <md-input name="cn-name" id="cn-name" v-model="entry.cnName" :disabled="sending" type="text"></md-input>
                        <span class="md-error" v-if="!$v.entry.cnName.required">
                            中文名为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>英文名(选填)</label>
                        <md-input v-model="entry.enName" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('gender')">
                        <label for="gender">性别</label>
                        <md-select name="gender" id="gender" v-model="entry.gender" md-dense :disabled="sending">
                            <md-option>请选择...</md-option>
                            <md-option value="M">男</md-option>
                            <md-option value="F">女</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.gender.required">
                            性别为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('age')">
                        <label for="age">年龄</label>
                        <md-input type="number" id="age" name="age" autocomplete="age" v-model="entry.age" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.age.required">年龄为必填项目。</span>
                        <span class="md-error" v-else-if="!$v.entry.age.maxlength">年龄是不是太大了？</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('phone')">
                        <label for="phone">电话</label>
                        <md-input type="text" id="phone" name="phone" autocomplete="phone" v-model="entry.phone" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.phone.required">电话为必填项目。</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="entry.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.email.required">Email为必填项目。</span>
                        <span class="md-error" v-else-if="!$v.entry.email.email">Email地址格式错误。</span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field>
                        <label>微信(选填)</label>
                        <md-input v-model="entry.wechat" type="text"></md-input>
                    </md-field>
                </div>
            </div>

            <h4>问卷调查</h4>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('ifReadEnBook')">
                        <label for="if-read-en-book">目前在读英文书吗？</label>
                        <md-select name="if-read-en-book" id="if-read-en-book" v-model="entry.ifReadEnBookInStr" md-dense :disabled="sending">
                            <md-option>请选择...</md-option>
                            <md-option value="true">是</md-option>
                            <md-option value="false">否</md-option>
                        </md-select>
                        <span class="md-error" v-if="!$v.entry.ifReadEnBook.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('numBookBought')">
                        <label for="num-book-bought">每年购买英文书的数量：</label>
                        <md-input type="number" id="num-book-bought" name="num-book-bought" autocomplete="numBookBought" v-model="entry.numBookBought" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.numBookBought.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-field :class="getValidationClass('numBookRead')">
                        <label for="num-book-read">完整阅读完的英文书数量：</label>
                        <md-input type="number" id="num-book-read" name="num-book-read" autocomplete="numBookRead" v-model="entry.numBookRead" :disabled="sending" />
                        <span class="md-error" v-if="!$v.entry.numBookRead.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('readingBlocker')">
                        <label for="reading-blocker">阅读图书，英文邮件，文档等内容时，您遇到的最大障碍是：</label>
                        <md-textarea id="reading-blocker" name="reading-blocker" v-model="entry.readingBlocker" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.readingBlocker.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('exprience')">
                        <label for="exprience">简述您的英文学习经历：</label>
                        <md-textarea id="exprience" name="exprience" v-model="entry.exprience" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.exprience.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('expectation')">
                        <label for="expectation">您对陪你读书的陪读服务的期望是什么？（6个月短期和1-2年的长期期望）</label>
                        <md-textarea id="expectation" name="expectation" v-model="entry.expectation" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.expectation.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('favBooks')">
                        <label for="favBooks">您喜欢读哪些种类的图书呢？ 目前在读书目举例（中英文都可以）</label>
                        <md-textarea id="favBooks" name="favBooks" v-model="entry.favBooks" :disabled="sending" ></md-textarea>
                        <span class="md-error" v-if="!$v.entry.favBooks.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <vue-dropzone ref="bookImgs" id="bookImgs" :options="dropzoneOptions">
                    </vue-dropzone>
                </div>
            </div>

            <h4>其他备注</h4>
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label for="remarks">备注（选填）</label>
                        <md-input type="text" id="remarks" name="remarks" autocomplete="remarks" v-model="entry.remarks" :disabled="sending" />                      
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field :class="getValidationClass('preTimeSlot')">
                        <label for="pre-timeslot">期待试课时间</label>
                        <md-input type="text" id="pre-timeslot" name="pre-timeslot" autocomplete="preTimeSlot" v-model="entry.preTimeSlot" :disabled="sending" />                      
                        <span class="md-error" v-if="!$v.entry.preTimeSlot.required">
                            此为必填项目。
                        </span>
                    </md-field>
                </div>
            </div>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        <div class="md-layout-item md-size-100 text-center">
            <md-button type="submit" class="md-primary" :disabled="sending">提交</md-button>
        </div>
    </md-card>
</form>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "edit-profile-form",
  mixins: [validationMixin],
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    entry: {
      type: "adult",
      status: 0,
      cnName: null,
      enName: null,
      gender: null,
      age: null,
      phone: null,
      email: null,
      wechat: null,
      ifReadEnBookInStr: null,
      ifReadEnBook: false,
      numBookBought: null,
      numBookRead: null,
      readingBlocker: null,
      exprience: null,
      expectation: null,
      favBooks: null,
      preTimeSlot: null
    },
    sending: false,
    entrySaved: false,
    fullName: null,
    dropzoneOptions: {
      url: "https://httpbin.org/post",
      thumbnailWidth: 150,
      maxFilesize: 2,
      dictCancelUpload: "取消",
      dictCancelUploadConfirmation: "确认取消图片上传？",
      dictRemoveFile: "删除",
      dictDefaultMessage: "请拖拽或点击上传正在阅读图书内页照片。",
      headers: { "My-Awesome-Header": "header value" }
    }
  }),
  watch: {
    entry: function(val) {
      this.entry.ifReadEnBook = val.ifReadEnBookInStr === "true";
    }
  },
  validations: {
    entry: {
      cnName: {
        required,
        minLength: minLength(2)
      },
      gender: {
        required
      },
      age: {
        required,
        maxLength: maxLength(3)
      },
      phone: {
        required
      },
      email: {
        required,
        email
      },
      ifReadEnBook: {
        required
      },
      numBookBought: {
        required
      },
      numBookRead: {
        required
      },
      readingBlocker: {
        required
      },
      exprience: {
        required
      },
      expectation: {
        required
      },
      favBooks: {
        required
      },
      preTimeSlot: {
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
    validateEntry() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveEntry();
      }
    },
    saveEntry() {
      if (this.tag) {
        this.entry.tag = this.tag;
      }
      this.sending = true;

      var resource = this.$resource("/api/registrations");
      resource.save(this.entry).then(
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
        message: "试课报名登记失败，请稍后重试！",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger"
      });
    },
    notifySubmitSuccess() {
      this.fullName = `${this.entry.cnName}`;
      this.entrySaved = true;
      this.sending = false;
      this.$notify({
        message: "试课报名登记成功！",
        icon: "add_alert",
        horizontalAlign: "right",
        verticalAlign: "top",
        type: "success"
      });
      this.$router.push({ path: `/registrations` });
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
