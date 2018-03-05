import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Radio , Modal, Input, Button, Select, DatePicker, InputNumber, message } from 'antd'
import { connect } from 'react-redux';
import { onVioData, onSubVio, onEditVio, onDelectVio } from '@/action';
import { getAESDecrypt } from '@/common/tool';
import ViolationTable from '../tables/ViolationTable';
import moment from 'moment'
const RadioGroup = Radio.Group
const { TextArea } = Input

class Violation extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: false,
            modalVisible: false,
            modalVisible1: false,
            userDetails: null,
            userDetails1: null
        }
    }
    // init
    componentDidMount() {
        this.setState({loading: true})
        this.props.VioData(this.loadCallBack)
    }

    // loading回调
    loadCallBack = () => this.setState({loading: false})

    // 删除
    confirmDel = Id => onDelectVio(Id, this.callback)

    // 回调
    callback = () => {
        this.props.VioData()
        this.setState({modalVisible:false, modalVisible1:false})
    }

    // 添加违章记录
    addBreakData = () => this.setState({modalVisible:true})
    // 渲染modal
    modalRender() {
        const { vioBasicList } = this.props
        const { modalVisible, userDetails } = this.state
        let Name = localStorage.getItem("fullName")
        Name = typeof(Name) === "string" && getAESDecrypt(Name)
        let CarNumber = userDetails && userDetails.LicensePlate
        return (
            <Modal
                title="违章信息录入"
                wrapClassName="vertical-center-modal"
                visible={modalVisible}
                onOk={() => this.confirmEdit()}
                okText="提交"
                cancelText="关闭"
                onCancel={() => this.setState({modalVisible:false})}
            >
                <div style={{marginTop:20}}>
                    姓名：
                    <Select style={{ width: 120 }} placeholder="未选择" onChange={this.handleBorrowerId}>
                        {
                            vioBasicList && vioBasicList.map((item, idx) => {
                                return <Select.Option key={idx} value={item.BorrowerId}>{getAESDecrypt(item.FullName)}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <div style={{marginTop:20}}>车牌：{CarNumber}</div>
                <div style={{marginTop:20}}>
                    <Input addonBefore="违章标题" placeholder="未填写" onChange={this.handleIllegalTitle} />
                </div>
                <div style={{marginTop:20}}>
                    <div>违规描述：</div>
                    <TextArea
                        style={{ marginTop: 5 }}
                        placeholder="未填写"
                        maxLength={255}
                        onChange={this.handleIllegalDescribe}
                    />
                </div>
                <div style={{marginTop:20}}>
                    <Input addonBefore="违章地点" placeholder="未填写" onChange={this.handleIllegalAddress} />
                </div>
                <div style={{marginTop:20}}>
                    违章时间：
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="未选择"
                        onChange={this.handleIllegalTime}
                    />
                </div>
                <div style={{marginTop:20}}>
                    罚款金额：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        min={0}
                        step={50}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        onChange={this.handleFinePrice}
                    />
                    手续费：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        min={0}
                        step={10}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        onChange={this.handleAroundFee}
                    />

                    分数：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        min={1}
                        max={12}
                        onChange={this.handlePoints}
                    />
                </div>
                <div style={{marginTop:20}}>
                    处理状态：
                    <RadioGroup defaultValue={0} onChange={this.handleProcessingState}>
                        <Radio value={0}>未支付</Radio>
                        <Radio value={1}>已支付</Radio>
                        <Radio value={2}>已完成</Radio>
                    </RadioGroup>
                </div>
                <div style={{marginTop:20}}>操作人：{Name}</div>
                <div style={{marginTop:20}}>
                    <div>备注：</div>
                    <TextArea
                        style={{ marginTop: 5 }}
                        placeholder="未填写"
                        maxLength={255}
                        onChange={this.handleRemark}
                    />
                </div>
            </Modal>
        )
    }
    //过滤func
    filtrationErr = (value, str) => {
        let s = typeof (value ? value : message.error(str))
        if (s === 'function') {
            return false
        } else {
            return true
        }
    }
    // 提交
    confirmEdit () {
        const {userDetails} = this.state
        if (userDetails) {
            let on =
                this.filtrationErr(userDetails.BorrowerId, '请选择客户姓名')
                &&
                this.filtrationErr(userDetails.IllegalTitle, '请填写违章标题')
                &&
                this.filtrationErr(userDetails.IllegalDescribe, '请填写违章描述')
                &&
                this.filtrationErr(userDetails.IllegalAddress, '请填写违章地点')
                &&
                this.filtrationErr(userDetails.IllegalTime, '请选择时间')
                &&
                this.filtrationErr(userDetails.FinePrice, '请填写罚款金额')
                &&
                this.filtrationErr(userDetails.AroundFee, '请填写所需手续费')
                &&
                this.filtrationErr(userDetails.Points, '请填写分数')
            if (on) onSubVio(userDetails, this.callback)
        }else{
            message.error("请选择客户姓名")
        }
    }

    // 编辑
    flipModal = record => this.setState({modalVisible1:true, userDetails1:record})
    //编辑违章记录
    modalEdit() {
        const { modalVisible1, userDetails1 } = this.state
        let Name = localStorage.getItem("fullName")
        Name = typeof(Name) === "string" && getAESDecrypt(Name)
        let FullName = userDetails1 ? userDetails1.FullName : '',
            LicensePlate = userDetails1 ? userDetails1.LicensePlate : '',
            IllegalTitle = userDetails1 ? userDetails1.IllegalTitle : '',
            IllegalDescribe = userDetails1 ? userDetails1.IllegalDescribe : '',
            IllegalAddress = userDetails1 ? userDetails1.IllegalAddress : '',
            IllegalTime = userDetails1 ? userDetails1.IllegalTime : '2015-01-01',
            FinePrice = userDetails1 ? userDetails1.FinePrice : 0,
            AroundFee = userDetails1 ? userDetails1.AroundFee : 0,
            Points = userDetails1 ? userDetails1.Points : 0,
            ProcessingState = userDetails1 ? parseInt(userDetails1.ProcessingState,10) : '',
            Remark = userDetails1 ? userDetails1.Remark : ''
        return (
            <Modal
                title="违章信息编辑"
                wrapClassName="vertical-center-modal"
                visible={modalVisible1}
                onOk={() => this.saveEdit()}
                okText="保存"
                cancelText="关闭"
                onCancel={() => this.setState({modalVisible1:false})}
            >
                <div style={{marginTop:20}}>
                    姓名：{getAESDecrypt(FullName)}
                </div>
                <div style={{marginTop:20}}>
                    车牌：{LicensePlate}
                </div>

                <div style={{marginTop:20}}>
                    <Input addonBefore="违章标题" placeholder="未填写" value={IllegalTitle} onChange={this.handleIllegalTitle} />
                </div>

                
                <div style={{marginTop:20}}>
                <div>违规描述：</div>
                    <TextArea
                        style={{ marginTop: 5 }}
                        placeholder="未填写"
                        maxLength={255}
                        value={IllegalDescribe}
                        onChange={this.handleIllegalDescribe}
                    />
                </div>

                <div style={{marginTop:20}}>
                    <Input addonBefore="违章地点" placeholder="未填写" value={IllegalAddress} onChange={this.handleIllegalAddress} />
                </div>

                <div style={{marginTop:20}}>
                    违章时间：
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="未选择"
                        value={moment(IllegalTime, 'YYYY-MM-DD HH:mm:ss')}
                        onChange={this.handleIllegalTime}
                    />
                </div>

               <div style={{marginTop:20}}>
                    罚款金额：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        value={FinePrice}
                        min={0}
                        step={50}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        onChange={this.handleFinePrice}
                    />
                    手续费：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        value={AroundFee}
                        min={0}
                        step={10}
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        onChange={this.handleAroundFee}
                    />

                    分数：
                    <InputNumber
                        style={{ marginRight: 20 }}
                        value={Points}
                        min={1}
                        max={12}
                        onChange={this.handlePoints}
                    />
                </div>

                <div style={{marginTop:20}}>
                    处理状态：
                    <Radio.Group name="ProcessingState" value={ProcessingState} onChange={this.handleProcessingState}>
                        <Radio value={0}>未支付</Radio>
                        <Radio value={1}>已支付</Radio>
                        <Radio value={2}>已完成</Radio>
                    </Radio.Group>
                </div>

                <div style={{marginTop:20}}>操作人：{Name}</div>

                
                <div style={{marginTop:20}}>
                    <div>备注：</div>
                    <TextArea
                        style={{ marginTop: 5 }}
                        placeholder="未填写"
                        maxLength={255}
                        value={Remark}
                        onChange={this.handleRemark}
                    />
                </div>
            </Modal>
        )
    }
    //保存编辑记录
    saveEdit() {
        const { userDetails1 } = this.state
        let on =
            this.filtrationErr(userDetails1.IllegalTitle, '请填写违章标题')
            &&
            this.filtrationErr(userDetails1.IllegalDescribe, '请填写违章描述')
            &&
            this.filtrationErr(userDetails1.IllegalAddress, '请填写违章地点')
            &&
            this.filtrationErr(userDetails1.IllegalTime, '请选择时间')
            &&
            this.filtrationErr(userDetails1.FinePrice, '请填写罚款金额')
            &&
            this.filtrationErr(userDetails1.AroundFee, '请填写所需手续费')
            &&
            this.filtrationErr(userDetails1.Points, '请填写分数')
        if (on) onEditVio(userDetails1, this.callback)
    }

    handleBorrowerId = value => {
        const { vioBasicList } = this.props
        if(vioBasicList){
            let LicensePlate = null, CarId = null
            for(let i=0;i<vioBasicList.length;i++){
                if (vioBasicList[i].BorrowerId === value) {
                    LicensePlate = vioBasicList[i].CarNumber
                    CarId = vioBasicList[i].CarId
                }
            }
            let userDetails = {
                ...this.state.userDetails,
                BorrowerId: value,
                LicensePlate,
                CarId
            }
            this.setState({ userDetails })
        }
    }
    handleIllegalTitle = e => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                IllegalTitle: e.target.value
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                IllegalTitle: e.target.value
            }
            this.setState({ userDetails })
        }
    }
    handleIllegalDescribe = e => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                IllegalDescribe: e.target.value
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                IllegalDescribe: e.target.value
            }
            this.setState({ userDetails })
        }
    }
    handleIllegalAddress = e => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                IllegalAddress: e.target.value
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                IllegalAddress: e.target.value
            }
            this.setState({ userDetails })
        }
    }
    handleIllegalTime = (value, dateString) => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                IllegalTime: dateString
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                IllegalTime: dateString
            }
            this.setState({ userDetails })
        }
    }
    handleFinePrice = value => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                FinePrice: value ? value.toString() : ''
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                FinePrice: value ? value.toString() : ''
            }
            this.setState({ userDetails })
        }
    }
    handleAroundFee = value => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                AroundFee: value ? value.toString() : ''
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                AroundFee: value ? value.toString() : ''
            }
            this.setState({ userDetails })
        }
    }
    handlePoints = value => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                Points: value ? value.toString() : ''
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                Points: value ? value.toString() : ''
            }
            this.setState({ userDetails })
        }
    }
    handleProcessingState = e => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                ProcessingState: e.target.value ? e.target.value.toString() : '0'
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                ProcessingState: e.target.value ? e.target.value.toString() : '0'
            }
            this.setState({ userDetails })
        }
    }
    handleRemark = e => {
        if(this.state.userDetails1){
            let userDetails1 = {
                ...this.state.userDetails1,
                Remark: e.target.value ? e.target.value.trim() : ''
            }
            this.setState({ userDetails1 })
        }else{
            let userDetails = {
                ...this.state.userDetails,
                Remark: e.target.value ? e.target.value.trim() : ''
            }
            this.setState({ userDetails })
        }
    }

    render() {
        const { vioList } = this.props
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="客户管理" second="违章录入" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="" bordered={false} style={{minHeight: 600}}>
                                <Button style={{margin:20,marginLeft:0}} type="primary" onClick={this.addBreakData}> + 添加违章记录</Button>
                                <ViolationTable vioList={vioList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                            </Card>
                        </div>
                    </Col>
                </Row>
                {this.modalRender()}
                {this.modalEdit()}
            </div>
        )
    }
}
const mapStateToPorps = state => state.httpData
const mapDispatchToProps = dispatch => ({
    VioData: (loadCallBack) => dispatch(onVioData(loadCallBack)),
});
export default connect(mapStateToPorps, mapDispatchToProps)(Violation);