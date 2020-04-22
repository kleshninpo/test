export default {
  state: {
    handbookChapters: [],
    curHandbookChapter: 0,
    curHandbookParagraph: 0,
  },
  getters: {
    handbookChapters: state => state.handbookChapters,
    currentHandbookChapter: state => state.curHandbookChapter,
    currentHandbookParagraph: state => state.curHandbookParagraph,
    currentHandbookChapterHtml: state => {
      const chapter = state.handbookChapters[state.curHandbookChapter] || { raw: '', children: [] };
      return chapter.raw + chapter.children.map(({ raw }) => raw).join('');
    },
  },
  mutations: {
    HANDBOOK_CHAPTERS(state, data) {
      state.handbookChapters = data;
    },
    HANDBOOK_CHAPTER_SELECT(state, chapterN) {
      state.curHandbookChapter = chapterN - 1;
    },
    HANDBOOK_PARAGRAPH_SELECT(state, { paragraphN, byScrollEvt }) {
      state.curHandbookParagraph = paragraphN - 1;
    },
  },
  actions: {
    async fetchHandbook({ commit }) {
      // const re = /<h(\d)>[\s\S]*?<h\1>/gi;
      const html = await fetch('/handbook.html').then(r => r.text())
        .catch(err => console.error(err.message, err.stack));
      const blockRegex = /<h(\d)[^>]*>(.*?)<\/h\d>(.*?)(?=<h)/gis,
            chapters = [];
      let match, lastChildren;
      while (match = blockRegex.exec(html)) {
        const [, level, header, inner] = match;
        if (level === '1') {
          lastChildren = [];
          chapters.push({
            id: chapters.length + 1,
            title: header,
            isHeader: true,
            raw: `<h${level}>${header}</h${level}>\n${inner}`,
            children: lastChildren,
          });
        } else if (level === '2' || level === '3') {
          lastChildren.push({
            id: lastChildren.length + 1,
            title: header,
            raw: `<h${level}>${header}</h${level}>\n${inner}`,
          });
        }
      }
      commit('HANDBOOK_CHAPTERS', chapters);
    },
  },
};
