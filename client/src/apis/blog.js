import axios from '@/plugins/axios'

const addBlog = data => {
  return axios.post(`/blog/_token/add`, data)
}
export { addBlog }
