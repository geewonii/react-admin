import React, {Component} from 'react'
import { Table, Icon, Badge, Popconfirm } from 'antd'
import { dateChangeStandard, getAESDecrypt } from '@/common/tool';

class TableRender extends Component {

    render() {
        const { vioList, loading, flipModal, confirmDel } = this.props
        const columns = [
            {title: '姓名',dataIndex: 'FullName', key: 'FullName', width:100,render:(text,record) => getAESDecrypt(record.FullName)},
            {title: '车牌',dataIndex: 'LicensePlate', key: 'LicensePlate',width:80},
            {title: '违规标题',dataIndex: 'IllegalTitle', key: 'IllegalTitle',width:100,render:(text,record) => <span>{record.IllegalTitle}</span>},
            {title: '违规描述',dataIndex: 'IllegalDescribe', key: 'IllegalDescribe',width:100},
            {title: '违章地点',dataIndex: 'IllegalAddress', key: 'IllegalAddress',width:100},
            {title: '违章时间',dataIndex: 'IllegalTime', key: 'IllegalTime',width:120,render:(text,record) => record.IllegalTime && dateChangeStandard(record.IllegalTime)},
            {title: '罚款金额',dataIndex: 'FinePrice', key: 'FinePrice',width:100,render:(text,record) => record.FinePrice ? parseFloat(record.FinePrice).toFixed(2) : '/'},
            {title: '手续费',dataIndex: 'AroundFee', key: 'AroundFee',width:100,render:(text,record) => record.AroundFee ? parseFloat(record.AroundFee).toFixed(2) : '/'},
            {title: '分数',dataIndex: 'Points', key: 'Points',width:100},
            {
                title: '处理状态',
                dataIndex: 'ProcessingState',
                key: 'ProcessingState',
                width:100,
                render: (text, record) => 
                    parseInt(record.ProcessingState,10)
                    ?
                    parseInt(record.ProcessingState,10) === 1
                    ?
                    <span><Badge status="success" />已支付</span>
                    :
                    <span><Badge status="default" />已完成</span>
                    :
                    <span><Badge status="processing" />未支付</span>
            }, 
            {title: '操作人',dataIndex: 'ManageName', key: 'ManageName',width:100,render:(text,record) => getAESDecrypt(record.ManageName)},
            {title: '处理时间',dataIndex: 'StateTime', key: 'StateTime',width:120,render:(text,record) => record.StateTime && dateChangeStandard(record.StateTime)},
            {title: '备注',dataIndex: 'Remark', key: 'Remark',width:100},
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:80,
                render: (text, record) =>
                    <span>
                        <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="edit" /></a>
                        <span className="ant-divider" />
                        <Popconfirm title="确定删除吗?" placement="topLeft" onConfirm={confirmDel.bind(this,record.Id)} okText="确定" cancelText="取消">
                            <a href=" javascript:;"><Icon type="delete" /></a>
                        </Popconfirm>
                    </span>
            }
        ]
       
        return (
            <Table
                dataSource={vioList}
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