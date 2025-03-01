<script setup lang="ts">

</script>

<template>
  <div class="container">
    <h1>{{ message }}</h1>
  </div>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <Versions />
</template>
