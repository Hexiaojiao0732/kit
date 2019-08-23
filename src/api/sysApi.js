import { ajax } from './'
class Xhr {
  getChainDate = (postData = {}) => (
    ajax.get('/asset2/api/project/chainDateList', { params: postData })
  )

  userList = (postData = {}) => (ajax.post('/gs/user/user/list', postData))
  organTreeList = (postData = {}) => (ajax.post('/gs/organization/organization/tree', postData))
  organDelete = (postData = {}) => (ajax.post('/gs/organization/organization/delete', postData))
  organAdd = (postData = {}) => (ajax.post('/gs/organization/organization/add', postData))
  userAdd = (postData = {}) => (ajax.post('/gs/user/user/add', postData))
  roleList = (postData = {}) => (ajax.post('/gs/role/role/list', postData))
  userDelete = (postData = {}) => (ajax.post('/gs/user/user/delete', postData))
  allAuthList = (postData = {}) => (ajax.post('/gs/auth/auth/list', postData))
  authDataList = (postData = {}) => (ajax.post('/gs/auth/auth/authDataList', postData))
  roleAdd = (postData = {}) => (ajax.post('/gs/role/role/add', postData))
  roleAuthIds = (postData = {}) => (ajax.post('/gs/role/role/auths', postData))
  roleAuthAdd = (postData = {}) => (ajax.post('/gs/role/role/roleAuthAdd', postData))
  roleDelete = (postData = {}) => (ajax.post('/gs/role/role/delete', postData))
  authAdd = (postData = {}) => (ajax.post('/gs/auth/auth/add', postData))
  authDelete = (postData = {}) => (ajax.post('/gs/auth/auth/delete', postData))
}

export default new Xhr()
