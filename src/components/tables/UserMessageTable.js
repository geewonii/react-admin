import React, {Component} from 'react'
import { Table, Icon, Badge, Popconfirm } from 'antd'
import { dateChangeStandard } from '@/common/tool';

class TableRender extends Component {

    render() {
        const { userMessageList, loading, flipModal, confirmDel, signs } = this.props
        const columns = [
            {title: 'ID',dataIndex: 'Id', key: 'Id'},
            {title: '姓名',dataIndex: 'FullName', key: 'FullName'},
            {title: '手机号',dataIndex: 'Phone', key: 'Phone'},
            {title: '反馈内容',dataIndex: 'Content', key: 'Content'},
            {title: '反馈日期',dataIndex: 'CreateTime', key: 'CreateTime',render:(text,record) => record.CreateTime ? dateChangeStandard(record.CreateTime) : "/" },
            {
                title: '是否读取',
                dataIndex: 'IsReply',
                key: 'IsReply',
                render: (text, record) =>
                    parseInt(record.IsReply,10)
                    ?
                    <span><Badge status="success" />已读</span>
                    :
                    <span><Badge status="processing" />未读</span>
            },
            {title: '审核人',dataIndex: 'ManageName', key: 'ManageName',render: (text, record) => record.ManageName ? record.ManageName : '/'},
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:80,
                render: (text, record) =>
                {   
                    let IsReply = parseInt(record.IsReply,10) ? '确定标记为未读?' : '确定标记为已读?'
                    return(
                        <span>
                            <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="idcard" /></a>
                            <span className="ant-divider" />
                            <Popconfirm title={IsReply} placement="topLeft" onConfirm={signs.bind(this,record)} okText="确定" cancelText="取消">
                                <a href=" javascript:;"><Icon type="eye-o" /></a>
                            </Popconfirm>
                            <span className="ant-divider" />
                            <Popconfirm title="您确定设为无效项吗?" placement="topLeft" onConfirm={confirmDel.bind(this,record.Id)} okText="确定" cancelText="取消">
                                <a href=" javascript:;"><Icon type="delete" /></a>
                            </Popconfirm>
                        </span>
                    )
                }
            }
        ]
        
        return (
            <Table
                dataSource={userMessageList}
                loading={loading}
                columns={columns}
                pagination={{
                    showTotal: total => `共 ${total} 条记录`,
                    showQuickJumper:true
                }}
            />
        )
    }
}

export default TableRender