import React, {Component} from 'react'
import { Table, Icon, Badge } from 'antd'
import { dateChangeStandard } from '@/common/tool';

class TableRender extends Component {

    render() {
        const { rentList, loading, flipModal } = this.props

        const columns = [
            {title: '真实姓名',dataIndex: 'FullName', key: 'FullName'},
            {title: '借款人手机',dataIndex: 'CreditPhone', key: 'CreditPhone'},
            {title: '创建日期',dataIndex: 'CreateTime', key: 'CreateTime', width:120, render: (text, record) => record.CreateTime && dateChangeStandard(record.CreateTime)},
            {title: '标题',dataIndex: 'Title', key: 'Title'},
            {title: '借款金额',dataIndex: 'CreditAmount', key: 'CreditAmount',render:(text,record) => record.CreditAmount ? parseFloat(record.CreditAmount).toFixed(2) : '/'},
            {
                title: '审核状态',
                dataIndex: 'IsAudit',
                key: 'IsAudit',
                render: (text, record) => 
                    parseInt(record.IsAudit,10)
                    ?
                    parseInt(record.IsAudit,10) === 1
                    ?
                    <span><Badge status="success" />已通过</span>
                    :
                    <span><Badge status="error" />未通过</span>
                    :
                    <span><Badge status="processing" />未审核</span>
            },
            {title: '审核人',dataIndex: 'Auditor', key: 'Auditor'},
            {title: '审核意见',dataIndex: 'AuditorRemark', key: 'AuditorRemark'},
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width:60,
                render: (text, record) => <a href=" javascript:;" onClick={flipModal.bind(this,record)}><Icon type="edit" /></a>
            }
        ]
        return (
            <Table
                dataSource={rentList}
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