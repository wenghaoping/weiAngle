var app = getApp();
var url = app.globalData.url;
var url_common = app.globalData.url_common;
import * as FilterModel from '../../../utils/filterModel';
import * as ShareModel from '../../../utils/shareModel';
Page({

  data: {
    banner_organization: app.globalData.picUrl.banner_organization,
    nonet: true
  },

  onLoad: function (options) {

  },
  onShow: function () {
    this.investment()
  },
  onPullDownRefresh() {
    //投资机构
    this.investment();
  },
  //投资机构列表信息
  investment() {
    let that = this;
    wx.showLoading({
      title: 'loading',
      mask: true,
    })
    app.httpPost({
      url: url_common + '/api/investment',
      data: {}
    }).then(res => {
      wx.hideLoading()
      let investormentList = res.data.data;
      console.log(investormentList)
      let investment_list = investormentList.investment_list.list;
      that.setData({
        investormentList: investormentList,
        investment_list: investment_list
      })
      wx.hideLoading();
    })
  },
  // 搜索跳转
  allSearch: function () {
    app.href('/pages/organization/org_search/org_search')
  },
  //跳转热门领域全部
  toGoIndustry: function () {
    app.href('/pages/organization/subPage/list_industry/list_industry')
  },
  //投资机构全部
  toGoInvestment: function () {
    app.href('/pages/organization/org_library/org_library')
  },
  //投资机构跳转
  institutionalDetails(e) {
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_detail/org_detail?investment_id=' + id)
  },
  //投资风格跳转
  toStyle(e) {
    console.log(e)
    let id = e.currentTarget.dataset.style;
    app.href('/pages/organization/org_library/org_library?label=label_style&&itemId=' + id)
  },
  //热门领域跳转搜索
  toIndustrySearch(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    app.href('/pages/organization/org_library/org_library?label=label_industry&&itemId=' + id)
  },
  // 重新加载
  refresh() {
    let timer = '';
    wx.showLoading({
      title: 'loading',
      mask: true
    });
    timer = setTimeout(x => {
      wx.hideLoading();
      this.onShow();
    }, 1500)
  }
})