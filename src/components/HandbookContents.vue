<template>
  <div class="contents">
    <ul>
      <li v-for="chapter in handbookChapters" :key="chapter.id">
        <router-link :to="'/handbook/' + chapter.id">
          {{ chapter.title }}
        </router-link>
        <ul>
          <li v-for="paragraph in chapter.children" :key="paragraph.id">
            <router-link :to="['/handbook', chapter.id, paragraph.id].join('/')">
              {{ paragraph.title }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapGetters(['handbookChapters']),
    },
  };
</script>

<style lang="scss" scoped>
  a:link,
  a:visited,
  a:hover,
  a:active { color: #000; text-decoration: none; }

  a.router-link-exact-active { font-weight: bold; color: #0a0; }
</style>
