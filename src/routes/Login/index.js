import React from 'react'
import './index.scss'
import { Form, Input, Icon, Button, Spin, message } from 'antd'
import Api from 'api'
import { SessionStorage, StorageKeys } from '../../utils'
import { history } from 'func'

const TimeOut = 60

class Main extends React.Component {
    state = {
      loading: false,
      userInput: null,
      hasSendCode: false,
      timeOut: TimeOut,
    };

    componentWillUnmount () {
    }
    handleSubmit = (e) => {
      e.preventDefault()
      // eslint-disable-next-line react/prop-types
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this._login(values)
        }
      })
    };

    _login = async (params) => {
      try {
        SessionStorage.removeAll()
        this.setState({ loading: true })
        Api.login(params)
          .then(res => {
            const { data } = res
            console.log(data)
            const { token, menuList, jobTitle, buttonList } = data
            if (token && menuList && jobTitle) {
              const userInfo = { menu: menuList, user : { jobTitle } }
              SessionStorage.set(StorageKeys.token, token)
              SessionStorage.set(StorageKeys.userInfo, userInfo)
              SessionStorage.set(StorageKeys.buttonList, buttonList)
              history.push('/')
            } else {
              const msg = res.errmsg ? res.errmsg : '登录失败，请联系管理员'
              message.error(msg)
            }
          })
      } catch (error) {
        console.log('login e', error)
        this.setState({ loading: false })
        message.error('请求服务异常')
      }
    }
    render () {
      // eslint-disable-next-line react/prop-types
      const { getFieldDecorator } = this.props.form
      const { loading, timeOut } = this.state

      if (timeOut === 0) {
        console.log('clearInterval')
        this.timer && clearInterval(this.timer)
      }
      return (
        <div className='login-cls'>
          <div className='login-box'>
            <Spin size='large' spinning={loading}>
              <h2>登录标题</h2>
              <Form onSubmit={this.handleSubmit} className='login-form'>
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入登录名！' },
                    ],
                  })(
                    <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder='请输入登录名'
                      onChange={this._onUserInputChange}
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(
                    <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type='password'
                      placeholder='密码' />
                  )}
                </Form.Item>
                {/* <Form.Item>
                                {getFieldDecorator('validateCode', {
                                    rules: [{required: true, message: '请输入验证码！'}],
                                })(
                                    <Input prefix={<Icon type="block" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                           placeholder="验证码"
                                           suffix={
                                               <Button
                                                   onClick={this._onBtnClick}
                                                   disabled={buttonDisabled}
                                                   style={{width: '120px'}}
                                               >
                                                   {btnTxt}
                                               </Button>
                                           }
                                    />
                                )}
                            </Form.Item> */}
                <Form.Item>
                  <Button type='primary' htmlType='submit' className='login-form-button'>
                                    登录
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </div>
      )
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Main)
export default WrappedNormalLoginForm
