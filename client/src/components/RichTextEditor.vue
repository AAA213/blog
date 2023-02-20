<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  defineProps,
  defineEmits
} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const toolbarConfig = { excludeKeys: ['uploadVideo'] }
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }

editorConfig.MENU_CONF['uploadImage'] = {
  // 指定图片上传地址
  server: 'http://localhost:8080/upload/rich_editor_upload',
  // 小图片不上传，转为 base64 格式放在文本中
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 10 * 1024 // 10kb
}
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: src => {
    if (src.indexOf('http') !== 0) {
      return `http://localhost:8080${src}`
    }
    return src
  }
}

// 在组件渲染完成之后在将值传入，防止被覆盖
nextTick(() => {
  valueHtml.value = props.modelValue
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = editor => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = editor => {
  editorRef.value = editor // 记录 editor 实例，重要！
  emit('update:modelValue', valueHtml.value)
}
</script>

<style less></style>
