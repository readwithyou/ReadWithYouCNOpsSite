<template>
  <div class="pdf-zoom">
    <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled">
      <img :src="zoomInLogo" alt="">
    </a>
    <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled">
      <img :src="zoomOutLogo" alt="">
    </a>
    <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled">
      <img :src="expandLogo" alt="">
    </a>
    <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled">
      <img :src="shrinkLogo" alt="">
    </a>
  </div>
</template>

<script>
export default {
  name: 'PDFZoom',

  props: {
    scale: {
      type: Number,
    },
    increment: {
      type: Number,
      default: 0.25,
    },
    zoomInLogo: {
      type: String,
      default: require('../assets/icon-zoom-in.svg')
    },
    zoomOutLogo: {
      type: String,
      default: require('../assets/icon-zoom-out.svg')
    },
    expandLogo: {
      type: String,
      default: require('../assets/icon-expand.svg')
    },
    shrinkLogo: {
      type: String,
      default: require('../assets/icon-shrink.svg')
    },
  },

  computed: {
    isDisabled() {
      return !this.scale;
    },
  },

  methods: {
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },

    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },

    updateScale(scale) {
      this.$emit('change', {scale});
    },

    fitWidth() {
      this.$emit('fit', 'width');
    },

    fitAuto() {
      this.$emit('fit', 'auto');
    },
  },
}
</script>

<style>
.pdf-zoom a {
  float: left;
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  line-height: 1.5em;
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
}
</style>
