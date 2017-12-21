
const website = 'https://www.jieyunhaoche.com'

export default {
    hotLine: '02038831513',
    versionUpdate: website + '/static/update.json',
    rentProtocolUrl: website + '/static/rent.html',
    borrowProtocolUrl: website + '/static/borrow.html',
    // url中不能含有变量，否则会报 Possible Unhandled Promise Rejection (id: 1)
    carIntroduce: website + '/api/v1/home/get/car_introduce',

    sql: website + '/api/v1/sqls/post/Sql',
    homeInfo: website + "/api/v1/home/get/home_info",
    swiper: website + '/api/v1/home/get/swiper',
    checkLogined: website + '/api/v1/users/get/CheckLogined',
    verifyCode: website + '/api/v1/users/post/verify_code',
    queryIllegalities: website + '/api/v1/illegalities/post/query_illegalities',
    login: website + '/api/v1/users/post/Login',
    logout: website + '/api/v1/users/post/Logout',
    modifyUserInfo: website + '/api/v1/users/post/modify_user_info',
    queryUserMessage: website + '/api/v1/users/post/query_user_message',
    wechatAuth: website + '/api/v1/users/post/wechat_auth',
    verifyMobile: website + '/api/v1/users/post/verify_mobile',
    queryApplyCount: website + '/api/v1/rents/post/query_apply_count',
    //queryVehType: website + '/query_veh_type',
    queryRentDetail: website + '/api/v1/rents/post/query_rent_detail',
    queryRentTypeList: website + '/api/v1/rents/post/query_rent_type_list',
    queryRentAddition: website + '/api/v1/rents/post/query_rent_addition',
    rentApply: website + '/api/v1/rents/post/rent_apply',
    queryUserInfo: website + '/api/v1/users/post/query_user_info',
    queryRentTotalInfo: website + '/api/v1/rents/post/query_rent_total_info',
    driverApply: website + '/api/v1/rents/post/driver_apply',
    feedbackApply: website + '/api/v1/mine/post/feeback_apply',

    queryMenuList: website + '/api/v1/webs/get/query_menu_list',
    backgroundImages: website + '/static/web/icon1.png',
    managerRegister : website + '/api/v1/managers/post/register',
    // 参数
    // aliases
    // password
    //fullName
    managerLogin: website + '/api/v1/managers/post/login',
    // 参数
    // aliases
    // password
    managerLogout: website + '/api/v1/managers/post/logout',
    
    // 无参数
    managerCheckLogined: website + '/api/v1/managers/post/check_logined',
    // 获取客户列表
    queryCustomerList: website + '/api/v1/customers/post/query_customer_list',

    //查询以租代售列表
    // queryType, audit: 已审核, unaudit: 未审核, queryFrom, queryCount
    // 输出：Id, IsValid, CreateTime, BorrowerId, FullName, Title, CreditAmount, CreditPhone, IsAudit, JudgeId, Auditor, AuditorRemark 
    queryLoanList: website + '/api/v1/rents/post/query_loan_list',

    //查询司机列表
    // queryType, audit: 已审核,unaudit: 未审核
    // 输出：Guid, IsValid, UpdateTime, FullName, Phone, IsAudit, AuditTime, JudgeId, Auditor, AuditorRemark
    queryDriverList: website + '/api/v1/rents/post/query_driver_list',
    
    //获取管理列表
    // queryFrom, queryCount
    // 输出： Guid, IsValid, CreateTime, Aliases, FullName, QQ
    queryManagerList: website + '/api/v1/customers/post/query_manager_list',

    // 查询单用户的信息
    // guid
    // 输出： Guid, IsValid, CreateTime, UpdateTime, Aliases, FullName, Phone, IsValidatePhone, IDNumber, IDType, IsIDNumber, Sex
    queryCustomerInfo: website + '/api/v1/customers/post/query_customer_info',

    //查询单个管理员的信息
    // guid
    // 输出： Guid, IsValid, CreateTime, Aliases, FullName, QQ
    queryManagerInfo: website + '/api/v1/customers/post/query_manager_info',

    // 查询消息列表
    // isMall 0 不是群发 1 群发 99 不限条件
    // isValid 0 无效 1 有效 99 不限条件
    // queryFrom
    // queryCount
    queryMessageInfo: website + '/api/v1/messages/post/query_message_info',
    
    // 查询某个消息对应用户的列表
    // MainNotifyMessageId 消息id
    // isValid 0 无效 1 有效 99 不限条件
    // queryFrom
    // queryCount
    queryMessageUserInfo: website + '/api/v1/messages/post/query_message_user_info',
    
    // 对某条消息，置为无效
    // MainNotifyMessageId 消息id
    setMessageInvalid: website + '/api/v1/messages/post/set_message_invalid',
    
    // 创建消息
    // isMall 0 不是群发 1 群发
    // title 标题
    // content 内容，限制最长为255
    // userIdList 如果isMall=0，需要提供，用户编号列表，每个以,分隔
    createMessage: website + '/api/v1/messages/post/create_message',
}

/*export function recommendUrlWithId(id) {
    return 'http://api.meituan.com/group/api/v1/deal/recommend/collaborative?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=hWCwhGYpNTG7TjXWHOwPykgoKX0%3D&__skno=433ACF85-E134-4FEC-94B5-DA35D33AC753&__skts=1436343274.685593&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&cate=0&ci=1&cityId=1&client=iphone&did=' + id + '&district=-1&fields=id%2Cslug%2Cimgurl%2Cprice%2Ctitle%2Cbrandname%2Crange%2Cvalue%2Cmlls%2Csolds&hasbuy=0&latlng=0.000000%2C0.000000&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-07-08-15-36746&offset=0&scene=view-v4&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_i550poi_ktv__d__j___ab_i_group_5_3_poidetaildeallist__a__b___ab_gxhceshi0202__b__a___ab_pindaoquxincelue0630__b__b1___ab_i_group_5_6_searchkuang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_i550poi_xxyl__b__leftflow___ab_b_food_57_purepoilist_extinfo__a__a___ab_waimaiwending__a__a___ab_waimaizhanshi__b__b1___ab_i550poi_lr__d__leftflow___ab_i_group_5_5_onsite__b__b___ab_xinkeceshi__b__leftflowGhomepage_guess_27774127&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7'
}*/
