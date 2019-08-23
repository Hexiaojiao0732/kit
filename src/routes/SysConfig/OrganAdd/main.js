import React from 'react'
import { Form, Input, Switch, Radio, Row, Col, Select, Button, message, TreeSelect } from 'antd'
import Api from 'api'
import { OrganType } from '../../../utils'

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
          this._organAdd(subObj)
        }
      })
    };

    _organAdd = async (params) => {
      try {
        this.setState({ submit: true })
        const newParams = {
          ...params,
        }
        Api.organAdd(newParams)
          .then(res => {
            if (res.errcode === 0) {
              message.info(res.errmsg)
              this._handleCancel()
              this._handleRefresh()
            } else {
              const msg = res.errmsg || '请求服务失败'
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
      const { handleCancel, form: { resetFields } } = this.props
      resetFields()
      handleCancel && handleCancel()
    };

    _handleRefresh = () => {
      const { type, onRefresh } = this.props
      if (type === 'organList') {
        onRefresh && onRefresh()
      }
    };

    render () {
      const { form: { getFieldDecorator }, organRecord, parentId } = this.props
      const { id, name, type, address, telephone, postcode } = organRecord
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
            <Form.Item label='单位名称'>
              {getFieldDecorator('name',
                { initialValue:name,
                  rules: [{
                    required: true,
                    message: '请输入单位名称', }
                  ],
                })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label='单位类型'>
              {getFieldDecorator('type',
                { initialValue:type,
                  rules: [{
                    required: true,
                    message: '请输入英文名称', }
                  ],
                })(
                  <Select placeholder=''>
                  {OrganType.map(i => <Option key={i[0].toString()} value={i[0].toString()}>{i[1]}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item label='地址'>
              {getFieldDecorator('address',
                { initialValue:address,
                  rules: [{
                    required: false,
                    message: '', }
                  ],
                })(
                  <Input />
              )}
            </Form.Item>
            <Form.Item label='单位电话'>
              {getFieldDecorator('telephone',
                { initialValue:telephone,
                  rules: [{
                    required: false,
                    message: '', }
                  ],
                })(
                  <Input />
              )}
            </Form.Item>
            <Form.Item label='邮编'>
              {getFieldDecorator('postcode',
                { initialValue: postcode,
                  rules: [{ required: false, message: '' }],
                })(<Input />)
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

const OrganAddForm = Form.create()(Main)
export default OrganAddForm
