import React from 'react'
import { TitleLine } from '../../../components'
import { Form, Input, Switch, Radio, Row, Col, Select, Button, message, TreeSelect } from 'antd'
import { Sex, UserType, CertificateTypeId } from '../../../utils'
import Api from 'api'
import { history } from 'func'

const { TextArea } = Input
const { Option } = Select
const { TreeNode } = TreeSelect

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
      // eslint-disable-next-line react/prop-types
      const { params } = this.props.match
      // eslint-disable-next-line react/prop-types
      const { id } = params
      this._organTreeList()
      this._roleList()
      console.log(id)
      if (id !== '' && id !== undefined) {
        this._getUserEdit(id)
      }
    }

    _getUserEdit = async (id) => {
      try {
        const params = { id }
        Api.userList(params).then(res => {
          const { rows } = res.data
          if (rows.length > 0) {
            this.setState({ editUser: rows[0], passwordReq: false })
          }
        })
      } catch (error) {
        message.error('请求服务异常')
      }
    }

    _roleList = async () => {
      try {
        Api.roleList().then(res => {
          const { rows } = res.data
          this.setState({ roleList: rows })
        })
      } catch (error) {
        message.error('请求服务异常')
      }
    }
    _organTreeList = async () => {
      try {
        Api.organTreeList().then(res => {
          if (res) {
            const { data } = res
            this.setState({ organTreeList: data.dataSource })
          }
        })
      } catch (e) {
        message.error('请求服务异常')
      }
    };

    _renderOrganTreeNode = (item) => {
      const { id, name, children } = item
      const key = (() => {
        return `${id}`
      })()
      if (children) {
        return (
          <TreeNode key={key} title={name} value={key} >
            {children.map(i => this._renderOrganTreeNode(i))}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode key={key} title={name} value={key} />
        )
      }
    };

    _onOrganChange = value => {
      this.setState({ organTitle: value })
    };

    _handleSubmit = (e) => {
      e.preventDefault()
      // eslint-disable-next-line react/prop-types
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { isActive, ...rest } = values
          const params = {}
          Object.assign(params, {
            isActive:isActive === true ? 1 : 0,
          })
          const subObj = {
            ...rest,
            ...params,
          }
          this._userAdd(subObj)
        }
      })
    };

    _userAdd = async (params) => {
      try {
        this.setState({ submit: true })
        const newParams = {
          ...params,
        }
        Api.userAdd(newParams).then(res => {
          const { errcode, errmsg } = res
          if (errcode === 0) {
            message.info(errmsg)
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

    _handleBack = (e) => {
      history.goBack()
    }

    render () {
      // eslint-disable-next-line react/prop-types
      const { form: { getFieldDecorator } } = this.props
      const { id, loginName, realName, isActive, organizationId, mobile,
        email, certificateTypeId, certificateNo, sex, identity, type,
        roleId, jobTitle, description } = this.state.editUser
      let isActiveBool = true
      if (isActive === 0) {
        isActiveBool = false
      }
      const ColConfig = {
        span: 10,
      }
      const formItemLayout = {
        labelCol: {
          span: 5,
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
          <TitleLine
            title='用户新增'
            icon='edit-1-copy'
          />
          <Form {...formItemLayout} onSubmit={this._handleSubmit} style={{ margin: '0px 0' }}>
            <Row>
              <Col {...ColConfig}>
                {getFieldDecorator('id',
                  { initialValue:id,
                  })(
                  <Input type='hidden' />
                )}
                <Form.Item label='登录名'>
                  {getFieldDecorator('loginName',
                    { initialValue:loginName,
                      rules: [{
                        required: true,
                        message: '请输入登录名', }
                      ],
                    })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='真实姓名' >
                  {getFieldDecorator('realName',
                    { initialValue:realName,
                      rules: [
                        {
                          required: true,
                          message: '请输入真实姓名',
                        }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='密码' >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: this.state.passwordReq,
                        message: '请输入密码',
                      }],
                  })(<Input.Password />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='单位'>
                  {getFieldDecorator('organizationId',
                    { initialValue:organizationId,
                      rules: [{ required: true, message: '单位必填' }],
                    })(<TreeSelect
                    showSearch
                    treeNodeFilterProp='title'
                    title={this.state.organTitle}
                    dropdownStyle={{ maxHeight: 300, overflow: 'scroll' }}
                    placeholder=''
                    allowClear
                    treeDefaultExpandAll
                    onChange={this._onOrganChange}
                  >
                    {this.state.organTreeList.map(i => this._renderOrganTreeNode(i))}
                  </TreeSelect>
                  )}
                </Form.Item>
              </Col>

              <Col {...ColConfig}>
                <Form.Item label='手机号码'>
                  {getFieldDecorator('mobile',
                    { initialValue: mobile,
                      rules: [{ required: false, message: '' }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='电子邮箱'>
                  {getFieldDecorator('email',
                    { initialValue: email,
                      rules: [{ required: false, message: '' }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='证件类型'>
                  {getFieldDecorator('certificateTypeId',
                    { initialValue: certificateTypeId,
                      rules: [{ required: true, message: '' }],
                    })(
                      <Select placeholder=''>
                      {CertificateTypeId.map(i => <Option key={i[0]} value={i[0]}>{i[1]}</Option>)}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='证件号码'>
                  {getFieldDecorator('certificateNo',
                    { initialValue: certificateNo,
                      rules: [{ required: true, message: '' }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='性别'>
                  {getFieldDecorator('sex',
                    { initialValue: sex,
                      rules: [{ required: true, message: '' }],
                    })(
                    <Radio.Group>
                        {Sex.map(i => <Radio key={i[0]} value={i[0]}>{i[1]}</Radio>)}
                      </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='身份证号'>
                  {getFieldDecorator('identity',
                    { initialValue: identity,
                      rules: [{ required: false, message: '' }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='用户类型'>
                  {getFieldDecorator('type',
                    { initialValue: type,
                      rules: [{ required: true, message: '' }],
                    })(
                    <Radio.Group>
                        {UserType.map(i => <Radio key={i[0]} value={i[0]}>{i[1]}</Radio>)}
                      </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='角色'>
                  {getFieldDecorator('roleId',
                    { initialValue: roleId,
                      rules: [{ required: false, message: '' }],
                    })(
                    <Select placeholder=''>
                        {this.state.roleList.map((item) => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                      })}
                      </Select>)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item
                  label='职务'
                >
                  {getFieldDecorator('jobTitle',
                    { initialValue: jobTitle,
                      rules: [{ required: false, message: '' }],
                    })(<Input />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='是否激活'>
                  {getFieldDecorator('isActive',
                    {
                      valuePropName: 'checked',
                      initialValue:isActiveBool,
                    })(<Switch />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item label='描述'>
                  {getFieldDecorator('description',
                    { initialValue: description,
                      rules: [{ required: false, message: '' }],
                    })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...tailFormItemLayout}>
                  <Button type='primary' htmlType='submit'>
                                提交
                  </Button>
                            &nbsp;&nbsp;
                  <Button type='close' htmlType='button' onClick={this._handleBack}>
                                返回
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )
    }
}

const UserAddForm = Form.create()(Main)
export default UserAddForm
