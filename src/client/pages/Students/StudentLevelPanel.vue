<template>
    <form novalidate class="md-layout" @submit.prevent="validateEntry">
    <div class="content">
        <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <h4>{{ $t("message.basic_info") }}</h4>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <can I="edit" a="studentLevelInfo">
                        <md-switch v-model="editting" class="edit-switch">{{ $t("message.edit") }}</md-switch>
                    </can>
                </div>
            </div>
            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label>{{ $t("message.en_name") }}</label>
                        <md-input v-model="entry.enName" disabled type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label for="type">{{ $t("message.registration_type") }}</label>
                        <md-select name="type" id="type" v-model="entry.type" md-dense disabled>
                            <md-option value="child">{{ $t("message.child") }}</md-option>
                            <md-option value="adult">{{ $t("message.adult") }}</md-option>
                        </md-select>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label for="zoom-id">Zoom ID</label>
                        <md-input name="zoom-id" id="zoom-id" v-model="entry.zoomId" type="text" disabled></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-50">
                    <md-field>
                        <label for="read-level">{{ $t("message.read_level") }}</label>
                        <md-select name="read-level" id="read-level" v-model="entry.readLevel" md-dense :disabled="!editting">
                            <md-option v-for="levelString in levelStrings" :key="levelString.level" :value="levelString.level">
                                {{ $t(levelString.translation) }}
                            </md-option>
                        </md-select>
                    </md-field>
                </div>
            </div>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                    <h4>{{ $t("message.other_info") }}</h4>
                </div>
            </div>

            <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-100">
                    <md-field>
                        <label>{{ $t("message.remarks") }}</label>
                        <md-textarea v-model="entry.remarks" :disabled="!editting"></md-textarea>
                    </md-field>
                </div>
            </div>

            <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate" class="md-accent" v-if="sending"></md-progress-spinner>

            <div class="md-layout-item md-size-100 text-center">
                <can I="edit" a="studentLevelInfo">
                    <md-button type="submit" class="md-raised md-primary" v-if="editting">{{ $t("message.save") }}</md-button>
                </can>
            </div>
        </div>
    </div>
    </form>
</template>
<script>
import { Can } from "@casl/vue";
import miscUtility from "../../utils/miscUtility.js";

export default {
  components: {
    Can
  },
  data() {
    return {
      entry: {},
      editting: false,
      sending: false,
      levelStrings: miscUtility.levelStrings
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    validateEntry() {
      this.saveEntry();
    },
    fetchData() {
      var resource = this.$resource("/api/students/" + this.$route.params.id);
      resource.get().then(
        response => {
          this.entry = response.body;
        },
        response => {
          this.notifyFetchingError();
        }
      );
    },
    saveEntry() {
      this.editting = false;
      this.sending = true;

      var resource = this.$resource(
        "/api/students/" + this.entry.ID + "/level"
      );
      resource.update(this.entry).then(
        response => {
          this.notifySubmitSuccess();
        },
        response => {
          this.notifySubmitError();
        }
      );
    },
    notifySubmitError() {
      this.$notify({
        message: "Failed to update student level. Please try again later!",
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
        message: "Update student level successfully!",
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success"
      });

      this.sending = false;
    },
    notifyFetchingError() {
      this.$notify({
        message: "Fail to retrieve student info from server. Please try again later!",
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