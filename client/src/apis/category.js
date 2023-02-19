import axios from '@/plugins/axios'

const getList = () => {
  return axios.get('/category/list')
}
const deleteCategory = id => {
  return axios.delete(`/category/_token/delete?id=${id}`)
}
const addCategory = data => {
  return axios.post(`/category/_token/add`, data)
}
const changeCategory = data => {
  return axios.put(`/category/_token/update`, data)
}
export { getList, deleteCategory, addCategory, changeCategory }
