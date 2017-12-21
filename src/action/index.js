import types from './type'
import Packet from '../common/packet'
import api from '../common/api'
import { getFetchOptions, getAESEncrypt, getAESDecrypt } from '../common/tool'
import { message } from 'antd'

const requestData = isFetching => ({
    type: types.REQUEST_DATA,
    isFetching
})
const loadUserData = userList => ({
    type: types.LOADUSER_DATA,
    userList
})
const rentData = rentList => ({
    type: types.RENT_DATA,
    rentList
})
const DriverData = driverList => ({
    type: types.DRIVER_DATA,
    driverList
})
const VioData = vioList => ({
    type: types.VIO_DATA,
    vioList
})
const VioBasicData = vioBasicList => ({
    type: types.VIOBASIC_DATA,
    vioBasicList
})
const MessageData = messageList => ({
    type: types.MESSAGE_DATA,
    messageList
})
const MessageForUserData = messageUserList => ({
    type: types.MESSAGEUSER_DATA,
    messageUserList
})
const UserMessageData = userMessageList => ({
    type: types.USERMESSAGEUSER_DATA,
    userMessageList
})

export const receiveData = (data, category) => ({
    type: types.RECEIVE_DATA,
    data,
    category
})

// 登录
export const onLogin = (values, callback) => dispatch => {
    let aliases = values.aliases && getAESEncrypt(values.aliases.trim()),
        password = values.password && getAESEncrypt(values.password.trim()),
        isFetching = values.isFetching
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'aliases', aliases)
        send.AddItem(0, 'password', password)
    let fetchOptions = getFetchOptions('POST', send)
    
    fetch(api.managerLogin, fetchOptions).then( response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then( json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    localStorage.setItem('guid', recv.GetItem(0, 0, 'Guid'))
                    localStorage.setItem('aliases', recv.GetItem(0, 0, 'Aliases'))
                    if (values.isRemember === true) {
                        localStorage.setItem('fullName', recv.GetItem(0, 0, 'FullName'))
                        localStorage.setItem('password', password)
                    } else {
                        localStorage.removeItem('fullName')
                        localStorage.removeItem('password')
                    }
                    dispatch(requestData(isFetching))
                    callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) ) 
}
// 注册
export const onRegister = (values, callback) => dispatch => {
    let aliases = values.userName && values.userName.trim(),
        password = values.password && values.password.trim(),
        fullName = values.fullName && values.fullName.trim()
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'aliases',getAESEncrypt(aliases))
        send.AddItem(0, 'password',getAESEncrypt(password))
        send.AddItem(0, 'fullName', getAESEncrypt(fullName))
        
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.managerRegister, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.info(recv.Message)
                } else {
                    message.success("注册成功！")
                    callback && callback()
                }
            }).catch(error => message.error(error) )
        }
    }).catch(error => message.error(error) )    
}


