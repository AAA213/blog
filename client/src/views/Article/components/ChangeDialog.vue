<template>
  <n-modal v-model:show="props.show">
    <n-card
      style="width: 600px"
      :title="'编辑文章'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-card>
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
          <n-space>
            <n-button @click="handleChange"> 发布 </n-button>
            <n-button @click="handleCancel"> 取消 </n-button>
          </n-space>
        </template>
      </n-card>
    </n-card>
  </n-modal>
</template>
<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { changeBlog } from '@/apis/blog'
import { setToken, getToken } from '@/utils/token'
import { AdminStore } from '@/stores/AdminStore'
import { useRouter } from 'vue-router'
import { getList } from '@/apis/category'
const dialog = inject('dialog')
const message = inject('message')
const adminStore = AdminStore()
const props = defineProps(['id', 'title', 'content', 'categoryId', 'show'])
let formData = ref({})
const formRef = ref()
watch(
  () => props.show,
  val => {
    if (val) {
      formData.value.title = props.title
      formData.value.content = props.content
      formData.value.categoryId = props.categoryId
      formData.value.id = props.id
      console.log(formData.value)
    }
  }
)
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
const emit = defineEmits(['update:show', 'succeed'])
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: ['input', 'blur'] },
    {
      min: 3,
      max: 12,
      message: '分类名称长度在 3 到 12 个字符',
      trigger: ['input', 'blur']
    }
  ]
}
const handleCancel = () => {
  emit('update:show', false)
  formData.value = {}
}
const handleChange = async () => {
  try {
    await formRef.value?.validate()
    await changeBlog(formData.value)
    emit('update:show', false)
    emit('succeed')
    message.success('编辑成功')
  } catch (err) {
    message.error('编辑失败')
  } finally {
    formData.value = {}
  }
}
</script>
<style scoped></style>
