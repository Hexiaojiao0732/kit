import React from 'react'
import { Menu, Icon } from 'antd'
import { SessionStorage, StorageKeys } from '../../../utils'
import { history } from 'func'
const { SubMenu } = Menu

export default class MenuCustomer extends React.Component {
  constructor () {
    super()
    this.state = {
      error: null
    }
  }

  skip=(val) => {
    history.push(`${val}`)
  }

  _menuIcon = (code) => {
    switch (code) {
      case 'pastDue': {
        return 'yiyuqi'
      }
      case 'caseManage': {
        return 'fenlei'
      }
      case 'caseUserMa': {
        return 'renyuanguanli'
      }
      case 'urgeCase': {
        return 'cuishou'
      }
      case 'outerCase': {
        return 'weiwaishengchan'
      }
      default: {
        return 'yiyuqi'
      }
    }
  };

  _renderMenuItem = (item) => {
    const { id, title, url, children } = item
    if (children) {
      // const icon = this._menuIcon(url)
      return (
        <SubMenu
          key={`${id}`}
          title={
            <span>
              <Icon type='smile' theme='twoTone' />
              <span>{title}</span>
            </span>
          }
        >
          {children.map(i => this._renderMenuItem(i))}
        </SubMenu>
      )
    } else {
      const key = (() => {
        return `${id}`
      })()
      return (
        <Menu.Item key={key} style={{ paddingLeft: '20px' }} onClick={() => this.skip(url)}>
          {title}
        </Menu.Item>
      )
    }
  };
 _onClick = ({ key }) => {
   SessionStorage.remove(StorageKeys.allDivisionQuery)
   SessionStorage.remove(StorageKeys.myDivisionPageIndex)
   SessionStorage.set(StorageKeys.currentMenuKey, key)
   const path = this._pathWithTarget(key)
   history.push(path)
 };

 render () {
   // eslint-disable-next-line react/prop-types
   if (this.props.item !== undefined) {
     // eslint-disable-next-line react/prop-types
     const itemChildren = this.props.item.children
     if (itemChildren === null) {
       return null
     }
     // eslint-disable-next-line react/prop-types
     const listItem = itemChildren.map(i => this._renderMenuItem(i))
     return (<Menu
       mode='inline'
       // eslint-disable-next-line react/prop-types
       defaultOpenKeys={[itemChildren[0].id.toString()]}
       style={{ height: '100%', borderRight: 0 }}
     >
       {listItem}
     </Menu>)
   } else {
     return null
   }
 }
}
