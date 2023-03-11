<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3.0 + Vite" /> -->
  <Gobang />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Gobang from "./components/Gobang.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    Gobang,
  },
};
</script>
