<template>
  <div class="login-panel">
    <n-card title="管理后台登录">
      <n-form :model="formData" :rules="rules">
        <n-form-item path="account" label="账号">
          <n-input
            v-model:value="formData.account"
            placeholder="请输入账号"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-checkbox v-model:checked="formData.rember"> 记住我 </n-checkbox>
        <n-button @click="handleLogin"> 登录 </n-button>
      </template>
    </n-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/apis/login'
import { setToken, getToken } from '@/utils/token'
import { AdminStore } from '@/stores/AdminStore'
const message = inject('message')
const adminStore = AdminStore()
let formData = reactive({
  account: 'admin',
  password: '123456',
  rember: false
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
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['input', 'blur'] },
    {
      min: 6,
      max: 18,
      message: '账号长度在 6 到 18 个字符',
      trigger: ['input', 'blur']
    }
  ]
}

const handleLogin = async () => {
  try {
    const res = await login(formData)
    adminStore.token = res.data.token
    adminStore.account = res.data.account
    adminStore.id = res.data.id
    setToken(res.data.token)

    message.success('登录成功')
  } catch (err) {
    message.error('登录失败')
  }
}
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
}
</style>
