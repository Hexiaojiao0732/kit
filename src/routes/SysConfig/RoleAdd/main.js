import React from 'react'
import { Form, Input, Button, message } from 'antd'
import Api from 'api'

const { TextArea } = Input

class Main extends React.Component {
    state = {
      submit: false,
      loading: false,
      organTreeList: [],
      organTitle:'',
      roleList: [],
      editUser:{},
      passwordReq: true,
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
          this._roleAdd(subObj)
        }
      })
    };

    _roleAdd = async (params) => {
      try {
        this.setState({ submit: true })
        const newParams = {
          ...params,
        }
        Api.roleAdd(newParams).then(res => {
          const { errcode, errmsg } = res
          if (errcode === 0) {
            message.info(errmsg)
            this._handleCancel()
            this._handleRefresh()
          } else {
            const msg = errmsg || '请求服务失败'
            message.error(msg)
          }
          this.setState({ submit: false })
        })
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
      if (type === 'roleList') {
        onRefresh && onRefresh()
      }
    };

    render () {
      // eslint-disable-next-line react/prop-types
      const { form: { getFieldDecorator }, roleRecord } = this.props
      // eslint-disable-next-line react/prop-types
      const { id, name, description } = roleRecord
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
            <Form.Item label='角色名称'>
              {getFieldDecorator('name',
                { initialValue:name,
                  rules: [{
                    required: true,
                    message: '请输入角色名称', }
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

const RoleAddForm = Form.create()(Main)
export default RoleAddForm
