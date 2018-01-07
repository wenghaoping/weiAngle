let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      index: options.index,
      id: options.project_id,
      currentTab: options.currentTab,
      shareType: options.type
    });
    console.log('pro_id', this.data.id);
  },
  onShow: function () {
    //  投资人数据
    let that = this;
    let id = this.data.id;
    that.projectDetailInfo();
  },

  // 
  //项目详情信息
  projectDetailInfo() {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: this.data.id
      },
      method: 'POST',
      success: function (res) {
        console.log('projectDetail', res)
        let project = res.data.data;
        let brandList = res.data.data.brand;
        that.setData({
          project: project,
          brandList: brandList,
        });

      },
    })
  },



  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },



});