import axios from '@/plugins/axios'

const addBlog = data => {
  return axios.post(`/blog/_token/add`, data)
}
const getList = params => {
  return axios.get(`/blog/search`, { params })
}
const changeBlog = data => {
  return axios.put(`/blog/_token/update`, data)
}
const deleteBlog = id => {
  return axios.delete(`/blog/_token/delete?id=${id}`)
}
export { addBlog, getList, changeBlog, deleteBlog }
