import React, {Component} from 'react'
import { Table, Badge } from 'antd'
import { dateChangeStandard } from '@/common/tool';

class TableChildRender extends Component{

    render(){
        const { messageUserList } = this.props
        const columns = [
            { title: '客户姓名', dataIndex: 'FullName', key: 'FullName', render: (text, record) => !!record.FullName ? record.FullName : '/'},
            { title: '阅读状态', dataIndex: 'IsRead', key: 'IsRead', render: (text, record) =>
                parseInt(record.IsRead,10)
                ?
                <span><Badge status="success" />已读</span>
                :
                <span><Badge status="processing" />未读</span>
            },
            { title: '接收日期', dataIndex: 'CreateTime', key: 'CreateTime', render:(text,record) => record.CreateTime && dateChangeStandard(record.CreateTime)},
            { title: '读取日期', dataIndex: 'ReadTime', key: 'ReadTime', render: (text, record) => record.ReadTime ? dateChangeStandard(record.ReadTime) : '未读' },
        ];

        return (
            <Table
                columns={columns}
                dataSource={messageUserList}
            />
        )
    }
}

export default TableChildRender