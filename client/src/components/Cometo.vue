<template>
  <div id="comet">
    <CometChatUserListWithMessages />
  </div>
</template>

<script>
  // import { CometChatUI } from '../cometchat-pro-vue-ui-kit/CometChatWorkspace/src';
  import { CometChatUserListWithMessages } from "../cometchat-pro-vue-ui-kit/CometChatWorkspace/src";
  export default {
    name: 'Cometo',
    components: {
      CometChatUserListWithMessages,
    },
  };
</script>

<!-- <style scoped>
html,
body,
div {
  background: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
}

</style> -->