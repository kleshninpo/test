<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    data: () => ({
      //
    }),
    methods: {
      ...mapActions(['fetchHandbook']),
    },
    mounted() {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'HANDBOOK_CHAPTERS')
          this.$store.commit('HANDBOOK_CHAPTER_SELECT', 1);
      });
      this.fetchHandbook();
    },
  };
</script>

<style lang="scss">
  html, body, #app { height: 100%; margin: 0; padding: 0; }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active { color: #42b983; }
    }
  }
</style>
