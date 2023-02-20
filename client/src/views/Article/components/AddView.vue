<template>
  <div>
    <n-card title="编写文章">
      <n-form :model="formData" :rules="rules">
        <n-form-item path="title" label="标题">
          <n-input
            v-model:value="formData.title"
            placeholder="请输入文章标题"
          />
        </n-form-item>
        <n-form-item path="categoryId" label="分类">
          <n-select
            placeholder="选择文章分类"
            v-model:value="formData.categoryId"
            :options="categoryList"
          />
        </n-form-item>

        <n-form-item path="content" label="内容">
          <RichTextEditor v-model="formData.content"></RichTextEditor>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="handleAdd"> 发布 </n-button>
      </template>
    </n-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getList } from '@/apis/category'
import { addBlog } from '@/apis/blog'
import { setToken, getToken } from '@/utils/token'
import { AdminStore } from '@/stores/AdminStore'
import { useRouter } from 'vue-router'
import RichTextEditor from '@/components/RichTextEditor.vue'
const message = inject('message')
const adminStore = AdminStore()
let formData = reactive({
  categoryId: null,
  title: '',
  content: ''
})
let categoryList = ref([])
onMounted(async () => {
  const res = await getList()
  categoryList.value = res.data
  categoryList.value = categoryList.value.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })
})
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: ['input', 'blur'] },
    {
      min: 3,
      max: 12,
      message: '账号长度在 3 到 12 个字符',
      trigger: ['input', 'blur']
    }
  ]
}
const handleAdd = async () => {
  try {
    await addBlog(formData)
    message.success('添加成功')

    formData.categoryId = null
    formData.title = ''
    formData.content = ''
  } catch (err) {
    message.error('添加失败')
  } finally {
  }
}
</script>
<style less></style>
