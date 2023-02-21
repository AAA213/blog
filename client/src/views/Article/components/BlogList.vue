<template>
  <div v-for="(blog, index) in blogList" :key="blog.id" style="margin: 15px">
    <n-card :title="blog.title">
      {{ blog.content }}
      <template #footer>
        <n-space align="center">
          <div>发布时间：{{ blog.create_time }}</div>
          <n-button @click="handleChange(blog)">修改</n-button>
          <n-button @click="handleDelete(blog)">删除</n-button>
        </n-space>
      </template>
    </n-card>
  </div>
  <n-space>
    <div v-for="pageNum in pageInfo.pageCount" @click="handlePage(pageNum)">
      <div class="page" :class="pageNum === pageInfo.page ? 'radio' : ''">
        {{ pageNum }}
      </div>
    </div>
  </n-space>
  <ChangeDialog
    v-model:show="ChangeDialogData.show"
    :title="ChangeDialogData.title"
    :id="ChangeDialogData.id"
    :content="ChangeDialogData.content"
    :categoryId="ChangeDialogData.categoryId"
    @succeed="loadBlogs"
  ></ChangeDialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getList,deleteBlog } from '../../../apis/blog'
import ChangeDialog from './ChangeDialog.vue'
const message = inject('message')
const dialog = inject('dialog')
let blogList = ref([])
let pageInfo = ref({ page: 1, pageSize: 3, count: 0, pageCount: 0 })
let ChangeDialogData = ref({
  show: false,
  title: '',
  id: 0,
  content: '',
  categoryId: 0
})
onMounted(async () => {
  loadBlogs()
})

const loadBlogs = async () => {
  try {
    const res = await getList(pageInfo.value)
    blogList.value = res.data.list
    for (let blog of blogList.value) {
      blog.content += '...'
      let d = new Date(blog.create_time)
      blog.create_time = `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日`
    }
    pageInfo.value.count = res.data.count
    // 先向下取整，然后取余判断是否余数是否大于0，大于则加1
    // pageInfo.value.pageCount =
    //   parseInt(pageInfo.value.count / pageInfo.value.pageSize) +
    //   (pageInfo.value.count % pageInfo.value.pageSize > 0 ? 1 : 0)

    // 直接向上取整
    pageInfo.value.pageCount = Math.ceil(
      pageInfo.value.count / pageInfo.value.pageSize
    )
  } catch (err) {
    console.log(err)
  } finally {
  }
}

const handlePage = async pageNum => {
  console.log(pageNum)
  pageInfo.value.page = pageNum
  loadBlogs()
}

const handleChange = blog => {
  ChangeDialogData.value.id = blog.id
  ChangeDialogData.value.title = blog.title
  ChangeDialogData.value.content = blog.content
  ChangeDialogData.value.categoryId = blog.category_id
  ChangeDialogData.value.show = true
}
/**
 *  删除
 */
const handleDelete = async item => {
  dialog.warning({
    title: '警告',
    content: `确认删除文章 ${item['title']} `,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      const res = await deleteBlog(item.id)
      message.success('删除成功')
      loadBlogs()
    },
    onNegativeClick: () => {}
  })
}
</script>
<style lang="scss">
.page {
  width: 20px;
  height: 20px;
  border: 1px solid #cacaca;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
}
.radio {
  background-color: #a5d8ff;
}
</style>
