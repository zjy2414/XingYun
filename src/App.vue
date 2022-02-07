<!-- 
	This is the main page of the application, the layout component is used here,
	and the router-view is passed to it.
	Layout component is dynamically declared based on the layout for each route,
	specified in routes list router/index.js .
 -->

<template>
  <div id="app">
    <component :is="layout">
      <router-view v-if="isRouterAlive" />
    </component>
  </div>
</template>

<script>
export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function() {
         this.isRouterAlive = true
      })
    }
  },
  computed: {
    // Sets components name based on current route's specified layout, defaults to
    // <layout-default></layout-default> component.
    layout() {
      return "layout-" + (this.$route.meta.layout || "dashboard").toLowerCase();
    },
  },
};
</script>

<style lang="scss">
html {
  height: 100%;
  width: 100%;
  overflow: -moz-hidden-unscrollable;
}
body {
  height: 100%;
  width: 100%;
  -ms-overflow-style: none;
  overflow: auto;
}
body::-webkit-scrollbar {
  display: none;
}
</style>