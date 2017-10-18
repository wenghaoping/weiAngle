let rqj = require('../../Template/Template.js');
let wxCharts = require('../../../utils/importServer/wxcharts.js');
let app = getApp();
let url = app.globalData.url;
let url_common = app.globalData.url_common;
import * as ShareModel from '../../../utils/shareModel';
Page({
  data: {
    winWidth: 0,//选项卡
    winHeight: 0,//选项卡
    currentTab: 1,//选项卡
    firstName: "代",
    id: "",
    page: 1,
    user_id: 0,
    industy_sort: [],
    bp_title: "",//bp名称
    ipo_release: "",
    // pro_company_name: "",//公司的名称
    pro_company_start_name: "",
    pro_goodness: "",//项目亮点
    projectName: "",
    companyName: "",
    pro_company_start_time: "",//项目创建时间
    pro_name: "",//项目名称
    pro_source: "",//项目来源
    pro_intro: "",//项目介绍
    stock: 0,
    page_end: false,
    pro_status: {},//运营状态
    loadMorecheck: true,//下拉加载更多判断,
    isChecked0: true,
    isChecked1: true,
    isChecked2: true,
    isChecked3: true,
    isChecked4: true,
    checkEmail: false,
    textBeyond0: false,
    textBeyond1: false,//项目亮点的全部和收起是否显示标志
    textBeyond2: false,//创始人的全部和收起是否显示标志
    textBeyond3: false,//资金用途的全部和收起是否显示标志
    textBeyond4: false,
    show_detail: true,
    show_company: true,
    type: 2,
  },
  onLoad: function (options) {
    this.setData({
      index: options.index,
      id: options.id,
      // currentTab: options.currentTab,
      shareType: options.type
    });

  },
  onShow: function () {
    //  投资人数据
    let that = this;
    let id = this.data.id;
    let index = this.data.index;
    let currentPage = this.data.currentPage;
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let new_company_name = this.data.newCompanyName;
    let investor = this.data.investor;
    let industry_tag = [];
    let scale_tag = [];
    let stage_tag = [];
    let pro_goodness = "";
    // 为上拉加载准备
    app.initPage(that);
    // 判斷項目是不是自己的
    console.log(that.data.id)
    wx.request({
      url: url + '/api/project/projectIsMine',
      data: {
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        let ownerId = res.data.user_id;
        //获取user_id
        app.loginPage(function (user_id) {
          that.setData({
            user_id: user_id,
            avatarUrl: avatarUrl,
          })
          if (ownerId === user_id) {
            wx.showLoading({
              title: 'loading',
              mask: true,
            })
            //项目详情,一键尽调,买家图谱数据载入
            that.projectDetailInfo(id);
            that.matchInvestorInfo(id);
          } else {
            wx.redirectTo({
              url: '/pages/projectDetail/projectDetail?id=' + id + '&&share_id=0',
            })
          }
        });
      }
    })
  },

  //项目详情信息
  projectDetailInfo(id) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/project/getProjectDetail',
      data: {
        user_id: user_id,
        project_id: id
      },
      method: 'POST',
      success: function (res) {
        let brandList = res.data.data.brand;
        let project = res.data.data;
        let user = res.data.user;
        let count = project.count;
        let pro_company_name = project.pro_company_name;
        let pro_goodness = res.data.data.pro_goodness;
        console.log(pro_goodness)
        let industy_sort = [];
        let firstName = user.user_name.substr(0, 1);
        // 如果项目亮点字数超出字,刚显示全部按钮
        if (pro_goodness.length != 0) {
          if (pro_goodness[0].goodness_desc.length > 50) {
            console.log("textBeyond0")
            that.setData({
              textBeyond0: true
            })
          }
          if (pro_goodness.length >= 2) {
            if (pro_goodness[1].goodness_desc.length > 50) {
              that.setData({
                textBeyond1: true
              })
            }
          }
          if (pro_goodness.length >= 3) {
            if (pro_goodness[2].goodness_desc.length > 50) {
              that.setData({
                textBeyond2: true
              })
            }
          }
          if (pro_goodness.length >= 4) {
            if (pro_goodness[3].goodness_desc.length > 50) {
              that.setData({
                textBeyond3: true
              })
            }
          }
        }

        if (project.pro_finance_use) {
          if (project.pro_finance_use.length > 50) {
            that.setData({
              textBeyond4: true
            })
          }
        }
        that.setData({
          project: project,
          user: user,
          firstName: firstName,
          pro_company_name: pro_company_name,
          count: count,
          pro_goodness: pro_goodness,
          brandList: brandList
        });
        // 项目介绍的标签
        let pro_industry = project.pro_industry;
        for (let i = 0; i < pro_industry.length; i++) {
          industy_sort.push(pro_industry[i].industry_name)
        }
        that.setData({
          industy_sort: industy_sort,
          pro_industry: pro_industry
        })
        // 核心团队
        if (project.core_users != 0) {
          let core_memberArray = project.core_users;
          core_memberArray.forEach((x, index) => {
            core_memberArray[index] = x;
          })
          console.log(core_memberArray.length)
          that.setData({
            core_memberArray: core_memberArray
          })
        }
        // 标签 type:0; 项目标签 type:1 团队标签
        let infoTagArray = project.tag;
        let tagOfPro = [];//项目资料的标签
        let teamOfPro = [];//核心团队的标签
        for (let i = 0; i < infoTagArray.length; i++) {
          if (infoTagArray[i].type == 0) {
            tagOfPro.push(infoTagArray[i])
          } else if (infoTagArray[i].type == 1) {
            teamOfPro.push(infoTagArray[i])
          }
        }
        tagOfPro.forEach((x, index) => {
          tagOfPro[index].tag_name = x.tag_name;
        })
        teamOfPro.forEach((x, index) => {
          teamOfPro[index].tag_name = x.tag_name;
        })
        that.setData({
          tagOfPro: tagOfPro,
          teamOfPro: teamOfPro
        })
        // 融资信息
        let pro_history_financeList = project.pro_history_finance;
        pro_history_financeList.forEach((x, index) => {
          pro_history_financeList[index].finance_time = app.changeTime(x.finance_time);
          pro_history_financeList[index].pro_finance_scale = x.pro_finance_scale;
          pro_history_financeList[index].pro_finance_investor = x.pro_finance_investor;
          pro_history_financeList[index].belongs_to_stage.stage_name = x.belongs_to_stage.stage_name;

        })
        that.setData({
          pro_history_financeList: pro_history_financeList
        })
        // 里程碑
        let mileStoneArray = project.pro_develop;
        mileStoneArray.forEach((x, index) => {
          mileStoneArray[index].dh_start_time = app.changeTime(x.dh_start_time);
          mileStoneArray[index].dh_event = x.dh_event;
        })

        that.setData({
          mileStoneArray: mileStoneArray,
          industy_sort: industy_sort,
          pro_goodness: pro_goodness
        });
        //一键尽调
        let company_name = that.data.pro_company_name;
        if (company_name == '') {
          that.setData({
            nothing: 0
          })
        }
        that.oneKeyRearchInfo(company_name);
      },
    })
  },
  //一键尽调信息(辅助函数)
  oneKeyRearchInfo(company_name) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/dataTeam/getCrawlerCompany',
      data: {
        user_id: user_id,
        company_name: company_name
      },
      method: 'POST',
      success: function (res) {
        let nothing = res.data.data
        if (nothing == 0) {
          that.setData({
            nothing: nothing
          })
        } else {
          let projectInfoList = res.data.data.project_product;
          let company = res.data.data.company;
          let com_id = company.com_id;
          let com_time = company.company_register_date;
          let time = app.changeTime(com_time);
          if (projectInfoList.length != 0) {
            projectInfoList.forEach((x, index) => {
              projectInfoList[index] = x;
            })
          }
          that.setData({
            company: company,
            time: time,
            projectInfoList: projectInfoList,
            company_name: company_name
          })
          // 项目信息
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerProject',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let projectDetailsList = res.data.data;
              if (projectDetailsList.length != 0) {
                let projectDetailsOne = projectDetailsList[0];
                let project_labelList = projectDetailsList[0].project_label;
                let project_labelArray = project_labelList.split(","); //字符分割 
                project_labelArray.forEach((x, index) => {
                  project_labelArray[index] = x;
                })
                that.setData({
                  projectDetailsOne: projectDetailsOne,
                  project_labelArray: project_labelArray
                })
              }
              that.setData({
                projectDetailsList: projectDetailsList
              })
            }
          })
          //工商变更
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerBrand',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              // 变更信息
              let brandInfoList = res.data.data.brand;
              let companyChangeList = res.data.data.company_change;
              brandInfoList.forEach((x, index) => {
                brandInfoList[index].company_brand_name = x.company_brand_name;
                brandInfoList[index].company_brand_registration_number = x.company_brand_registration_number;
                brandInfoList[index].company_brand_status = x.company_brand_status;
                brandInfoList[index].company_brand_time = app.changeTime(x.company_brand_time);
                brandInfoList[index].company_brand_type = x.company_brand_type;
              })
              companyChangeList.forEach((x, index) => {
                companyChangeList[index].company_change_after = x.company_change_after;
                companyChangeList[index].company_change_before = x.company_change_before;
                companyChangeList[index].company_change_matter = x.company_change_matter;
                companyChangeList[index].company_change_time = app.changeTime(x.company_change_time);
              })
              that.setData({
                brandInfoList: brandInfoList,
                companyChangeList: companyChangeList
              })
            }
          })
          // 核心成员
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerTeam',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let teamList = res.data.data;
              teamList.forEach((x, index) => {
                teamList[index].team_member_name = x.team_member_name;
              })
              that.setData({
                teamList: teamList
              })
            }
          })
          // 历史融资
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerHistoryFinance',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let historyFinance = res.data.data;
              historyFinance.forEach((x, index) => {
                historyFinance[index].history_financing_money = x.history_financing_money;
                historyFinance[index].history_financing_rounds = x.history_financing_rounds;
                historyFinance[index].history_financing_who = x.history_financing_who;
                historyFinance[index].history_financing_time = app.changeTimeStyle(x.history_financing_time);
              })
              that.setData({
                historyFinance: historyFinance
              })
            }
          })
          // 里程碑
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerMilestone',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let mileStone = res.data.data;
              mileStone.forEach((x, index) => {
                mileStone[index].milestone_event = x.milestone_event;
                mileStone[index].milestone_time = app.changeTimeStyle(x.milestone_time);
              })
              that.setData({
                mileStone: mileStone
              })
            }
          })
          //新闻
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerNews',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let newsList = res.data.data;
              newsList.forEach((x, index) => {
                newsList[index].project_news_label = x.project_news_label;
                newsList[index].source = x.source;
                newsList[index].project_news_time = app.changeTimeStyle(x.project_news_time);
                newsList[index].project_news_title = x.project_news_title;
              })
              that.setData({
                newsList: newsList
              })
            }
          })
          // 相似公司
          wx.request({
            url: url_common + '/api/dataTeam/getCrawlerCompeting',
            data: {
              com_id: com_id
            },
            method: 'POST',
            success: function (res) {
              let competeList = res.data.data;
              let projectLabelList = [];
              let projectArray = [];
              let arr1 = [];
              competeList.forEach((x, index) => {
                competeList[index].project_introduce = x.project_introduce;
                competeList[index].project_industry = x.project_industry;
                competeList[index].project_location = x.project_location;
                competeList[index].project_logo = x.project_logo;
                competeList[index].project_label = x.project_label;
                competeList[index].history_financing = x.history_financing;
              })
              that.setData({
                competeList: competeList,
              })
            }
          })
        }
      }
    })
  },
  //买家图谱信息
  matchInvestorInfo(id) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    wx.request({
      url: url_common + '/api/project/getProjectMatchInvestors',
      data: {
        user_id: user_id,
        project_id: id,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        let investor2 = res.data.data;
        let matchCount = res.data.match_count;
        that.setData({
          investor2: investor2,
          matchCount: matchCount,
          page_end: res.data.page_end
        });
        wx.hideToast({
          title: 'loading...',
          icon: 'loading'
        })
      }
    })
  },
  // 买家图谱上拉加载
  loadMore: function () {
    let that = this;
    let user_id = this.data.user_id;
    let id = this.data.id;
    let currentPage = this.data.currentPage;
    let request = {
      url: url_common + '/api/project/getProjectMatchInvestors',
      data: {
        user_id: user_id,
        project_id: id,
        page: currentPage
      },
    }
    //调用通用加载函数
    app.loadMore(that, request, "investor2")
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  /*滑动切换tab*/
  bindChange: function (e) {
    let that = this;
    let current = e.detail.current;
    that.setData({ currentTab: e.detail.current });
  },
  /*点击tab切换*/
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //进入投资人用户详情
  detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userDetail/networkDetail/networkDetail?id=' + id,
    })
  },
  //维护项目
  maintainProject() {
    let id = this.data.id;
    let user_id = this.data.user_id;
    wx.navigateTo({
      url: '/pages/myProject/editProject/editProject?pro_id=' + id + "&&user_id=" + user_id,
    })
  },
  //分享当前页面
  onShareAppMessage: function () {
    let that = this;
    return ShareModel.myProjectDetailShare(that);
  },
  //跳转到我的页面
  toMy: function () {
    wx.switchTab({
      url: '/pages/my/my/my',
    })
  },
  //更新数据
  updateData: function () {
    let simulationData = this.createSimulationData();
    let series = [{
      name: '成交量1',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },
  //查看全部
  checkMore: function (e) {
    let id = e.target.dataset.id;
    if (id == 1) {
      this.setData({
        companyMileStoneMore: 1
      })
    } else if (id == 2) {
      // 新闻接口
      this.setData({
        companyNews: 2
      })
    } else if (id == 3) {
      // 竞品
      this.setData({
        competitorMore: 3
      })
    } else if (id == 4) {
      this.setData({
        historyMore: 4
      })
    } else if (id == 5) {
      this.setData({
        industrialChangeMore: 5
      })
    }
  },
  // 折叠
  noCheckMore: function (e) {
    let id = e.target.dataset.id;
    if (id == 1) {
      this.setData({
        companyMileStoneMore: 0
      })
    } else if (id == 2) {
      this.setData({
        companyNews: 0
      })
    } else if (id == 3) {
      this.setData({
        competitorMore: 0
      })
    } else if (id == 4) {
      this.setData({
        historyMore: 0
      })
    } else if (id == 5) {
      this.setData({
        industrialChangeMore: 0
      })
    } else if (id == 6) {

    }
  },
  // 浏览
  viewProject: function (e) {
    let project_id = this.data.id;
    wx.navigateTo({
      url: '/pages/message/viewProjectUser/viewProjectUser?project_id=' + project_id,
    })
  },
  // 完善公司信息
  writeCompanyName: function () {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let companyName = that.data.pro_company_name;
    wx.navigateTo({
      url: '/pages/search/search1/search1?company=' + companyName + '&&type=8' + '&&user_id=' + user_id,
    })
    that.setData({
      nothing: 1
    })
  },
  // 查看bp
  sendBp: function () {
    let that = this;
    let user_id = wx.getStorageSync("user_id");
    wx.request({
      url: url_common + '/api/user/checkUserInfo',
      data: {
        user_id: user_id
      },
      method: 'POST',
      success: function (res) {
        let userEmail = res.data.user_email;
        if (userEmail) {
          that.setData({
            userEmail: userEmail,
            sendPc: 1,
            checkEmail: true,
          })
        } else {
          that.setData({
            sendPc: 1,
            checkEmail: false
          })
        }
      }
    })
  },
  //商业计划书
  businessBook: function () {
    let BPath = this.data.BPath;
    let user_id = wx.getStorageSync('user_id');
    let project_id = this.data.id;
    let that = this;
    if (BPath) {
      wx.showActionSheet({
        itemList: ['直接预览', '发送到邮箱'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 1) {
            wx.request({
              url: url_common + '/api/user/checkUserInfo',
              data: {
                user_id: user_id
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                let userEmail = res.data.user_email;
                if (userEmail) {
                  that.setData({
                    userEmail: userEmail,
                    sendPc: 1,
                    checkEmail: true,
                  })
                } else {
                  that.setData({
                    sendPc: 1,
                    checkEmail: false
                  })
                }
              }
            })
          } else if (res.tapIndex == 0) {
            wx.downloadFile({
              url: BPath,
              success: function (res) {
                var filePath = res.tempFilePath
                wx.openDocument({
                  filePath: filePath,
                  success: function (res) {
                    console.log('打开文档成功')
                  }
                })
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '未上传商业计划书',
      })
    }
  },
  // 更改邮箱
  writeBpEmail: function (e) {
    let userEmail = e.detail.value;
    if (userEmail) {
      this.setData({
        checkEmail: true,
        userEmail: userEmail
      })
    } else {
      this.setData({
        checkEmail: false,
        userEmail: userEmail
      })
    }
  },
  // 发送
  bpModalSure: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let sendPc = that.data.sendPc;
    let project_id = that.data.id;
    let userEmail = that.data.userEmail;
    let companyName = that.data.company_name;
    let user_id = wx.getStorageSync('user_id');
    // index 0:发送BP; 
    if (index == 0) {
      if (app.checkEmail(userEmail)) {
        // 保存新邮箱
        wx.request({
          url: url_common + '/api/user/updateUser',
          data: {
            user_id: user_id,
            user_email: userEmail
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              userEmail: userEmail
            })
            if (res.data.status_code == 2000000) {
              wx.request({
                url: url_common + '/api/mail/sendBp',
                data: {
                  user_id: user_id,
                  project_id: project_id
                },
                method: 'POST',
                success: function (res) {
                }
              })
              that.setData({
                sendPc: 0
              })
            } else {
              console.log(res)
            }
          }
        })
        that.setData({
          sendPc: 0,
          userEmail: userEmail
        })
      } else {
        app.errorHide(that, '请正确填写邮箱', 1000)
      }
    }
  },
  // 取消
  bpModalCancel: function (options) {
    let index = options.currentTarget.dataset.index;
    let that = this;
    let sendPc = that.data.sendPc;
    if (index == 0) {
      that.setData({
        sendPc: 0
      })
    } else if (index == 1) {
      that.setData({
        sendCompany: 0
      })
    }
  },
  // 项目详情-里程碑 查看全部
  moreInfo: function (e) {
    let id = e.target.dataset.id;
    let that = this;
    if (id == 3) {
      that.setData({
        moreInfoList: 3
      })
    } else if (id == 4) {
      that.setData({
        moreInfo: 4
      })
    } else if (id == 5) {
      that.setData({
        moreInfo: 5
      })
    }
    else if (id == 6) {
      that.setData({
        moreInfo: 6
      })
    }
  },
  noMoreInfo: function (e) {
    let id = e.target.dataset.id;
    let that = this;
    if (id == 3) {
      that.setData({
        moreInfoList: 0
      })
    } else if (id == 4) {
      that.setData({
        moreInfo: 0
      })
    } else if (id == 5) {
      that.setData({
        moreInfo: 0
      })
    } else if (id == 6) {
      that.setData({
        moreInfo: 0
      })
    }
  },
  // 项目详情中的显示全部
  allBrightPoint: function (e) {
    let check = e.currentTarget.dataset.check;
    if (check == 0) {
      this.setData({
        isChecked0: false
      })
    } else if (check == 1) {
      this.setData({
        isChecked1: false
      })
    }
    else if (check == 2) {
      this.setData({
        isChecked2: false
      })
    }
    else if (check == 3) {
      this.setData({
        isChecked3: false
      })
    } else if (check == 4) {
      this.setData({
        isChecked4: false
      })
    }
  },
  noBrightPoint: function (e) {
    let check = e.currentTarget.dataset.check;
    if (check == 0) {
      this.setData({
        isChecked0: true
      })
    } else if (check == 1) {
      this.setData({
        isChecked1: true
      })
    }
    else if (check == 2) {
      this.setData({
        isChecked2: true
      })
    }
    else if (check == 3) {
      this.setData({
        isChecked3: true
      })
    }
    else if (check == 4) {
      this.setData({
        isChecked4: true
      })
    }
  },
  //项目详情页面,申请查看跳转列表
  applyPerson: function (e) {
    let proid = e.target.dataset.proid;
    wx.navigateTo({
      url: '/pages/message/applyPerson/applyPerson?id=' + proid,
    })
  },
  //私密设置
  initPrivacy: function () {
    let project = this.data.id;
    wx.navigateTo({
      url: '/pages/myProject/initPrivacy/initPrivacy?project=' + project,
    })
  },
  //约谈
  hasMeeting: function () {
    let project_id = this.data.id;
    wx.navigateTo({
      url: '/pages/message/contactProject/projectList/projectList?id=' + project_id,
    })
  },
  //推送项目
  pushProject: function (e) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let pushed_user_id = e.currentTarget.dataset.id;
    let project_id = this.data.id;
    let investor2 = this.data.investor2;
    app.operationModel('projectOneKeyPush', that, pushed_user_id, project_id, function (res) {
      console.log(res)
      let statusCode = res.data.status_code;
      if (statusCode == 2000000) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
      investor2.forEach((x) => {
        if (x.user_id == pushed_user_id) {
          x.push_status = 1
        }
      })
      that.setData({
        investor2: investor2
      })
    })
  },
  //删除项目
  deleteProject: function () {
    let project_id = this.data.id;
    let user_id = wx.getStorageSync('user_id');
    wx.showModal({
      title: '提示',
      content: '确认删除项目?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: url_common + '/api/project/deleteProject',
            data: {
              user_id: user_id,
              project_id: project_id
            },
            method: 'POST',
            success: function (res) {
              if (res.data.status_code = 2000000) {
                wx.navigateTo({
                  url: '/pages/my/projectShop/projectShop/projectShop',
                })
              } else {
                console.log(res.data.errMsg)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //推送项目
  pushProject: function (e) {
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let pushed_user_id = e.currentTarget.dataset.investor;
    let project_id = this.data.id;
    let investor2 = this.data.investor2;
    app.operationModel('projectOneKeyPush', that, pushed_user_id, project_id, function (res) {
      console.log(res)
      let statusCode = res.data.status_code;
      if (statusCode == 2000000) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      }
      investor2.forEach((x) => {
        if (x.investor_id == pushed_user_id) {
          x.push_status = 1
        }
      })
      that.setData({
        investor2: investor2
      })
    })
  },
  //匹配推荐删除
  deletePerson: function (e) {
    let investor_id = e.currentTarget.dataset.investor;
    let project_id = this.data.id;
    let investor2 = this.data.investor2;
    let that = this;
    let user_id = wx.getStorageSync('user_id');
    let matchCount = this.data.matchCount;
    wx.request({
      url: url_common + '/api/project/exceptMatchAction',
      data: {
        user_id: user_id,
        project_id: project_id,
        investor_id: investor_id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.status_code = 2000000) {
          investor2.forEach((x) => {
            if (x.investor_id == investor_id) {
              x.remove = 1
            }
          })
          matchCount = matchCount - 1;
          that.setData({
            investor2: investor2,
            matchCount: matchCount
          })
          console.log(investor2)
        } else {
          console.log(res.data.errMsg)
        }
      }
    })
  },
  //分享引导跳转
  shareJump(e) {
    let index = e.currentTarget.dataset.index;
    app.shareJump(index);
  }
});