<template>
  <div class="home">
    <handbook-contents />
    <handbook-chapter @update="onChapterUpdate" @scroll.native="onChapterScroll($event)" />
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import debounce from 'lodash/debounce';
  import HandbookContents from '@/components/HandbookContents.vue';
  import HandbookChapter from '@/components/HandbookChapter.vue';

  export default {
    data: () => ({
      paragraphsTop: [],    // массив верхних коррдинат (topY) параграфов
    }),
    computed: {
      ...mapGetters(['currentHandbookChapter', 'currentHandbookParagraph']),
    },
    methods: {
      ...mapMutations(['HANDBOOK_CHAPTER_SELECT', 'HANDBOOK_PARAGRAPH_SELECT']),
      /** Обработчик загрузки другой главы (обновления динамического компонента) */
      onChapterUpdate() {
        if (!this.$el) return void setTimeout(() => this.onChapterUpdate(), 200);
        this.paragraphsTop = [...this.$el.querySelectorAll('.chapter h2')].map(p => p.offsetTop).reverse();
      },
      /** Обработчик скроллинга по содержимому главы */
      onChapterScroll: debounce(function ({ target }) {
        const bottom = target.scrollTop + target.clientHeight,
              found = this.paragraphsTop.findIndex(pt => pt < bottom),
              curParagraph = (found >= 0) ? this.paragraphsTop.length - found : -1;
        // if (curParagraph > 0) {
        this.HANDBOOK_PARAGRAPH_SELECT({ paragraphN: curParagraph, byScrollEvt: true });
        //   const newPath = `/handbook/${this.currentHandbookChapter + 1}/${this.currentHandbookParagraph + 1}`;
        //   if (this.$route.path.toLowerCase() !== newPath)
        //     this.$router.push({ path: newPath });
        // }
      }, 333),
    },
    mounted() {
      /** Обработчик изменения роута (после) */
      this.$router.afterEach((to, from) => {
        if (!to.path.startsWith('/handbook/')) return;
        const { chapter:fromChapter, paragraph:fromParagraph } = from.params,
              { chapter:toChapter = 1, paragraph:toParagraph = 1 } = to.params;
        if (~~fromChapter === toChapter) {
          if (~~fromParagraph !== toParagraph)
            this.HANDBOOK_PARAGRAPH_SELECT({ paragraphN: toParagraph });
        } else {
          this.HANDBOOK_CHAPTER_SELECT(toChapter);
          this.HANDBOOK_PARAGRAPH_SELECT({ paragraphN: toParagraph });
        }
      });
      this.onChapterUpdate();
      this.$el.querySelector('.chapter').addEventListener('scroll', this.onChapterScroll);
    },
    beforeDestroy() {
      this.$el.querySelector('.chapter').removeEventListener('scroll', this.onChapterScroll);
    },
    components: { HandbookContents, HandbookChapter },
  };
</script>

<style lang="scss" scoped>
  .home {
    display: flex; flex-flow: row nowrap;
    height: 100%;

    .contents,
    .chapter { flex: 0 0 auto; height: 100%; overflow-y: auto; }

    .contents { max-width: 33%; }

    .chapter {
      width: 67%;
      box-sizing: border-box;
      padding-left: 1rem;
      border-left: 1px solid #0004;
    }
  }
</style>
