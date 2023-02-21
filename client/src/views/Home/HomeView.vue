<template>
  <div class="container">
    <div class="nav">
      <div @click="handleToHome">首页</div>
      <div>
        <n-popselect
          v-model:value="searchInfo.categoryId"
          :options="categoryList"
          size="medium"
          scrollable
          trigger="click"
        >
          <div>
            分类<span>{{ selectCategoryName }}</span>
          </div>
        </n-popselect>
      </div>
      <div @click="handleToDashboard">后台</div>
    </div>
    <n-divider />

    <n-space class="search">
      <n-input
        v-model:value="searchInfo.keyWord"
        :style="{ width: `500px` }"
        placeholder="请输入关键词"
      ></n-input>
      <n-button type="primary" ghost @click="loadBlogs">搜索</n-button>
      <n-button ghost @click="handleReset">重置</n-button>
    </n-space>

    <div v-for="(blog, index) in blogList" :key="blog.id" style="margin: 15px">
      <n-card :title="blog.title">
        {{ blog.content }}
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      v-model:page="searchInfo.page"
      :page-count="searchInfo.pageCount"
      @update:page="loadBlogs"
    />

    <n-divider />
    <div class="footer">
      <div>Power by xxxx</div>
      <div>XICP备xxxx号</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { getList as getCategoryList } from '@/apis/category'
import { useRouter } from 'vue-router'
import { getList as getBlogList } from '@/apis/blog'
const router = useRouter()
let categoryList = ref([])
let blogList = ref([])

let searchInfo = ref({
  page: 1,
  pageSize: 3,
  count: 0,
  pageCount: 0,
  keyWord: '',
  categoryId: 0
})

onMounted(() => {
  loadCategory()
  loadBlogs()
})

const selectCategoryName = computed(() => {
  let selectCategory = categoryList.value.find(option => {
    console.log(option)
    return option.value === searchInfo.value.categoryId
  })

  return selectCategory ? selectCategory.label : ''
})

/**
 * 加载分类数据
 */
const loadCategory = async () => {
  const res = await getCategoryList()
  categoryList.value = res.data
  categoryList.value = categoryList.value.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })
}
/**
 * 加载文章数据
 */
const loadBlogs = async () => {
  try {
    const res = await getBlogList(searchInfo.value)
    blogList.value = res.data.list
    for (let blog of blogList.value) {
      blog.content += '...'
      let d = new Date(blog.create_time)
      blog.create_time = `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日`
    }
    searchInfo.value.count = res.data.count

    searchInfo.value.pageCount = Math.ceil(
      searchInfo.value.count / searchInfo.value.pageSize
    )
  } catch (err) {
    console.log(err)
  } finally {
  }
}

const handleReset = () => {
  searchInfo.value = {
    page: 1,
    pageSize: 3,
    count: 0,
    pageCount: 0,
    keyWord: '',
    categoryId: 0
  }
  loadBlogs()
}

const handleToHome = () => {
  router.push('/')
}
const handleToDashboard = () => {
  router.push('/login')
}
</script>
<style scoped lang="scss">
.container {
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
  // border: 1px solid #000;
}
.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  div {
    cursor: pointer;
    margin-right: 15px;
    &:hover {
      color: #00b41e;
    }
  }
  span {
    font-size: 14px;
  }
}
.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
