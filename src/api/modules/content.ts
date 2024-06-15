import { ResPage, Content } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

/**
 * @name 内容管理模块
 */
// 获取文章列表
export const getArticleList = (params: Content.ReqArticleParams) => {
  return http.post<ResPage<Content.ResArticle>>(PORT1 + `/article/list`, params)
}

// 获取文章分类列表
export const getCategoryList = (params: Content.ReqCategoryParams) => {
  return http.post<ResPage<Content.ResCategory>>(PORT1 + `/category/list`, params)
}

// 添加文章分类
export const addCategory = (params: { id: string }) => {
  return http.post(PORT1 + `/category/add`, params)
}

// 修改文章分类
export const editCategory = (params: { id: string }) => {
  return http.post(PORT1 + `/category/edit`, params)
}

// 删除文章分类
export const deleteCategory = (params: { id: string }) => {
  return http.post(PORT1 + `/category/delete`, params)
}
