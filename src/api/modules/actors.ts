// import service from '@/api/http'

// const actorApi = {
//   // Get list of actors
//   list: (params?: object) => service.get('/v2/actors', params),

//   // Get single actor detail by ID - use backticks ` not /
//   detail: (id: string | number) => service.get(`/v2/actors/${id}`),
// }

// export default actorApi
import service from '../http'

const actorApi = {
  list: (params?: object) => service.get('/v2/actors', params),
  detail: (id: string | number) => service.get(`/v2/actors/${id}`),
}

export default actorApi