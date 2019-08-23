import { ajax } from './'
class Xhr {
  getChainDate = (postData = {}) => (
    ajax.get('/asset2/api/project/chainDateList', { params: postData })
  )

  login = (postData = {}) => (
    ajax.post('/gs/user/login', postData)
  )
}

export default new Xhr()
