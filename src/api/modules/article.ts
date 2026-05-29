import service from '../http'

const articlesApi = {
  getArticles: (params?: any): Promise<any> =>
    service.get('/v2/articles', params),
  
  getArticleById: (id: number): Promise<any> =>
    service.get(`/v2/articles/${id}`),
}

export default articlesApi