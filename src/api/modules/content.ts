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

export const getArticleById = (params: { id: string }) => {
  return http.get<Content.ResArticle>(PORT1 + `/article/get`, params)
}

export const saveArticle = (params: Content.ResArticle) => {
  return http.post(PORT1 + `/article/save`, params)
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
export const deleteCategory = (params: { ids: string }) => {
  return http.post(PORT1 + `/category/delete`, params)
}

// 获取文章分类列表
export const getTagList = (params: Content.ReqTagParams) => {
  return http.post<ResPage<Content.ResTag>>(PORT1 + `/tag/list`, params)
}

// 添加文章标签
export const addTag = (params: { id: string }) => {
  return http.post(PORT1 + `/tag/add`, params)
}

// 修改文章标签
export const editTag = (params: { id: string }) => {
  return http.post(PORT1 + `/tag/edit`, params)
}

// 删除文章标签
export const deleteTag = (params: { ids: string }) => {
  return http.post(PORT1 + `/tag/delete`, params)
}
