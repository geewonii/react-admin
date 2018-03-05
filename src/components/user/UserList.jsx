import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Select, Input, message , Modal, Tabs } from 'antd'
import { connect } from 'react-redux';
import { onLoadUserData, onDelectUser, onEditUser } from '@/action';
import UserListTable from '../tables/UserListTable';
const Option = Select.Option
const TabPane = Tabs.TabPane

class UserList extends React.Component {
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
        this.setState({loading:true})
        this.props.LoadUserData(key, this.loadCallBack)
    }
    
    // 点击
    loadDataCallBack = key => {
        this.setState({key, loading:true})
        this.props.LoadUserData(key, this.loadCallBack)
    }
    // 回调loading
    loadCallBack = () => this.setState({loading:false})

    // 编辑
    flipModal = record => this.setState({modalVisible:true, userDetails:record})
    
    // 删除
    confirmDel = Guid => onDelectUser(Guid, this.callback)
    
    confirmEdit () {
        const {userDetails} = this.state
        if(parseInt(userDetails.IDType,10)===1 && !this.isCardID(userDetails.IDNumber)){
            return false
        }else{
            onEditUser(userDetails, this.callback)
        }  
    }

    // 回调
    callback = () => {
        this.props.LoadUserData(this.state.key)
        this.setState({modalVisible:false})
    }

    // 渲染modal
    modalRender() {
        const { modalVisible, userDetails } = this.state
        if(userDetails){
            let Phone = userDetails.Phone,
                IDType = userDetails.IDType,
                IDNumber = userDetails.IDNumber,
                Sex = userDetails.Sex
            return (
                <Modal
                    title="用户信息"
                    wrapClassName="vertical-center-modal"
                    visible={modalVisible}
                    onOk={() => this.confirmEdit()}
                    okText="提交"
                    cancelText="关闭"
                    onCancel={() => this.setState({modalVisible:false})}
                >
                    <div style={{ width: 400}}>
                        证件类别：
                        <Select style={{ width: 80,marginBottom:20}} placeholder="未选择" value={IDType} onChange={this.handleChangeIDType}>
                            <Option value="0">未选择</Option>
                            <Option value="1">身份证</Option>
                            <Option value="2">护照</Option>
                        </Select>
                        <div>
                            <Input style={{marginBottom:20}} addonBefore="证件号码" placeholder="未填写" value={IDNumber} onChange={this.handleChangeIDNumber} />
                        </div>
                        <div>
                            <Input style={{marginBottom:20}} addonBefore="电话号码" placeholder="未填写" value={Phone} onChange={this.handleChangePhone} />
                        </div>
                        性别：   
                        <Select style={{ width: 100,marginRight:30 }} value={Sex} onChange={this.handleChangeSex}>
                            <Option value="0">未选择</Option>
                            <Option value="1">男</Option>
                            <Option value="2">女</Option>
                        </Select>
                    </div>
                </Modal>
            )
        }
    }

    isCardID(sId) {
        let aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
        let iSum=0
        if(!/^\d{17}(\d|x)$/i.test(sId)){
            message.error('你输入的身份证长度或格式错误')
            return false
        }
        sId = sId.replace(/x$/i,"a")
        if(aCity[parseInt(sId.substr(0,2),10)]==null){
            message.error('你的身份证地区非法')
            return false
        }
        let sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2))
        let d=new Date(sBirthday.replace(/-/g,"/"))
        if(sBirthday!==(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) {
            message.error('身份证上的出生日期非法')
            return false
        }
        for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11)
        if(iSum%11!==1){
            message.error('你输入的身份证号非法')
            return false
        }
        //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
        return true
    }

    handleChangeIDType = value => {
        let userDetails = {
            ...this.state.userDetails,
            IDType:value
        }
        this.setState({userDetails})
    }
    handleChangeIDNumber = e => {
        let userDetails = {
            ...this.state.userDetails,
            IDNumber:e.target.value
        }
        this.setState({userDetails})
    }
    handleChangePhone = e => {
        let userDetails = {
            ...this.state.userDetails,
            Phone:e.target.value
        }
        this.setState({userDetails})
    }
    handleChangeSex = value => {
        let userDetails = {
            ...this.state.userDetails,
            Sex:value
        }
        this.setState({userDetails})
    }

    render() {
        const { userList } = this.props
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="客户管理" second="客户列表" />
                <Row gutter={24}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="" bordered={false} style={{minHeight: 600}}>
                                <Tabs defaultActiveKey="all" onChange={this.loadDataCallBack}>
                                    <TabPane tab="全部" key="all">
                                        <UserListTable userList = {userList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="有效客户" key="valid">
                                        <UserListTable userList = {userList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="无效客户" key="invalid">
                                        <UserListTable userList = {userList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
                                    </TabPane>
                                    <TabPane tab="微信绑定客户" key="wechat">
                                        <UserListTable userList = {userList} flipModal={this.flipModal} confirmDel={this.confirmDel} loading={this.state.loading} />
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
  LoadUserData: (keys, loadCallBack) => dispatch(onLoadUserData(keys, loadCallBack))
});
export default connect(mapStateToPorps, mapDispatchToProps)(UserList);