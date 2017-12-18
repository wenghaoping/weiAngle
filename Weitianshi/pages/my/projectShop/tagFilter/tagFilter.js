let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as SearchModel from '../../../../utils/searchModel';
import * as ShareModel from '../../../../utils/shareModel';
Page({
  data:{
    filterList:[
      { 
        sortId:0,
        name: 'industry',
        mainTitle: '领域',
        subTitle: '* 最多选择5个',
        autoLength:false,
        tagName:'industry_name',
        tagId:'industry_id',
        arry: []
      },
      { 
        sortId:1,
        name:'stage',
        mainTitlte:'轮次',
        subTitle:'* 最多选择5个',
        autoLength:false,
        tagName:'stage_name',
        tagId:'stage_id',
        arry:[]
      },
      {
        sortId: 2,
        name:'scale',
        mainTitle:'轮次',
        subTitle:'* 最多选择5个',
        autoLength:true,
        tagName:'scale_money',
        tagId:'scale_id',
        arry:[]
      },
      {
        sortId: 3,
        name:'hotCity',
        mainTitle:'地区',
        subTitle: '* 最多选择5个',
        autoLength: false,
        tagName: 'area_title',
        tagId: 'area_id',
        arry:[]
      }
    ],
    SearchInit: SearchModel.data
  },
  onLoad(){
    this._initData()
  },
  // 初始化数据
  _initData(){
    let filterList = this.data.filterList;
    filterList[0].arry = wx.getStorageSync('industry');
    filterList[1].arry = wx.getStorageSync('stage');
    filterList[2].arry = wx.getStorageSync('scale');
    filterList[3].arry = wx.getStorageSync('hotCity');
    this.setData({
      filterList: filterList
    })
    console.log(this.data.filterList)
  },
  // 标签选择
  tagsCheck(e){
    SearchModel.page_tagsCheck(e,this);
  },
})