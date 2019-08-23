import React from 'react'
import { Layout, Menu, Icon, Modal, Input, message, Button } from 'antd'
import './index.scss'
import { SessionStorage, StorageKeys } from '../../utils'
import MenuCustomer from './customer/MenuCustomer'
import PropTypes from 'prop-types'
import { history } from 'func'

const { Content, Sider, Header, Footer } = Layout
if (SessionStorage.get(StorageKeys.userInfo) === null) {
  history.push('/login')
}
const { menu } = SessionStorage.get(StorageKeys.userInfo)

export default class LayoutPage extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }
    state = {
      collapsed: false,
      defaultSelectedKeys: [],
      defaultOpenKeys: [],
      oldPassword: null,
      newPassword: null,
      item: menu[0],
      itemId: menu[0].id,
      homeTitle: ''
    };

    componentWillMount () {
      let item = {}
      if (menu[0].children) {
        item = menu[0].children[0]
      } else {
        item = menu[0]
      }
      let key = null
      const openKey = `${menu[0].id}`
      if (Object.keys(item).length > 0) {
        const { id } = item
        key = `${id}`
      }
      if (!key && !openKey) {

      }
    }

    onCollapse = (collapsed) => {
      this.setState({ collapsed })
    };

    _renderMenuItemNav = (item) => {
      const { id, title } = item
      const key = (() => {
        return `${id}`
      })()
      return (
        <Menu.Item key={key} onClick={this._renderMenuItemClick}>
          {title}
        </Menu.Item>
      )
    };

    _renderMenuItemClick = (e) => {
      menu.map((menuitem, i) => {
        if (menuitem.id === e.key.toString()) {
          this.setState({ item: menuitem, itemId: e.key })
        }
        return i
      })
    };
    _changeHomeTitle (title) {
      this.setState({ homeTitle:title })
    }
    _showConfirm = () => {
      Modal.confirm({
        title: '提示',
        content: '退出登录？',
        onOk: this._loginOut,
        onCancel: () => null,
      })
    };

    _loginOut = () => {
    //   SessionStorage.removeAll()
      // this.props.history.replace('/login')
      this._destroyAll()
    };

    _destroyAll = () => {
      Modal.destroyAll()
    };

    _handleLayOut = () => {
      this._showConfirm()
    };

    _handleChangePassword = () => {
      const ele = (
        <div>
          <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            type='password'
            placeholder='旧密码'
            onChange={e => this.setState({ oldPassword: e.target.value })}
          />
          <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
            type='password'
            style={{ marginTop: '5px' }}
            placeholder='新密码'
            onChange={e => this.setState({ newPassword: e.target.value })}
          />
        </div>
      )
      Modal.confirm({
        title: '修改密码',
        content: ele,
        onOk: () => {
          const { oldPassword, newPassword } = this.state
          if (!oldPassword || !newPassword) {
            message.info('输入旧密码或新密码')
            return
          }
          const params = {
            oldPassword,
            newPassword,
          }
          this._onChangePassword(params)
        },
        onCancel: () => null,
      })
    };

    _onChangePassword = async (params) => {
      try {
        const { errcode, errmsg } = {}
        if (errcode === 0) {
          this._loginOut()
        } else {
          const msg = errmsg || '请求失败'
          message.error(msg)
        }
        this.setState({
          oldPassword: null,
          newPassword: null,
        })
      } catch (e) {
        this.setState({
          oldPassword: null,
          newPassword: null,
        })
        message.error('请求服务异常')
      }
    };
    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      })
    };

    render () {
      // eslint-disable-next-line standard/object-curly-even-spacing
      const { user : { jobTitle }, menu } = SessionStorage.get(StorageKeys.userInfo)
      return (
        <Layout className='my-layout'>
          <Header className='header'>
            <div className='logo' />
            <div className=''>
              <div className=''>
                <Menu
                  theme='dark'
                  mode='horizontal'
                  defaultSelectedKeys={[menu[0].id.toString()]}
                  style={{ lineHeight: '64px' }}
                >
                  {menu.map(i => this._renderMenuItemNav(i))}
                </Menu>
              </div>
            </div>
            <div className='welcome-div' style={{ float:'right' }}>
              <span className='user-span'><Icon type='smile' theme='twoTone' />&nbsp;{jobTitle}</span>&nbsp;&nbsp;
              <Button type='primary' icon='poweroff' onClick={this.logout}>退出登录</Button>
            </div>
          </Header>
          <Layout>
            <Sider
              id='example'
              width={200}
              style={{ background: '#fff' }}
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              className='sider'
            >
              <div className='menu-box'>
                <div className='menu-view'>
                  <MenuCustomer
                    item={this.state.item}
                    itemId={this.state.itemId}
                    // eslint-disable-next-line react/jsx-no-bind
                    _changeHomeTitle={this._changeHomeTitle.bind(this)}
                  />
                </div>
              </div>
            </Sider>
            <Layout className='home-layout'>
              <Content
                style={{
                  background: '#fff',
                  padding: 12,
                  margin: 5,
                  minHeight: 480,
                }}
              >
                <div className='outer-content'>
                  <div className='inner-content'>
                    {this.props.children}
                  </div>
                </div>
              </Content>
              <Footer style={{ textAlign: 'center', height:'20px' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
          </Layout>
        </Layout>
      )
    }
}
