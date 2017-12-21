import React, {Component} from 'react'
import { Table, Icon, Popconfirm, Badge } from 'antd'
import { dateChangeStandard } from '@/common/tool';

class TableRender extends Component {

    render() {
      const { userList, flipModal, confirmDel, loading } = this.props
      const columns = [
          {title: '姓名',dataIndex: 'FullName', width:120, key: 'FullName'},
          {
              title: '性别',
              dataIndex: 'Sex', 
              key: 'Sex', 
              width:60,
              render: (text, record) => parseInt(record.Sex,10) ? (parseInt(record.Sex,10)===1? '男':'女') : '未选择'
          },
          {title: '电话',dataIndex: 'Phone', key: 'Phone',width:100},
          {
              title: '号码验证',
              dataIndex: 'IsValidatePhone', 
              key: 'IsValidatePhone',
              width:80,
              render: (text, record) => 
              record.IsValidatePhone
              ?
              <span><Badge status="success" />已验证</span>
              : 
              <span><Badge status="processing" />未验证</span>
          },
          {title: '证件号',dataIndex: 'IDNumber', key: 'IDNumber',width:120}, 
          {
            title: '证件类别',
            dataIndex: 'IDType',
            key: 'IDType',
            width:80,
            render: (text, record) => parseInt(record.IDType,10) ? (parseInt(record.IDType,10)===1? '身份证':'护照') : '未选择'
          },
          {
              title: '证件验证',
              width:80,
              dataIndex: 'IsIDNumber',
              key: 'IsIDNumber',
              render: (text, record) =>
              parseInt(record.IsIDNumber,10)
              ?
              <span><Badge status="success" />已验证</span>
              : 
              <span><Badge status="processing" />未验证</span>
          },
          {
            title: '创建日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width:100,
            render: (text, record) => record.createTime && dateChangeStandard(record.createTime)
            },
          {
              title: '操作',
              dataIndex: 'action',
              key: 'action',
              width:80,
              render: (text, record) =>
              {
                  if(parseInt(record.IsValid,10)){
                      return (
                          <span>
                              <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="edit" /></a>
                              <span className="ant-divider" />
                              <Popconfirm title="确定改为无效项吗?" placement="topLeft" onConfirm={confirmDel.bind(this,record.Guid)} okText="确定" cancelText="取消">
                                  <a href=" javascript:;"><Icon type="delete" /></a>
                              </Popconfirm>
                          </span>
                      )
                  } else {
                      return ""
                  }
              }
          }
      ]
      return (
          <Table
            dataSource={userList}
            columns={columns}
            loading={loading}
            pagination={{ 
              showTotal: total => `共 ${total} 条记录`,
              showQuickJumper:true
            }}
          />
      )
    }
}

export default TableRender