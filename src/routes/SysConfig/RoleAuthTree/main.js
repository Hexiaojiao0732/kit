import React from 'react'
import { Tree, Input, message, Button, Form } from 'antd'
import Api from 'api'
import PropTypes from 'prop-types'

const { TreeNode } = Tree
const { Search } = Input

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

class Main extends React.PureComponent {
  static propTypes = {
    roleId: PropTypes.number
  }
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    treeData:[],
    roleId:-1,
    submit: false,
    searchValue:'',
    dataList:[],
  };

  static defaultProps = {
    roleId: '',
  };

  componentWillReceiveProps (nextProps, nextContext) {
    const { roleId } = nextProps
    this._roleAuthTreeList({ roleId })
  }

  componentDidMount () {
    this._authTreeList()
    this._authDataList()
  }

  _authTreeList = async () => {
    try {
      Api.allAuthList().then(res => {
        const { data } = res
        this.setState({ treeData: data.dataSource })
      })
    } catch (e) {
      message.error('请求服务异常')
    }
  };

  _authDataList = async () => {
    try {
      Api.authDataList().then(res => {
        const { data } = res
        this.setState({ dataList: data })
      })
    } catch (e) {
      message.error('请求服务异常')
    }
  };

  _roleAuthTreeList = async ({ roleId }) => {
    try {
      const newParams = {
        id: roleId,
      }
      Api.roleAuthIds(newParams).then(res => {
        const { data } = res
        this.setState({ checkedKeys: data, roleId: roleId })
      })
    } catch (e) {
      message.error('请求服务异常')
    }
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys)
    this.setState({ checkedKeys: checkedKeys })
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info)
    this.setState({ selectedKeys })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.id} {...item} />
    });

    _authSaveClick= async () => {
      try {
        this.setState({ submit: true })
        const newParams = {
          roleId: this.state.roleId,
          authIds: this.state.checkedKeys,
        }
        Api.roleAuthAdd(newParams).then(res => {
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
    }

    onChange = e => {
      const { value } = e.target
      const expandedKeys = this.state.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.id, this.state.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    };

    render () {
      const { searchValue, expandedKeys, autoExpandParent } = this.state
      const loop = data =>
        data.map(item => {
          const index = item.title.indexOf(searchValue)
          const beforeStr = item.title.substr(0, index)
          const afterStr = item.title.substr(index + searchValue.length)
          const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          )
          if (item.children) {
            return (
              <TreeNode key={item.id} title={title}>
                {loop(item.children)}
              </TreeNode>
            )
          }
          return <TreeNode key={item.id} title={title} />
        })
      return (
        <div style={{ height:'88vh',
          border:'1px dashed #C0C0C0',
          paddingLeft:'10px',
          paddingTop:'10px',
          overflowY:'scroll' }}>
          <Search style={{ marginBottom: 8 }} placeholder='Search' onChange={this.onChange} />
          <Button type='primary' onClick={this._authSaveClick}>保存</Button>
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {loop(this.state.treeData)}
          </Tree>
        </div>
      )
    }
}
const RoleAuthTreeForm = Form.create()(Main)
export default RoleAuthTreeForm
