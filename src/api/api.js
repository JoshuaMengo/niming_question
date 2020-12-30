// 权限管理API  【菜单、角色、权限】
import request from '@/api/request'

/**
 * 添加菜单
 * @param {*} data
 * @author 小道仙
 * @date 2020年2月19日
 */

// ## 非静默授权
export function login(code) {
    return request({
        url: '/user/login?code=' + code,
        method: 'get',
    })
}

// ## 更新session 静默授权
export function baselogin(code) {
    return request({
        url: '/user/base_login?code=' + code,
        method: 'get',
    })
}

// export function getOther(data) {
//     return request({
//         url: '/user/get_other?session=' + data.session,
//         method: 'post',
//         data:{
//             uid:data.uid
//         }
//     })
// }


// ## 查询收到的提问
// social/query_receive_question
export function getReceiveQuestion(data) {
    return request({
        url: '/social/query_receive_question?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 查询我的回答
export function querySendAnswer(data) {
    return request({
        url: '/social/query_send_answer?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 查询我的提问
export function querySendQuestion(data) {
    return request({
        url: '/social/query_send_question?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 查询收到的回答
export function queryReceiveAnswer(data) {
    return request({
        url: '/social/query_receive_answer?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 查询回收站
export function queryDelete(data) {
    return request({
        url: '/social/query_delete?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}


// ## 查询黑名单
export function queryBlacklist(data) {
    return request({
        url: '/social/query_blacklist?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 提问
export function postAsk(data) {
    return request({
        url: '/social/ask?session=' + data.session,
        method: 'post',
        data: {
            to_uid: data.to_uid,
            content: data.content,
            is_open:data.is_open
        }
    })
}

// ## 获取问题详情
export function getDetail(data) {
    return request({
        url: '/social/get?session=' + data.session,
        method: 'post',
        data: {
            qid: data.qid,
        }
    })
}

// ## 删除问题
export function deleteQuestion(data) {
    return request({
        url: '/social/delete?session=' + data.session,
        method: 'post',
        data: {
            qid: data.qid,
            is_to_hidden:data.is_to_hidden
        }
    })
}

// ## 屏蔽用户
export function blockUser(data) {
    return request({
        url: '/social/block_user?session=' + data.session,
        method: 'post',
        data: {
            qid: data.qid,
            block_uid: data.block_uid
        }
    })
}

// ## 还原问题
export function recoverQuestion(data) {
    return request({
        url: '/social/recover?session=' + data.session,
        method: 'post',
        data: {
            qid: data.qid,
            is_to_hidden:data.is_to_hidden
        }
    })
}

// ## 解封用户
export function deblockUser(data) {
    return request({
        url: '/social/deblock_user?session=' + data.session,
        method: 'post',
        data: {
            block_uid: data.block_uid,
        }
    })
}


// ## 获取jssdk配置
export function getConfig(data) {
    return request({
        url: '/user/get_config?session=' + data.session,
        method: 'post',
        data: {
            wechaturl: data.wechaturl
        }
    })
}

// ## 获取用户信息
export function getUser(session) {
    return request({
        url: '/user/get?session=' + session,
        method: 'POST',

    })
}

// ## 查询访问记录列表
export function queryVisitor(data) {
    return request({
        url: '/social/query_visitor?session=' + data.session,
        method: 'post',
        data: {
            page_index: data.page_index
        }
    })
}

// ## 上传图片
export function uploadImg(data) {
    return request({
        url: '/social/upload_img?session=' + data.session,
        method: 'post',
        data: data.formdata
    })
}



// ## 提交支付反馈
export function createFeedback(data) {
    return request({
        url: '/wxpay/create_feedback?session=' + data.session,
        method: 'post',
        data: {
            img: data.img
        }
    })
}

// ## 获取反馈
export function queryFeedback(session) {
    return request({
        url: '/wxpay/query_feedback?session=' + session,
        method: 'post',
    })
}

// ## 获取反馈详情
export function getFeedback(data) {
    return request({
        url: '/wxpay/get_feedback?session=' + data.session,
        method: 'post',
        data: {
            uid: data.uid
        }
    })
}

// ## 处理反馈结果
export function handleFeedback(data) {
    return request({
        url: '/wxpay/handle_feedback?session=' + data.session,
        method: 'post',
        data: {
            uid: data.uid,
            fid: data.fid,
            flag: data.flag
        }
    })
}

// ## 判断是否被拉黑
export function judgeBlock(data) {
    return request({
        url: '/social/judge_block?session=' + data.session,
        method: 'post',
        data: {
            uid: data.uid,
        }
    })
}

// ## 回答问题
export function postAnswer(data) {
    return request({
        url: '/social/answer?session=' + data.session,
        method: 'post',
        data: {
            qid: data.qid,
            content: data.content,
            from_uid:data.from_uid
        }
    })
}

// ## 获取提问箱内容
export function getBox(data) {
    return request({
        url: '/social/get_box?session=' + data.session,
        method: 'post',
        data: {
            uid: data.uid,
            page_index: data.page_index
        }
    })
}

// ## 生成支付订单
export function createPay(data) {
    return request({
        url: '/wxpay/create_pay?session=' + data.session,
        method: 'post',
        data: {
            body: data.body,
            total_fee: data.total_fee
        }
    })
}

// ## 设置用户信息
export function updateDetail(session,data) {
    return request({
        url: '/user/update_detail?session=' + session,
        method: 'post',
        data: {
            update_data: data
        }
    })
}



// ## 更新用户查询访客记录的权限(在付费后使用)
export function updateUnlockStatus(data) {
    return request({
        url: '/user/update_unlock_status?session=' + data.session,
        method: 'post',
        data: {
            trade_no: data.trade_no,
            flag: data.flag
        }
    })
}
// ## 更新用户访客记录的权限（进入访客记录的页面时使用）
export function reduceUnlockNumber(session) {
    return request({
        url: '/user/reduce_unlock_number?session=' + session,
        method: 'post',
    })
}

// ## 判断是否为管理员
export function judgeAdmin(session) {
    return request({
        url: '/user/judge_admin?session=' + session,
        method: 'post',
    })
}



// ## 访客登记
export function registerVisitor(data) {
    return request({
        url: '/social/register_visitor?session=' + data.session,
        method: 'post',
        data:{
            visitor_uid:data.visitor_uid
        }
    })
}


// ## 阅读
export function read(data) {
    return request({
        url: '/social/read?session=' + data.session,
        method: 'post',
        data:{
            is_read_question:data.is_read_question,
            qid:data.qid
        }
    })
}


// ## 提问页面获取nickName
export function getUserDetail(data) {
    return request({
        url: '/user/get_detail?session=' + data.session,
        method: 'post',
        data:{
            uid:data.uid
        }
    })
}


// // 收到的信息列表
// export function queryReceive(data) {
//     return request({
//         url: '/social/query_receive?session=' + data.session,
//         method: 'post',
//         data: {
//             page_index: data.page_index
//         }
//     })
// }

// // 发送的信息列表
// export function querySend(data) {
//     return request({
//         url: '/social/query_send?session=' + data.session,
//         method: 'post',
//         data: {
//             page_index: data.page_index
//         }
//     })
// }



// export function readLetter(data) {
//     return request({
//         url: '/social/read_letter?session=' + data.session,
//         method: 'post',
//         data: {
//             lid: data.lid
//         }
//     })
// }

// // 获取信的详情
// export function getLetter(data) {
//     return request({
//         url: '/social/get?session=' + data.session,
//         method: 'post',
//         data: {
//             lid: data.lid,
//             is_receive: data.is_receive
//         }
//     })
// }

// // 回复信息
// export function replyletter(data) {
//     return request({
//         url: '/social/reply?session=' + data.session,
//         method: 'post',
//         data: {
//             lid: data.lid,
//             content: data.content
//         }
//     })
// }


// // 删除列表/回收站
// export function queryDelete(data) {
//     return request({
//         url: '/social/query_delete?session=' + data.session,
//         method: 'post',
//         data: {
//             page_index: data.page_index
//         }
//     })
// }

// //屏蔽列表
// export function queryBlacklist(data) {
//     return request({
//         url: '/social/query_blacklist?session=' + data.session,
//         method: 'post',
//         data: {
//             page_index: data.page_index
//         }
//     })
// }

// //屏蔽用户
// export function blockUser(data) {
//     return request({
//         url: '/social/block_user?session=' + data.session,
//         method: 'post',
//         data: {
//             lid: data.lid,
//             block_uid: data.block_uid
//         }
//     })
// }

// //解除屏蔽用户
// export function blockUid(data) {
//     return request({
//         url: '/social/deblock_user?session=' + data.session,
//         method: 'post',
//         data: {
//             block_uid: data.id
//         }
//     })
// }





// //删除来信
// export function deleteLetter(data){
//     return request({
//         url:'/social/delete?session=' + data.session,
//         method:'post',
//         data:{
//             lid: data.lid
//         }
//     })
// }

// //发匿名信
// export function sendLetter(data){
//     return request({
//         url:'/social/send?session=' + data.session,
//         method:'post',
//         data:{
//             uid: data.uid,
//             content:data.content
//         }
//     })
// }









// // 恢复删除的信息
// export function recoverLetter(data){
//     return request({
//         url:'/social/recover_letter?session=' + data.session,
//         method:'post',
//         data:{
//             lid:data.lid,
//         }
//     })
// }
