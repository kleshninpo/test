<template>
  <div class="chapter">
    <component :is="component" />
  </div>
</template>

<script>
  import Vue from 'vue/dist/vue.esm.js';
  import { mapGetters } from 'vuex';
  import HandbookPre from '@/components/HandbookPre.vue';
  export default {
    data: () => ({
      component: null,
    }),
    computed: {
      ...mapGetters(['currentHandbookChapterHtml', 'currentHandbookParagraph']),
    },
    methods: {
      updateContentComponent() {
        this.component = Vue.extend({
          template: `
            <article>
              ${this.currentHandbookChapterHtml.replace(/<pre/gi, '$& is="handbook-pre"')}
            </article>
          `,
          components: { HandbookPre },
          parent: this,
        });
        this.$nextTick(() => this.$emit('update'));
      },
      scrollToSelectedParagraph() {
        if (this.currentHandbookParagraph <= 0)
          return this.$el.scrollTo({ top: 0, behavior: 'smooth' });
        const el = (this.$el.querySelectorAll('h2') || [])[this.currentHandbookParagraph];
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    beforeMount() {
      this.$store.subscribe((mutation, state) => {
        switch (mutation.type) {
          case 'HANDBOOK_CHAPTER_SELECT':
            this.updateContentComponent();
            // this.$nextTick(() => this.scrollToSelectedParagraph());
            setTimeout(() => this.scrollToSelectedParagraph(), 100);
            break;
          case 'HANDBOOK_PARAGRAPH_SELECT':
            if (!mutation.payload.byScrollEvt)
              this.scrollToSelectedParagraph();
            break;
        }
      });
    },
    mounted() {
      this.updateContentComponent();
      // this.$nextTick(() => this.scrollToSelectedParagraph());
      setTimeout(() => this.scrollToSelectedParagraph(), 100);
    },
  };
</script>
