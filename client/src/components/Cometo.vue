<template>
  <div id="comet">
    <CometChatUI />
  </div>
</template>

<script>
  // import { CometChatUI } from '../cometchat-pro-vue-ui-kit/CometChatWorkspace/src';
  import { CometChatUserListWithMessages, CometChatUI } from "../cometchat-pro-vue-ui-kit/CometChatWorkspace/src";
  export default {
    name: 'Cometo',
    components: {
      CometChatUI,
    },
  };
</script>

<style scoped>
div {
  background: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
}

</style>