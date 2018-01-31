let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
let RP = require('../../../utils/model/redPackets.js');
let rp = new RP.redPackets();
Page({
  data: {
    bg_hongbao2: app.globalData.picUrl.bg_hongbao2,
    open: app.globalData.picUrl.open,
  },
  onLoad: function (options) {
    //红包分享人的id
    let sharePerson = options.user_id;
    let unique_id = options.unique_id;
    console.log(options)
    app.getWxGroupInfo(options, res => {
      rp.otherGroupHB.call(this, options.shareTicket)
    })
    rp.getHBRecord.call(this, sharePerson, unique_id)
    rp.pushHBPerson.call(this, sharePerson, unique_id)
    this.setData({
      shareTicket: options.shareTicket || "",
      user_id: wx.getStorageSync("user_id")
    })
  },
  // 跳转到群详情
  redDetail(e) {
    let groupId = e.currentTarget.dataset.groupid;
    app.href('/redPackets/pages/crowdDetail/crowdDetail?groupId=' + groupId)
  },
  // 查看更多群红包
  seeMore() {
    let shareTicket = this.data.shareTicket;
    app.href('/redPackets/pages/allCrowdHB/allCrowdHB?shareTicket=' + shareTicket)
  },
  // 跳转到首页
  toFirst() {
    app.href("/pages/discoverProject/discoverProject")
  },
  //发红包
  sendHB() {
    app.href("/redPackets/pages/publishHB/publishHB")
  },
  //转发到更多群
  sendMoreGroup() {

  },
  //加他为好友
  addPerson() {

  },
  //看看Ta的投资名片
  sendMoreGroup(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },
  //查看个人名片
  userDetail(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/userDetail/networkDetail/networkDetail?id=' + id)
  },

})