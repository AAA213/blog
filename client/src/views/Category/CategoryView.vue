<template>
  <div class="table">
    <div class="header">
      <n-button type="primary" @click="handleAdd"> 新增 </n-button>
    </div>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in categoryList" :key="item.id">
          <td>
            {{ item.id }}
          </td>
          <td>
            {{ item.name }}
          </td>
          <td>
            <n-space>
              <n-button @click="handleChange(item)">编辑</n-button>
              <n-button type="error" @click="handleDelete(item)">删除</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
    <ChangeAddModal
      v-model:show="ChangeAddModalData.show"
      :id="ChangeAddModalData.id"
      :name="ChangeAddModalData.name"
      @succeed="loadData"
    ></ChangeAddModal>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getList, deleteCategory } from '@/apis/category'
import { setToken, getToken } from '@/utils/token'
import { AdminStore } from '@/stores/AdminStore'
import { useRouter } from 'vue-router'
import ChangeAddModal from './components/ChangeAddModal.vue'
const dialog = inject('dialog')
const message = inject('message')
const adminStore = AdminStore()

let categoryList = ref([])
let ChangeAddModalData = reactive({
  show: false,
  id: 0,
  name: ''
})
onMounted(async () => {
  await loadData()
})
/**
 * 加载数据
 */
const loadData = async () => {
  const res = await getList()
  categoryList.value = res.data
}
const handleChange = item => {
  ChangeAddModalData.show = true
  ChangeAddModalData.id = item.id
  ChangeAddModalData.name = item.name
}
/**
 *  删除
 */
const handleDelete = async item => {
  dialog.warning({
    title: '警告',
    content: `确认删除 ${item['name']} 分类？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      const res = await deleteCategory(item.id)
      message.success('删除成功')
      loadData()
    },
    onNegativeClick: () => {}
  })
}
/**
 * 添加
 */
const handleAdd = () => {
  ChangeAddModalData.show = true
  ChangeAddModalData.id = 0
  ChangeAddModalData.name = ''
}
</script>
<style lang="scss" scoped>
.header {
  margin: 20px 0;
}
</style>
