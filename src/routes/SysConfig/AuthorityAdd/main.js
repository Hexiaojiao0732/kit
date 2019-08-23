/* eslint-disable react/prop-types */
import React from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import { AuthType } from '../../../utils'
import Api from 'api'

const { TextArea } = Input
const { Option } = Select

class Main extends React.Component {
    state = {
      submit: false,
      loading: false,
    };

    componentDidMount () {
    }

    _handleSubmit = (e) => {
      e.preventDefault()
      // eslint-disable-next-line react/prop-types
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { ...rest } = values
          const subObj = {
            ...rest,
          }
          this._authAdd(subObj)
        }
      })
    };

    _authAdd = async (params) => {
      try {
        this.setState({ submit: true })
        const newParams = {
          ...params,
        }
        Api.authAdd(newParams).then(res => {
          const { errcode, errmsg } = res
          if (errcode === 0) {
            message.info(errmsg)
            this._handleCancel()
            this._handleRefresh()
          } else {
            const msg = errmsg || '请求服务失败'
            message.error(msg)
          }
        })
        this.setState({ submit: false })
      } catch (e) {
        this.setState({ submit: false })
        message.error('请求服务异常')
      }
    };

    _handleCancel = () => {
      // eslint-disable-next-line react/prop-types
      const { handleCancel, form: { resetFields } } = this.props
      resetFields()
      handleCancel && handleCancel()
    };

    _handleRefresh = () => {
      // eslint-disable-next-line react/prop-types
      const { type, onRefresh } = this.props
      if (type === 'authList') {
        onRefresh && onRefresh()
      }
    };

    render () {
      const { form: { getFieldDecorator }, authRecord, parentId } = this.props
      const { id, title, englishTitle, authorityType, url, description } = authRecord
      const formItemLayout = {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 18,
        },
        colon: false,
      }
      const tailFormItemLayout = {
        wrapperCol: {
          span: 24,
          offset: 5,
        },
      }
      return (
        <div>
          <Form {...formItemLayout} onSubmit={this._handleSubmit} style={{ margin: '0px 0' }}>
            {getFieldDecorator('id',
              { initialValue:id,
              })(
              <Input type='hidden' />
            )}
            {getFieldDecorator('parentId',
              { initialValue:parentId,
              })(
              <Input type='hidden' />
            )}
            <Form.Item label='权限名称'>
              {getFieldDecorator('title',
                { initialValue:title,
                  rules: [{
                    required: true,
                    message: '请输入权限名称', }
                  ],
                })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='英文名称'>
              {getFieldDecorator('englishTitle',
                { initialValue:englishTitle,
                  rules: [{
                    required: true,
                    message: '请输入英文名称', }
                  ],
                })(
                  <Input />
              )}
            </Form.Item>
            <Form.Item label='权限类型'>
              {getFieldDecorator('authorityType',
                { initialValue:authorityType,
                  rules: [{
                    required: true,
                    message: '', }
                  ],
                })(
                <Select placeholder=''>
                    {AuthType.map(i => <Option key={i[0]} value={i[0]}>{i[1]}</Option>)}
                  </Select>
              )}
            </Form.Item>
            <Form.Item label='具体路径'>
              {getFieldDecorator('url',
                { initialValue:url,
                  rules: [{
                    required: true,
                    message: '', }
                  ],
                })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='描述'>
              {getFieldDecorator('description',
                { initialValue: description,
                  rules: [{ required: false, message: '' }],
                })(<TextArea rows={4} />)
              }
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit'>
                            提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    }
}

const AuthAddForm = Form.create()(Main)
export default AuthAddForm