// 获取客户列表
export const onLoadUserData = (keys, loadCallBack) => (dispatch) => {
    let queryType = keys ? keys : "all"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'queryType', queryType)
    send.AddItem(0, 'queryFrom', 0)
    send.AddItem(0, 'queryCount', 20) //消息条数
    let fetchOptions = getFetchOptions('POST', send)
    fetch(api.queryCustomerList, fetchOptions).then(response => {
      if (response.status !== 200) {
          message.error(response.status)
      } else {
          response.json().then(json => {
              let recv = new Packet()
              recv.ReadFrom(json)
              if (recv.Code === 0) {
                  message.error(recv.Message)
              }else{
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                        rec.key = recv.GetItem(0, i, 'Id')
                        rec.Id = recv.GetItem(0, i, 'Id')
                        rec.FullName = recv.GetItem(0, i, 'FullName')
                        rec.Phone = recv.GetItem(0, i, 'Phone')
                        rec.IDNumber = recv.GetItem(0, i, 'IDNumber')
                        rec.IDType = recv.GetItem(0, i, 'IDType')
                        rec.Sex = recv.GetItem(0, i, 'Sex')
                        rec.Guid = recv.GetItem(0, i, 'Guid')
                        rec.IsValid = recv.GetItem(0, i, 'IsValid')
                        rec.createTime = recv.GetItem(0, i, 'createTime')
                        rec.IsIDNumber = recv.GetItem(0, i, 'IsIDNumber')
                        rec.UpdateTime = recv.GetItem(0, i, 'UpdateTime')
                        rec.Aliases = recv.GetItem(0, i, 'Aliases')
                        rec.IsValidatePhone = recv.GetItem(0, i, 'IsValidatePhone')
                        datas.push(rec)
                    }
                  dispatch(loadUserData(datas))
                  loadCallBack && loadCallBack()
              }
          }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 修改用户数据
export const onEditUser = (userDetails, callback) => {
    let IDType = userDetails.IDType || '',
        IDNumber = getAESEncrypt(userDetails.IDNumber),
        Phone = getAESEncrypt(userDetails.Phone || ''),
        Sex = userDetails.Sex,
        Guid = userDetails.Guid
        
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'SQL', `UPDATE {Borrower} SET IDType=?,IDNumber=?,Phone=?,Sex=?,IsIDNumber=?,UpdateTime=getdate() WHERE Guid=?`)
    send.AddItem(0, 'IDType', IDType)
    send.AddItem(0, 'IDNumber', IDNumber)
    send.AddItem(0, 'Phone', Phone)
    send.AddItem(0, 'Sex', Sex)
    send.AddItem(0, 'IsIDNumber', "1")
    send.AddItem(0, 'Guid', Guid)

    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    message.success('修改成功')
                    callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
//删除用户数据
export const onDelectUser = (value, callback) => {
    let Guid = value,IsValid = "0"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'SQL', `UPDATE {Borrower} SET IsValid=?,UpdateTime=GETDATE() WHERE Guid=?`)
    send.AddItem(0, 'IsValid', IsValid)
    send.AddItem(0, 'Guid', Guid)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('删除成功')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}


// 获取以租代购列表
export const onRentData = (keys, loadCallBack) => (dispatch) => {
    let queryType = keys ? keys : "all"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'queryType', queryType)
    send.AddItem(0, 'queryFrom', 0)
    send.AddItem(0, 'queryCount', 20) //消息条数
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.queryLoanList, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                        rec.key = recv.GetItem(0, i, 'Id')
                        rec.Id = recv.GetItem(0, i, 'Id')
                        rec.BorrowerId = recv.GetItem(0, i, 'BorrowerId')
                        rec.CreditPhone = recv.GetItem(0, i, 'CreditPhone')
                        rec.IsAudit = recv.GetItem(0, i, 'IsAudit')
                        rec.JudgeId = recv.GetItem(0, i, 'JudgeId')
                        rec.Auditor = recv.GetItem(0, i, 'Auditor')
                        rec.Isvalid = recv.GetItem(0, i, 'Isvalid')
                        rec.CreateTime = recv.GetItem(0, i, 'CreateTime')
                        rec.Title = recv.GetItem(0, i, 'Title')
                        rec.CreditAmount = recv.GetItem(0, i, 'CreditAmount')
                        rec.AuditorRemark = recv.GetItem(0, i, 'AuditorRemark')
                        rec.FullName = recv.GetItem(0, i, 'FullName')
                        datas.push(rec)
                    }
                    dispatch(rentData(datas))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 提交以租代购数据
export const onSubRent = (userDetails,callback) => {
    let Guid = localStorage.getItem("guid"),
        Id = userDetails.Id,
        IsAudit = userDetails.IsAudit.toString(),
        AuditorRemark = userDetails.AuditorRemark

    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT Id FROM Judge WHERE Guid = ?`)
        send.AddItem(0, 'Guid', Guid)
        send.AddDataset()
        send.AddItem(1, 'SQL', `UPDATE {LoanApply} SET JudgeId=:0_0_0, IsAudit=?, AuditorRemark=?, UpdateTime=GETDATE() WHERE Id=?`)
        send.AddItem(1, 'IsAudit', IsAudit)
        send.AddItem(1, 'AuditorRemark', AuditorRemark)
        send.AddItem(1, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('修改成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )

}


// 获取司机招募列表
export const onDriverData = (keys, loadCallBack) => (dispatch) => {
    let queryType = keys ? keys : "all"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'queryType', queryType)
    send.AddItem(0, 'queryFrom', 0)
    send.AddItem(0, 'queryCount', 20) //消息条数
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.queryDriverList, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(0, i, 'Id')
                            rec.Id = recv.GetItem(0, i, 'Id')
                            rec.Phone = recv.GetItem(0, i, 'Phone')
                            rec.IsAudit = recv.GetItem(0, i, 'IsAudit')
                            rec.JudgeId = recv.GetItem(0, i, 'JudgeId')
                            rec.IsValid = recv.GetItem(0, i, 'IsValid')
                            rec.FullName = recv.GetItem(0, i, 'FullName')
                            rec.AuditTime = recv.GetItem(0, i, 'AuditTime')
                            rec.Auditor = recv.GetItem(0, i, 'Auditor')
                            rec.AuditorRemark = recv.GetItem(0, i, 'AuditorRemark')
                            rec.Guid = recv.GetItem(0, i, 'Guid')
                            rec.CreateTime = recv.GetItem(0, i, 'CreateTime')
                        datas.push(rec)
                    }
                    dispatch(DriverData(datas))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 提交司机招募数据
export const onSubDriver = (userDetails,callback) => {
    let Guid = localStorage.getItem("guid"),
        Id = userDetails.Id,
        IsAudit = userDetails.IsAudit.toString(),
        AuditorRemark = userDetails.AuditorRemark

    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT Id FROM Judge WHERE Guid = ?`)
        send.AddItem(0, 'Guid', Guid)
        send.AddDataset()
        send.AddItem(1, 'SQL', `UPDATE {DriverApplication} SET JudgeId=:0_0_0, IsAudit=?, AuditorRemark=?, UpdateTime=GETDATE(), AuditTime=GETDATE() WHERE Id=?`)
        send.AddItem(1, 'IsAudit', IsAudit)
        send.AddItem(1, 'AuditorRemark', AuditorRemark)
        send.AddItem(1, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('修改成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )

}


// 获取违章录入列表
export const onVioData = (loadCallBack) => (dispatch) => {
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT C.*, B.FullName, J.FullName AS ManageName FROM {CarIllegal} C LEFT JOIN {Borrower} B ON C.BorrowerId = B.Id LEFT JOIN {Judge} J ON J.Id = C.JudgeId WHERE C.IsValid =?`)
        send.AddItem(0, 'IsValid', 1)

        send.AddDataset()
        send.AddItem(1, 'SQL', `SELECT B.Id, B.FullName, C.Id AS CarId, C.CarNumber FROM {Judge} J, {Car} C, {Borrower} B WHERE C.BorrowerId = B.Id `)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
            loadCallBack && loadCallBack()
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                    loadCallBack && loadCallBack()
                } else {
                    let datas = [],datas1 = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(0, i, 'Id')
                            rec.FullName = recv.GetItem(0, i, 'FullName')
                            rec.Id = recv.GetItem(0, i, 'Id')
                            rec.CarId = recv.GetItem(0, i, 'CarId')
                            rec.LicensePlate = recv.GetItem(0, i, 'LicensePlate')
                            rec.IllegalTitle = recv.GetItem(0, i, 'IllegalTitle')
                            rec.IllegalDescribe = recv.GetItem(0, i, 'IllegalDescribe')
                            rec.IllegalAddress = recv.GetItem(0, i, 'IllegalAddress')
                            rec.IllegalTime = recv.GetItem(0, i, 'IllegalTime')
                            rec.FinePrice = recv.GetItem(0, i, 'FinePrice')
                            rec.AroundFee = recv.GetItem(0, i, 'AroundFee')
                            rec.Points = recv.GetItem(0, i, 'Points')
                            rec.ProcessingState = recv.GetItem(0, i, 'ProcessingState')
                            rec.JudgeId = recv.GetItem(0, i, 'JudgeId')
                            rec.StateTime = recv.GetItem(0, i, 'StateTime')
                            rec.Remark = recv.GetItem(0, i, 'Remark')
                            rec.ManageName = recv.GetItem(0, i, 'ManageName')
                        datas.push(rec)
                    }
                    for (let i=0; i<recv.GetRecordCount(1); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(1, i, 'Id')
                            rec.BorrowerId = recv.GetItem(1, i, 'Id')
                            rec.FullName = recv.GetItem(1, i, 'FullName')
                            rec.CarId = recv.GetItem(1, i, 'CarId')
                            rec.CarNumber = recv.GetItem(1, i, 'CarNumber')
                        datas1.push(rec)
                    }
                    dispatch(VioData(datas))
                    dispatch(VioBasicData(datas1))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 提交违章录入
export const onSubVio = (userDetails,callback) => {
    let Guid = localStorage.getItem("guid"),
        BorrowerId = userDetails.BorrowerId,
        CarId = userDetails.CarId,
        LicensePlate = userDetails.LicensePlate,
        IllegalTitle = userDetails.IllegalTitle.trim(),
        IllegalDescribe = userDetails.IllegalDescribe.trim(),
        IllegalAddress = userDetails.IllegalAddress.trim(),
        IllegalTime = userDetails.IllegalTime,
        FinePrice = userDetails.FinePrice,
        AroundFee = userDetails.AroundFee,
        Points = userDetails.Points,
        ProcessingState = userDetails.ProcessingState,
        Remark = userDetails.Remark
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT Id FROM {Judge} WHERE Guid = ?`)
        send.AddItem(0, 'Guid', Guid)

        send.AddDataset()
        send.AddItem(1, 'SQL', `INSERT INTO {CarIllegal}
        (IsValid,CreateTime,UpdateTime,StateTime,BorrowerId,CarId,LicensePlate,IllegalTitle,IllegalDescribe,IllegalAddress,IllegalTime,FinePrice,AroundFee,Points,ProcessingState,Remark,JudgeId) 
        VALUES
        (1,GETDATE(),GETDATE(),GETDATE(),?,?,?,?,?,?,?,?,?,?,?,?,:0_0_0)`)
        send.AddItem(1, 'BorrowerId', BorrowerId)
        send.AddItem(1, 'CarId', CarId)
        send.AddItem(1, 'LicensePlate', LicensePlate)
        send.AddItem(1, 'IllegalTitle', IllegalTitle)
        send.AddItem(1, 'IllegalDescribe', IllegalDescribe)
        send.AddItem(1, 'IllegalAddress', IllegalAddress)
        send.AddItem(1, 'IllegalTime', IllegalTime)
        send.AddItem(1, 'FinePrice', FinePrice)
        send.AddItem(1, 'AroundFee', AroundFee)
        send.AddItem(1, 'Points', Points)
        send.AddItem(1, 'ProcessingState', ProcessingState)
        send.AddItem(1, 'Remark', Remark)

    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('添加成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 编辑违章录入
export const onEditVio = (userDetails,callback) => {
    let Guid = localStorage.getItem("guid"),
        Id = userDetails.Id,
        IllegalTitle = userDetails.IllegalTitle.trim(),
        IllegalDescribe = userDetails.IllegalDescribe.trim(),
        IllegalAddress = userDetails.IllegalAddress.trim(),
        IllegalTime = userDetails.IllegalTime,
        FinePrice = userDetails.FinePrice,
        AroundFee = userDetails.AroundFee,
        Points = userDetails.Points,
        ProcessingState = userDetails.ProcessingState,
        Remark = userDetails.Remark
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT Id FROM {Judge} WHERE Guid = ?`)
        send.AddItem(0, 'Guid', Guid)

        send.AddDataset()
        send.AddItem(1, 'SQL', `UPDATE {CarIllegal} SET
            IllegalTitle=?,
            IllegalDescribe=?,
            IllegalAddress=?,
            IllegalTime=?,
            FinePrice=?,
            AroundFee=?,
            Points=?,
            ProcessingState=?,
            Remark=?,
            JudgeId=?,
            StateTime=GETDATE()
        WHERE Id=?`)
        send.AddItem(1, 'IllegalTitle', IllegalTitle)
        send.AddItem(1, 'IllegalDescribe', IllegalDescribe)
        send.AddItem(1, 'IllegalAddress', IllegalAddress)
        send.AddItem(1, 'IllegalTime', IllegalTime)
        send.AddItem(1, 'FinePrice', FinePrice)
        send.AddItem(1, 'AroundFee', AroundFee)
        send.AddItem(1, 'Points', Points)
        send.AddItem(1, 'ProcessingState', ProcessingState)
        send.AddItem(1, 'Remark', Remark)
        send.AddItem(1, 'JudgeId', ':0_0_0')
        send.AddItem(1, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('修改成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
//删除违章数据
export const onDelectVio = (value, callback) => {
    let Id = value,IsValid = "0"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'SQL', `UPDATE {CarIllegal} SET IsValid=?,UpdateTime=GETDATE() WHERE Id=?`)
    send.AddItem(0, 'IsValid', IsValid)
    send.AddItem(0, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('删除成功')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}


// 群发消息
export const onAllMessages = category => {
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'isMass', category.IsMass)
        send.AddItem(0, 'title', category.Title)
        send.AddItem(0, 'content', category.Content)

        let fetchOptions = getFetchOptions('POST', send)

        fetch(api.createMessage, fetchOptions).then(response => {
            if (response.status !== 200) {
                message.error(`status=${response.status}`)
            } else {
                response.json().then(json => {
                    let recv = new Packet()
                    recv.ReadFrom(json)
                    recv.Code === 0
                    ?
                    message.info(recv.Message)
                    :
                    message.success('发送成功')
                }).catch( error => message.error(error) )
            }
        }).catch( error => message.error(error) )
} 


// 指定客户发送
export const onCustMessages = category => {
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'isMass', category.IsMass)
        send.AddItem(0, 'title', category.Title)
        send.AddItem(0, 'content', category.Content)
        send.AddItem(0, 'userIdList', category.userIdList)

        let fetchOptions = getFetchOptions('POST', send)

        fetch(api.createMessage, fetchOptions).then(response => {
            if (response.status !== 200) {
                message.error(`状态码:${response.status}`)
            } else {
                response.json().then(json => {
                    let recv = new Packet()
                    recv.ReadFrom(json)
                    recv.Code === 0
                    ?
                    message.info(recv.Message)
                    :
                    message.success('发送成功')
                }).catch( error => message.error(error) )
            }
        }).catch( error => message.error(error) )
}


// 获取消息列表
export const onMessageData = (keys, loadCallBack) => (dispatch) => {
    let isValid = keys ? keys : "99"
    let send = new Packet()
        send.AddDataset()
    let isMall = '99'
        send.AddItem(0, 'isMall', isMall)
        send.AddItem(0, 'isValid', isValid)
        send.AddItem(0, 'queryFrom', 0)
        send.AddItem(0, 'queryCount', 20) //消息条数
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.queryMessageInfo, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(0, i, 'Id')
                            rec.Id = recv.GetItem(0, i, 'Id')
                            rec.Isvalid = recv.GetItem(0, i, 'Isvalid')
                            rec.CreateTime = recv.GetItem(0, i, 'createTime')
                            rec.Title = recv.GetItem(0, i, 'Title')
                            rec.Content = recv.GetItem(0, i, 'Content')
                            rec.FullName = recv.GetItem(0, i, 'FullName')
                            rec.IsMass = recv.GetItem(0, i, 'IsMass')
                        datas.push(rec)
                    }
                    dispatch(MessageData(datas))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
//删除消息
export const onDelectMessage = (value, callback) => {
    let MainNotifyMessageId = value,IsValid = "0"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'IsValid', IsValid)
    send.AddItem(0, 'MainNotifyMessageId', MainNotifyMessageId)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.setMessageInvalid, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('删除成功')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 查询某个消息对应用户的列表
export const onMessageForUserData = (userDetails, loadCallBack) => (dispatch) => {
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'MainNotifyMessageId', userDetails.Id)
        send.AddItem(0, 'isValid', userDetails.isValid)
        send.AddItem(0, 'queryFrom', 0)
        send.AddItem(0, 'queryCount', 20) //消息条数
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.queryMessageUserInfo, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(0, i, 'Id')
                            rec.Id = recv.GetItem(0, i, 'Id')
                            rec.FullName = recv.GetItem(0, i, 'FullName')
                            rec.Isvalid = recv.GetItem(0, i, 'Isvalid')
                            rec.CreateTime = recv.GetItem(0, i, 'CreateTime')
                            rec.ReadTime = recv.GetItem(0, i, 'ReadTime')
                            rec.IsRead = recv.GetItem(0, i, 'IsRead')
                            rec.MainNotifyMessageId = recv.GetItem(0, i, 'MainNotifyMessageId')
                        datas.push(rec)
                    }
                    dispatch(MessageForUserData(datas))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}


// 客户反馈消息列表
export const onUserMessageData = (loadCallBack) => (dispatch) => {
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT F.*, J.FullName AS ManageName FROM {Feedback} F, {Judge} J WHERE J.Id = F.JudgeId AND F.IsValid = ?`)
        send.AddItem(0, 'IsValid', '1')
        let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                    let datas = []
                    for (let i=0; i<recv.GetRecordCount(0); i++) {
                        let rec = {}
                            rec.key = recv.GetItem(0, i, 'Id')
                            rec.Id = recv.GetItem(0, i, 'Id')
                            rec.IsReply = recv.GetItem(0, i, 'IsReply')
                            rec.Phone = getAESDecrypt(recv.GetItem(0, i, 'Phone'))
                            rec.CreateTime = recv.GetItem(0, i, 'createTime')
                            rec.Content = getAESDecrypt(recv.GetItem(0, i, 'Content'))
                            rec.FullName = getAESDecrypt(recv.GetItem(0, i, 'FullName'))
                            rec.ManageName = getAESDecrypt(recv.GetItem(0, i, 'ManageName'))
                        datas.push(rec)
                    }
                    dispatch(UserMessageData(datas))
                    loadCallBack && loadCallBack()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 修改反馈消息读取状态
export const onsignsUserMessage = (userDetails, callback) => {
    let Guid = localStorage.getItem("guid"),
        Id = userDetails.Id,
        IsReply = parseInt(userDetails.IsReply,10) ? '0' : '1'
        console.log(Id,IsReply)
    let send = new Packet()
        send.AddDataset()
        send.AddItem(0, 'SQL', `SELECT Id FROM {Judge} WHERE Guid = ?`)
        send.AddItem(0, 'Guid', Guid)

        send.AddDataset()
        send.AddItem(1, 'SQL', `UPDATE {Feedback} SET IsReply=?, JudgeId=:0_0_0, UpdateTime=GETDATE(), ReplyTime=GETDATE() WHERE Id=?`)
        send.AddItem(1, 'IsReply', IsReply)
        send.AddItem(1, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('修改成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}
// 删除反馈消息
export const onDelectUserMessage = (value, callback) => {
    let Id = value,IsValid = "0"
    let send = new Packet()
    send.AddDataset()
    send.AddItem(0, 'SQL', `UPDATE {Feedback} SET IsValid=? WHERE Id=?`)
    send.AddItem(0, 'IsValid', IsValid)
    send.AddItem(0, 'Id', Id)
    let fetchOptions = getFetchOptions('POST', send)

    fetch(api.sql, fetchOptions).then(response => {
        if (response.status !== 200) {
            message.error(response.status)
        } else {
            response.json().then(json => {
                let recv = new Packet()
                recv.ReadFrom(json)
                if (recv.Code === 0) {
                    message.error(recv.Message)
                } else {
                   message.success('修改成功！')
                   callback && callback()
                }
            }).catch( error => message.error(error) )
        }
    }).catch( error => message.error(error) )
}