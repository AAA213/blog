<template>
  <div>
    <n-card title="歌曲" style="margin-bottom: 16px">
      <n-tabs default-value="list" type="line" animated>
        <n-tab-pane name="list" tab="文章列表">
          <BlogList></BlogList>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章"> <AddView></AddView> </n-tab-pane>
        <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import AddView from './components/AddView.vue'
import BlogList from './components/BlogList.vue'
</script>
<style less></style>
