import { observable, action, computed } from 'mobx'
import Api from 'api'
class Store {
  @observable realName = ''

  @action saveParams = (realName) => {
    this.realName = realName
    console.log(this.realName)
  }
}

export default new Store()
