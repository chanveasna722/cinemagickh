// import service from '@/api/http'

// const movieApi = {
//   // Get list of films
//   list: (params?: object) => service.get('/v2/films', params),

//   // Get single film detail by ID - FIXED: use backticks ` not /
//   detail: (id: string | number) => service.get(`/v2/films/${id}`),
// }

// export default movieApi
import service from '../http'

const movieApi = {
  list: (params?: object) => service.get('/v2/films', params),
  detail: (id: string | number) => service.get(`/v2/films/${id}`),
}

export default movieApi