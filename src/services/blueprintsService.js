import apimock from './apimock.js'
import apiclient from './blueprintsApi.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const service = useMock ? apimock : apiclient

export default service
