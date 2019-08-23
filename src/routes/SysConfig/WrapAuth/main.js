import React from 'react'
import PropTypes from 'prop-types'
import { SessionStorage, StorageKeys } from '../../../utils'

export let wrapAuth = ComposedComponent => class WrapComponent extends React.Component {
  // 构造
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props)
  }

  static propTypes = {
    auth:PropTypes.string.isRequired,
  };

  buttonList = SessionStorage.get(StorageKeys.buttonList);

  _buttonList = () => {
    if (Array.isArray(this.buttonList)) {
      const targetArr = this.buttonList.filter(i => i.jsMethod === this.props.auth)
      if (targetArr.length > 0) {
        return (<ComposedComponent {...this.props} />)
      } else {
        return ('')
      }
    }
  }

  render () {
    let res = this._buttonList()
    return (res)
  }
}
