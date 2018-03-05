import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Radio , Modal, Tabs, Input } from 'antd'
import { connect } from 'react-redux';
import { onDriverData, onSubDriver } from '@/action';
import { getAESDecrypt } from '@/common/tool';
import DriverTable from '../tables/DriverTable';
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const { TextArea } = Input

class Driver extends React.Component {
    constructor() {
        super()
        this.state = {
            key: "all",
            loading: false,
            modalVisible:false,
            userDetails: null
        }
    }
    // init
    componentDidMount() {
        const { key } = this.state
        this.setState({loading: true})
        this.props.DriverData(key, this.loadCallBack)
    }

    // loading回调
    loadCallBack = () => this.setState({loading: false})

    // 点击回调
    loadDataCallBack = key => {
        this.setState({key, loading: true})
        this.props.DriverData(key, this.loadCallBack)
    }

    // 编辑
    flipModal = record => this.setState({modalVisible:true, userDetails:record})
    
    // 提交
    confirmEdit () {
        const {userDetails} = this.state
        onSubDriver(userDetails, this.callback)
    }

    // 回调
    callback = () => {
        this.props.DriverData(this.state.key)
        this.setState({modalVisible:false})
    }

    // 渲染modal
    modalRender() {
        const { modalVisible, userDetails } = this.state
        let Name = localStorage.getItem("fullName")
        Name = typeof(Name) === "string" && getAESDecrypt(Name)
        if(userDetails){
            let IsAudit = parseInt(userDetails.IsAudit,10),
                AuditorRemark = userDetails.AuditorRemark,
                FullName = userDetails.FullName,
                Phone = userDetails.Phone
            return (
                <Modal
                    title="审核操作"
                    wrapClassName="vertical-center-modal"
                    visible={modalVisible}
                    onOk={() => this.confirmEdit()}
                    okText="提交"
                    cancelText="关闭"
                    onCancel={() => this.setState({modalVisible:false})}
                >
                    <div style={{marginBottom:10}}>真实姓名：{FullName}</div>
                    <div style={{marginBottom:10}}>手机号：{Phone}</div>
                    <div style={{marginTop:20,marginBottom:10}}>
                        <RadioGroup value={IsAudit} onChange={this.onChangeRadio}>
                            <Radio value={1}>通过</Radio>
                            <Radio value={2}>不通过</Radio>
                        </RadioGroup>
                    </div>
                    <TextArea rows={4} placeholder="请填写审核意见" value={AuditorRemark} onChange={this.onChangeAuditorRemark} />
                    <div style={{marginTop:20}}>审核人：{Name}</div>
                </Modal>
            )
        }
    }

    onChangeRadio = e => {
        let userDetails = {
            ...this.state.userDetails,
            IsAudit: e.target.value
        }
        this.setState({userDetails})
    }
    onChangeAuditorRemark = e => {
        let userDetails = {
            ...this.state.userDetails,
            AuditorRemark: e.target.value
        }
        this.setState({userDetails})
    }

    render() {
        const { driverList } = this.props
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="客户管理" second="司机招募" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="" bordered={false} style={{minHeight: 600}}>
                                <Tabs defaultActiveKey="all" onChange={this.loadDataCallBack}>
                                    <TabPane tab="全部" key="all">
                                        <DriverTable driverList = {driverList} flipModal={this.flipModal} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="已审核" key="audit">
                                        <DriverTable driverList = {driverList} flipModal={this.flipModal} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="未审核" key="unaudit">
                                        <DriverTable driverList = {driverList} flipModal={this.flipModal} loading={this.state.loading} />
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </div>
                    </Col>
                </Row>
                {this.modalRender()}
            </div>
        )
    }
}
const mapStateToPorps = state => state.httpData
const mapDispatchToProps = dispatch => ({
    DriverData: (keys, loadCallBack) => dispatch(onDriverData(keys, loadCallBack))
});
export default connect(mapStateToPorps, mapDispatchToProps)(Driver);