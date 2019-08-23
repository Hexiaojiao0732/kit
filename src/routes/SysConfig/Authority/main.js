import React from 'react'
import './index.scss'
import { TitleLine } from '../../../components'
import { Button, Col, Form, Input, Row, message, Table, Divider, Popconfirm, Modal } from 'antd'
import { AuthType } from '../../../utils'
import AuthAddForm from '../AuthorityAdd'
import Api from 'api'

const ColConfig = {
  span:10,
}

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

class Main extends React.Component {
    state = {
      data: [],
      expandedRowKeys: [],
      loading: false,
      queryObj: {},
      visible: false,
      title: '',
      authAddVisible: false,
      authRecord:{},
      authId: '',
      parentId:'',
    };

    componentDidMount () {
      this._authList()
    }

    columns = [
      {
        title: '权限名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '英文名称',
        dataIndex: 'englishTitle',
        key: 'englishTitle',
        width: '12%',
      },
      {
        title: '权限类型',
        dataIndex: 'authorityType',
        width: '12%',
        key: 'authorityType',
        render:(text, record, index) => {
          let typeDesc = ''
          AuthType.map(i => {
            if (i[0] === text) {
              typeDesc = i[1]
            }
            return i
          })
          return typeDesc
        }
      },
      {
        title: '查看',
        fixed: 'right',
        width: 300,
        render: (text, record) => {
          const { id } = record
          return (
            <span>
              <a
                href='javascript:void();'
                onClick={() => this._authAdd({ record })}
              >
                            添加下级菜单
              </a>
              <Divider type='vertical' />
              <a
                href='javascript:void();'
                onClick={() => this._authEdit({ record })}
              >
                            编辑
              </a>
              <Divider type='vertical' />
              <Popconfirm
                title='确定删除权限吗?'
                onConfirm={() => this._authDelete({ id })}
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

    _authDelete = async ({ id }) => {
      try {
        const newParams = {
          id: id,
        }
        Api.authDelete(newParams).then(res => {
          const { errcode, errmsg } = res
          if (errcode === 0) {
            message.info(errmsg)
            this._authList()
          }
        })
      } catch (error) {
        message.error('请求服务异常')
      }
    }

    _handleSubmit = (e) => {
      e && e.preventDefault()
      // eslint-disable-next-line react/prop-types
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { ...rest } = values
          const params = {}
          const queryObj = {
            ...rest,
            ...params,
          }
          this.setState({ queryObj })
          this._authList(queryObj)
        }
      })
    };

    _authList = async (queryObj) => {
      try {
        this.setState({ loading: true })
        const newParams = {
          ...queryObj,
        }
        Api.allAuthList(newParams).then(res => {
          const { errcode, errmsg, data } = res
          if (errcode === 0) {
            this.setState({
              data:data.dataSource,
              expandedRowKeys: data.expandKeys,
              loading: false,
            })
          } else {
            const msg = errmsg || '请求服务失败'
            message.error(msg)
          }
        })
      } catch (e) {
        this.setState({ loading: false })
        message.error('请求服务异常')
      }
    };

    _authEdit = ({ record }) => {
      this.setState({
        authAddVisible: true,
        parentId:'',
        authRecord:record,
      })
    };

    _authAdd = ({ record }) => {
      this.setState({
        authAddVisible: true,
        parentId: record.id,
        authRecord:{}
      })
    };

    _handleCancel = (stateName) => {
      this.setState({ [stateName]: false })
    };

    _onExpand = (expanded, record) => {
      if (expanded) {
        if (this.state.expandedRowKeys.indexOf(record.key) === -1) {
          this.state.expandedRowKeys.push(record.key)
        }
      } else {
        let expandKeysChange = this.state.expandedRowKeys.filter(function (item) {
          return item !== record.key
        })
        this.setState({ expandedRowKeys:expandKeysChange })
      }
    }

    render () {
      // eslint-disable-next-line react/prop-types
      const { form: { getFieldDecorator } } = this.props
      const { data, loading, expandedRowKeys } = this.state
      const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        },
      }
      return (
        <div className='contentDiv' >
          <TitleLine
            title='权限管理'
            icon='edit-1-copy'
          />
          <Form onSubmit={this._handleSubmit} className='my-division'>
            <Row>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='权限名称' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('title', {
                    rules: [{ required: false }
                    ],
                  })(
                    <Input placeholder='权限名称查询' />
                  )}
                </Form.Item>
              </Col>

              <Col {...ColConfig}>
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
              </Col>
            </Row>
          </Form>
          <Table
            bordered
            expandedRowKeys={expandedRowKeys}
            onExpand={this._onExpand}
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource={data}
            loading={loading} />

          <Modal
            centered
            destroyOnClose
            title='权限新增'
            visible={this.state.authAddVisible}
            footer={null}
            onCancel={() => this._handleCancel('authAddVisible')}
            width={'40%'}
          >
            <AuthAddForm
              type={'authList'}
              authRecord={this.state.authRecord}
              handleCancel={() => this._handleCancel('authAddVisible')}
              onRefresh={this._authList}
              id={this.state.authId}
              parentId={this.state.parentId} />
          </Modal>
        </div>

      )
    }
}

const AuthListForm = Form.create()(Main)
export default AuthListForm
