import { ResPage, Content } from '@/api/interface/index'
import { PORT1 } from '@/api/config/servicePort'
import http from '@/api'

/**
 * @name 内容管理模块
 */
// 获取文章列表
export const getArticleList = (params: Content.ReqArticleParams) => {
  return http.post<ResPage<Content.ResArticleList>>(PORT1 + `/article/list`, params)
}
