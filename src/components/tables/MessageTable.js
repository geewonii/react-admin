import React, {Component} from 'react'
import { Table, Icon, Badge, Popconfirm } from 'antd'
import { dateChangeStandard } from '@/common/tool';

class TableRender extends Component {

    render() {
        const { messageList, loading, flipModal, confirmDel } = this.props
        const columns = [
            {title: 'ID',dataIndex: 'Id', key: 'Id'},
            {
                title: '是否有效',
                dataIndex: 'Isvalid',
                key: 'Isvalid',
                render: (text, record) =>
                    parseInt(record.Isvalid,10)
                    ?
                    <span><Badge status="success" />有效</span>
                    :
                    <span><Badge status="error" />无效</span>
            }, 
            {title: '标题',dataIndex: 'Title', key: 'Title'},
            {title: '内容',dataIndex: 'Content', key: 'Content'},
            {title: '创建日期',dataIndex: 'CreateTime', key: 'CreateTime', width:120, render:(text,record) => record.CreateTime && dateChangeStandard(record.CreateTime)},
            {title: '真实姓名',dataIndex: 'FullName', key: 'FullName'},
            {
                title: '是否群发',
                dataIndex: 'IsMass',
                key: 'IsMass',
                render: (text, record) =>
                    parseInt(record.IsMass,10)
                    ?
                    <span><Badge status="default" />群发</span>
                    :
                    <span><Badge status="warning" />非群发</span>
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:80,
                render: (text, record) =>
                {
                    if(parseInt(record.Isvalid,10)){
                        return(
                            <span>
                                <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="idcard" /></a>
                                <span className="ant-divider" />
                                <Popconfirm title="您确定设为无效项吗?" placement="topLeft" onConfirm={confirmDel.bind(this,record.Id)} okText="确定" cancelText="取消">
                                    <a href=" javascript:;"><Icon type="delete" /></a>
                                </Popconfirm>
                            </span>
                        )
                    }else{
                        return <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="idcard" /></a>
                    }
                }
            }
        ]
        
        return (
            <Table
                dataSource={messageList}
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