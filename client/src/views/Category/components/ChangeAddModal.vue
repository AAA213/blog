<template>
  <n-modal v-model:show="props.show">
    <n-card
      style="width: 600px"
      :title="props.id ? '编辑' : '新增'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item path="name" label="分类名称">
          <n-input v-model:value="formData.name" placeholder="请输入分类名称" />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" @click="handleConfirm"> 确认 </n-button>
      </template>
    </n-card>
  </n-modal>
</template>
<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch } from 'vue'
import { addCategory, changeCategory } from '@/apis/category'
import { setToken, getToken } from '@/utils/token'
import { AdminStore } from '@/stores/AdminStore'
import { useRouter } from 'vue-router'

const dialog = inject('dialog')
const message = inject('message')
const adminStore = AdminStore()
const props = defineProps(['id', 'name', 'show'])
let formData = reactive({})
const formRef = ref()
watch(
  () => props.show,
  val => {
    if (val) {
      formData.id = props.id ? props.id : 0
      formData.name = props.name ? props.name : ''
    }
  }
)

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
  formData = reactive({})
}
const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
    props.id ? await changeCategory(formData) : await addCategory(formData)
    emit('update:show', false)
    emit('succeed')
    props.id ? message.success('编辑成功') : message.success('新增成功')
  } catch (err) {
    props.id ? message.error('编辑失败') : message.error('新增失败')
  } finally {
    formData =reactive({})
  }
}
</script>
<style less></style>
