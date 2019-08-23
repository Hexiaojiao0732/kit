import React from 'react'
import './index.scss'
import { TitleLine } from '../../../components'
import { Button, Col, Form, Input, Row, message, Table, Divider, Popconfirm, Modal } from 'antd'
import { SessionStorage, StorageKeys } from '../../../utils'
import RoleAuthTreeForm from '../RoleAuthTree'
import RoleAddForm from '../RoleAdd'
import Api from 'api'

const ColConfig = {
  span:9,
}
const ColConfig2 = {
  span:15,
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
      pagination: { showTotal: total => `共${total}条`, showSizeChanger:true, showQuickJumper :true },
      loading: false,
      pageIndex: 1,
      pageSize: 15,
      queryObj: {},
      visible: false,
      title: '',
      roleAddVisible: false,
      roleRecord:{},
      roleId: '',
    };

    componentDidMount () {
      const pageIndex = SessionStorage.get(StorageKeys.myDivisionPageIndex)
      this._roleList(pageIndex || 1)
    }

    columns = [
      {
        title: 'id',
        dataIndex: 'id',
        className:'column-display-none',
      },
      {
        title: 'description',
        dataIndex: 'description',
        className:'column-display-none',
        width: 100,
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '查看',
        fixed: 'right',
        width: 200,
        render: (text, record) => {
          const { id } = record
          return (
            <span>
              <a
                href='javascript:void();'
                onClick={() => this._roleEdit({ record })}
              >
                            编辑
              </a>
              <Divider type='vertical' />
              <Popconfirm
                title='确定删除角色吗?'
                onConfirm={() => this._roleDelete({ id })}
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

    _roleEdit = ({ record }) => {
      console.log(record)
      this.setState({
        roleAddVisible: true,
        roleRecord:record,
      })
    };

    _roleDelete = async ({ id }) => {
      try {
        const newParams = {
          id: id,
        }
        Api.roleDelete(newParams).then(res => {
          const { errcode, errmsg } = res
          if (errcode === 0) {
            message.info(errmsg)
            this._roleList()
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
          this._roleList(1, this.state.pageSize, queryObj)
        }
      })
    };

    _roleList = async (pageIndex = this.state.pageIndex, pageSize = this.state.pageSize,
      params = this.state.queryObj) => {
      try {
        this.setState({ loading: true })
        const { pagination } = this.state
        const newParams = {
          ...params,
          pageSize: pageSize,
          pageNo: pageIndex,
        }
        Api.roleList(newParams).then(res => {
          const { errcode, errmsg, data } = res
          let dataArr = []
          if (errcode === 0) {
            const { total, rows } = data
            pagination.total = total
            pagination.current = pageIndex
            pagination.pageSize = pageSize
            if (Array.isArray(rows)) {
              dataArr = rows
            }
          } else {
            const msg = errmsg || '请求服务失败'
            message.error(msg)
          }
          this.setState({
            pageIndex,
            pageSize,
            pagination,
            data: dataArr,
            loading: false,
          })
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
        this._roleList(pagination.current, pagination.pageSize)
      })
    };

    _handleCancel = (stateName) => {
      this.setState({ [stateName]: false })
    };

    _onRoleAdd = () => {
      this.setState({
        roleAddVisible: true,
        roleRecord:{}
      })
    };

    render () {
      // eslint-disable-next-line react/prop-types
      const { form: { getFieldDecorator } } = this.props
      const { data, pagination, loading } = this.state
      const { clientHeight } = document.body
      const tableHeight = clientHeight - 240
      const rowSelection = {
        type: 'radio',
        onSelect: (record, selected, selectedRows) => {
          this.setState({ roleId: record.id })
        }
      }
      return (
        <div className='contentDiv' >
          <div className='content1'>
            <TitleLine
              title='角色管理'
              icon='edit-1-copy'
            />
            <Form onSubmit={this._handleSubmit} className='my-division'>
              <Row>
                <Col {...ColConfig}>
                  <Form.Item {...FormItemLayout} label='角色名称' style={{ marginBottom: '0px' }}>
                    {getFieldDecorator('name', {
                      rules: [{ required: false }
                      ],
                    })(
                      <Input placeholder='角色名称查询' />
                    )}
                  </Form.Item>
                </Col>

                <Col {...ColConfig2}>
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
                      <Button
                        className='close'
                        htmlType='button'
                        onClick={this._onRoleAdd}
                      >
                                角色新增
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table
              bordered
              size='small'
              columns={this.columns}
              rowKey='id'
              dataSource={data}
              pagination={pagination}
              loading={loading}
              onChange={this._handleTableChange}
              onShowSizeChange={this._handleOnShowSizeChange}
              scroll={{ x: 120, y: tableHeight }}
              rowSelection={rowSelection}
            />
          </div>

          <div className='content2'>
            <RoleAuthTreeForm roleId={this.state.roleId} />
          </div>

          <Modal
            centered
            destroyOnClose
            title='角色新增'
            visible={this.state.roleAddVisible}
            footer={null}
            onCancel={() => this._handleCancel('roleAddVisible')}
            width={'40%'}
          >
            <RoleAddForm
              type={'roleList'}
              roleRecord={this.state.roleRecord}
              handleCancel={() => this._handleCancel('roleAddVisible')}
              onRefresh={this._roleList}
              id={this.state.roleId} />
          </Modal>
        </div>

      )
    }
}

const RoleListForm = Form.create()(Main)
export default RoleListForm
