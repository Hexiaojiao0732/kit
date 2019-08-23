import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import './index.scss'
import { TitleLine } from '../../../components'
import { Button, Col, Form, Input, Row, message, Table, Divider, Popconfirm } from 'antd'
import { SessionStorage, ColConfig, UserType, StorageKeys } from '../../../utils'
import { wrapAuth } from '../WrapAuth/main'
import Api from 'api'
import { history } from 'func'

const AuthButton = wrapAuth(Button)
const FormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
}
@inject('user')
@observer
class Main extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }
    state = {
      data: [],
      pagination: { showTotal: total => `共${total}条`, showSizeChanger:true, showQuickJumper :true },
      loading: false,
      pageIndex: 1,
      pageSize: 15,
      queryObj: {},
      visible: false,
      title: '',
      LogModalVisible: false,
    };

    componentDidMount () {
      const pageIndex = SessionStorage.get(StorageKeys.myDivisionPageIndex)
      this._userList(pageIndex || 1)
    }

    columns = [
      {
        title: 'id',
        dataIndex: 'id',
        className:'column-display-none'
      },
      {
        title: '用户名',
        dataIndex: 'realName'
      },
      {
        title: '登录名',
        dataIndex: 'loginName'
      },
      {
        title: '所属单位',
        dataIndex: 'organization'
      },
      {
        title: '用户类型',
        dataIndex: 'type',
        render:(text, record, index) => {
          let typeDesc = ''
          UserType.map(i => {
            if (i[0] === text) {
              typeDesc = i[1]
            }
            return i
          })
          return typeDesc
        }
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '查看',
        render: (text, record) => {
          const { id } = record
          return (
            <span>
              <a
                href='javascript:void();'
                onClick={() => this._userEdit({ id })}
              >
                            编辑
              </a>
              <Divider type='vertical' />
              <Popconfirm
                title='确定删除用户吗?'
                onConfirm={() => this._userDelete({ id })}
                onCancel={this._cancel}
                okText='Yes'
                cancelText='No'
              >
                <a href='#'>删除</a>
              </Popconfirm>
            </span>
          )
        },
      }
    ];

    _userEdit = ({ id }) => {
      history.push(`/main/user/userEdit/${id}`)
    };

    _userDelete = async ({ id }) => {
      try {
        const newParams = {
          id: id,
        }
        Api.userDelete(newParams)
          .then(res => {
            const { errcode, errmsg } = res
            if (errcode === 0) {
              message.info(errmsg)
              this._userList()
            }
          })
      } catch (error) {
        message.error('请求服务异常')
      }
    }

    _handleSubmit = (e) => {
      const { saveParams } = this.props.user
      e && e.preventDefault()
      // eslint-disable-next-line react/prop-types
      this.props.form.validateFields((err, values) => {
        if (!err) {
          saveParams(values.realName)
          const { ...rest } = values
          const params = {}
          const queryObj = {
            ...rest,
            ...params,
          }
          this.setState({ queryObj })
          this._userList(1, this.state.pageSize, queryObj)
        }
      })
    };

    _userList = async (pageIndex = this.state.pageIndex,
      pageSize = this.state.pageSize, params = this.state.queryObj) => {
      try {
        this.setState({ loading: true })
        const { pagination } = this.state
        const newParams = {
          ...params,
          pageSize: pageSize,
          pageNo: pageIndex,
        }
        Api.userList(newParams).then(res => {
          const { errcode, errmsg, data } = res
          if (errcode === 0) {
            let dataArr = []
            const { total, rows } = data
            pagination.total = total
            pagination.current = pageIndex
            pagination.pageSize = pageSize
            if (Array.isArray(rows)) {
              dataArr = rows
            }
            this.setState({
              pageIndex,
              pageSize,
              pagination,
              data: dataArr,
              loading: false,
            })
          } else {
            const msg = errmsg || '请求服务失败'
            message.error(msg)
          }
        })
      } catch (e) {
        this.setState({ loading: false })
        message.error('请求服务异常222')
      }
    };

    _handleTableChange = (pagination, filters, sorter) => {
      const pager = { ...this.state.pagination }
      pager.current = pagination.current
      pager.pageSize = pagination.pageSize
      this.setState({
        pagination: pager,
      }, () => {
        this._userList(pagination.current, pagination.pageSize)
      })
    };

    _userAddClick = () => {
      history.push(`/user/userAdd`)
    }

    render () {
      // eslint-disable-next-line react/prop-types
      const { form: { getFieldDecorator } } = this.props
      const { realName } = this.props.user
      const { data, pagination, loading } = this.state
      return (
        <div>
          <TitleLine
            title='用户管理'
            icon='heart'
            iconColor='#eb2f96'
            rightContent={
              () => <AuthButton type='primary' onClick={this._userAddClick} auth='userAddButton'>
                    用户新增
              </AuthButton>}
          />
          <Form onSubmit={this._handleSubmit} className='my-division'>
            <Row>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='真实姓名' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('realName', {
                    initialValue: realName,
                    rules: [{ required: false }
                    ],
                  })(
                    <Input placeholder='真实姓名查询' />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='登录名' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('loginName', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      placeholder='登录名查询'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='手机号码' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('mobile', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      placeholder='手机号码查询'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='证件号码' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('identity', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      placeholder='证件号码查询'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='单位' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('organization', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      placeholder='所属单位查询'
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='职务' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('jobTitle', {
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      placeholder='职务查询'
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginBottom: '10px' }}>
              <div className='button-view'>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='submit'
                >
                                查询
                </Button>
                <Button
                  className='close'
                  htmlType='button'
                  onClick={this._handleReset}
                >
                                重置
                </Button>
              </div>
            </Form.Item>
          </Form>
          <Table
            bordered
            size='small'
            tableHeight='100%'
            columns={this.columns}
            rowKey='id'
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this._handleTableChange}
            onShowSizeChange={this._handleOnShowSizeChange}
          />
        </div>
      )
    }
}

const UserListForm = Form.create()(Main)
export default UserListForm
