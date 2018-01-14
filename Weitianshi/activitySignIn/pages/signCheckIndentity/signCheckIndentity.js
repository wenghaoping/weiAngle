let app = getApp();
let url_common = app.globalData.url_common;
import * as verify from '../../../utils/global/verify.js';
Page({
  data: {
    demo: [
      {
        name: '名称',
        value: '第一届中国微天使节和第二十届中国BD岁末嘉年华（杭州场）开始报名！'
      },
      {
        name: '主办方',
        value: '浙江省杭州市西湖区文一西路588号中节能西溪首座B3-51信用卡-1楼'
      }
    ],
    activity_id:26,
    activityDetail: '',
    mobile: '',
  },
  onLoad(options) {
    this.getActivityDetail();
  },
  // 获取活动信息
  getActivityDetail() {
    app.httpPost({
      url: url_common + '/api/activity/attendActivity',
      data: {
        activity_id: this.data.activity_id
      }
    }, this).then(res => {
      console.log(res.data.data);
      this._dealActivityDetail(res.data.data); 
    })
  },
  // 处理活动信息
  _dealActivityDetail(data) {
    let activityDetail = [];
    activityDetail.push({
      name: '名称',
      value: data.activity_title
    });
    let start_time,end_time = '';
    if (data.start_time) start_time = data.start_time.substring(0, 16);
    if (data.end_time) end_time = data.end_time.substring(0, 16);
    activityDetail.push({
      name: '时间',
      value: start_time + ' ~ ' + end_time
    });
    activityDetail.push({
      name: '地点',
      value: data.activity_address
    });
    activityDetail.push({
      name: '主办方',
      value: data.activity_user
    });
    this.setData({
      activityDetail: activityDetail
    })
  },
  // 手机号码blur
  mobile(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  // 验证报名信息
  checkIndentity() {
    verify.mobile(this,this.data.mobile, x=>{
      app.loginPage(user_id => {
        app.httpPost({
          url: url_common + '/api/activity/confirmAttendInfo',
          data: {
            activity_id: this.data.activity_id,
            user_mobile: this.data.mobile,
            open_session: app.globalData.open_session
          }
        }, this).then(res => {
          app.href('/activitySignIn/pages/signIndentityCard/signIndentityCard?apply_id=' + res.data.apply_id + '&&activity_id=' + this.data.activity_id);
        }).catch(res => {
          app.errorHide(this, res.data.error_msg);
        })
      })
    });
  },
})