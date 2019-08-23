import React from 'react'
import './index.scss'
import Api from 'api'
import { Button, Col, Form, Input, Row, message, Table, Divider, Popconfirm, Modal } from 'antd'
import { OrganType } from '../../../utils'
import OrganAddForm from '../OrganAdd'
import { TitleLine } from '../../../components'

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
      expandedRowKeys:[],
      loading: false,
      queryObj: {},
      visible: false,
      title: '',
      organAddVisible: false,
      organRecord:{},
      organId: '',
      parentId:'',
    };

    componentDidMount () {
      this._organList()
    }

    columns = [
      {
        title: '单位名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '单位类型',
        dataIndex: 'type',
        key: 'type',
        width: '12%',
        render:(text, record, index) => {
          let typeDesc = ''
          OrganType.map(i => {
            if (`${i[0]}` === text) {
              typeDesc = i[1]
            }
            return i
          })
          return typeDesc
        }
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
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
                onClick={() => this._organAdd({ record })}
              >
                            添加下级单位
              </a>
              <Divider type='vertical' />
              <a
                href='javascript:void();'
                onClick={() => this._organEdit({ record })}
              >
                            编辑
              </a>
              <Divider type='vertical' />
              <Popconfirm
                title='确定删除单位吗?'
                onConfirm={() => this._organDelete({ id })}
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

    _organDelete = async ({ id }) => {
      try {
        const newParams = {
          id: id,
        }
        Api.organDelete(newParams)
          .then(res => {
            if (res.errcode === 0) {
              message.info(res.errmsg)
              this._organList()
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
          const queryObj = {
            ...rest,
          }
          this.setState({ queryObj })
          this._organList(queryObj)
        }
      })
    };

    _organList = async (queryObj) => {
      try {
        this.setState({ loading: true })
        const newParams = {
          ...queryObj,
        }
        Api.organTreeList(newParams)
          .then(res => {
            if (res) {
              const { errcode, errmsg, data } = res
              if (errcode === 0) {
                this.setState({
                  data:data.dataSource,
                  expandedRowKeys: data.expandKeys,
                  loading: false, })
              } else {
                const msg = errmsg || '请求服务失败'
                message.error(msg)
              }
            }
          })
      } catch (e) {
        this.setState({ loading: false })
        message.error('请求服务异常222')
      }
    };

    _organEdit = ({ record }) => {
      this.setState({
        organAddVisible: true,
        parentId:'',
        organRecord:record,
      })
    };

    _organAdd = ({ record }) => {
      this.setState({
        organAddVisible: true,
        parentId: record.id,
        organRecord:{}
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
      const { clientHeight } = document.body
      // eslint-disable-next-line no-unused-vars
      const tableHeight = clientHeight - 240
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
            title='单位管理'
            icon='edit-1-copy'
          />
          <Form onSubmit={this._handleSubmit} className='my-division'>
            <Row>
              <Col {...ColConfig}>
                <Form.Item {...FormItemLayout} label='单位名称' style={{ marginBottom: '0px' }}>
                  {getFieldDecorator('name', {
                    rules: [{ required: false }
                    ],
                  })(
                    <Input placeholder='单位名称查询' />
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
            title='单位新增'
            visible={this.state.organAddVisible}
            footer={null}
            onCancel={() => this._handleCancel('organAddVisible')}
            width={'40%'}
          >
            <OrganAddForm
              type={'organList'}
              organRecord={this.state.organRecord}
              handleCancel={() => this._handleCancel('organAddVisible')}
              onRefresh={this._organList}
              id={this.state.organId}
              parentId={this.state.parentId} />
          </Modal>
        </div>

      )
    }
}

const OrganListForm = Form.create()(Main)
export default OrganListForm
