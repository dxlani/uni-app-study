<template>
  <view>
    <view id="mine" v-if="isPermission">
      <view style="position:relative; z-index: 33;min-height:200px;" class="ol">
        <div class="sbt">
          <div class="search-b">
            <span class="search-scan" @click="scan">
              <img src="/static/images/searchScan.png" alt />
            </span>
            <input
              name="expectPrice"
              placeholder="输入车牌号或手机号搜索"
              v-model="searchName"
              class="search-input"
              @change="isSearchName"
            />

            <span class="search-iconsousuo" @click="search">
              <img src="/static/images/order_search.png" alt />
            </span>
          </div>
          <van-icon name="plus" color="#FF9500" @click="goCreate" size="20px" style="height:20px;" />
          <!-- <div class="sbt-icon">
          </div>-->
        </div>
        <!-- 订单列表 -->
        <div class="orders-list">
          <div
            v-for="(item, index) in orders"
            :key="index"
            class="item-b"
            hover-class="weui-cell_active"
          >
            <div class="machine-wrapper">
              <div class="mw" @click="naviagte(item)">
                <div class="m-u">
                  <div class="mu-r">
                    <span>{{item.createTime}}</span>
                  </div>
                </div>
                <div class="mu-d">
                  <div class="mud-l">
                    <!-- <van-tag
                      color="#F0F8FF"
                      text-color="#409AFF"
                      v-if="item.carLicenseColor==1"
                    >{{item.carLicenseNumber}}</van-tag>
                    <van-tag
                      color="#FFFAF0"
                      text-color="#FFB926"
                      v-if="item.carLicenseColor==2"
                    >{{item.carLicenseNumber}}</van-tag>
                    <van-tag
                      color="#F4F4F4"
                      text-color="#333333"
                      v-if="item.carLicenseColor==3"
                    >{{item.carLicenseNumber}}</van-tag>-->
                    <span class="ycard" v-if="item.carLicenseColor==2">{{item.carLicenseNumber}}</span>
                    <span
                      class="ycard bcard"
                      v-if="item.carLicenseColor==1"
                    >{{item.carLicenseNumber}}</span>
                    <span
                      class="ycard ocard"
                      v-if="item.carLicenseColor==3"
                    >{{item.carLicenseNumber}}</span>
                  </div>
                  <div class="mud-m">
                    <p>{{item.originCity}}</p>
                    <span>{{item.originProvince}}</span>
                  </div>
                  <div class="mud-icon">
                    <img src="/static/images/oscrow.png" alt />
                  </div>
                  <div class="mud-m">
                    <p>{{item.destinationCity}}</p>
                    <span>{{item.destinationProvince}}</span>
                  </div>
                </div>
              </div>
              <div class="mu-l" @click="call(item.driverPhone)">
                <img src="/static/images/ophone.png" alt />
                <span>{{item.driverPhone}}</span>
              </div>
            </div>
          </div>
        </div>
      </view>
      <van-popup :show="show" @close="onClose" position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm" />
      </van-popup>

      <van-popup :show="showSelectPhone" @close="onCloseSelectPhone" position="bottom">
        <van-picker
          show-toolbar
          :columns="selectPhoneColumns"
          @cancel="onCancelSelectPhone"
          @confirm="onConfirmSelectPhone"
        />
      </van-popup>
      <van-toast id="van-toast" />
      <van-dialog id="van-dialog" />
    </view>
    <view v-if="isPermission==false">
      <div class="nopermisson">
        <span class="np-img">
          <img src="/static/images/np.png" alt />
        </span>
        <p>您暂未开通订单定位服务功能</p>
      </div>
    </view>
  </view>
</template>
<script>
import store from "../../store";
import * as types from "../../store/mutation-type";
import api_order from "../../http/api/api_order.js";
import api from "../../http/api/api.js";
import Toast from "../../wxcomponents/vant/toast/toast";
import Dialog from "../../wxcomponents/vant/dialog/dialog";
export default {
  data() {
    return {
      columns: ["黄色", "蓝色", "其他色"],
      show: false,
      startAddress: "",
      region: ["请选择省市区"],
      regionEnd: ["请选择省市区"],
      scrollTop: 0,
      top: 0,
      formData: {
        //车牌号
        carLicenseNumber: "",
        //车牌颜色
        carLicenseColor: 2,
        //手机号
        driverPhone: "",
        //姓名
        driverName: "",
        originDetails: "",
        destinationDetails: "",
        originProvince: "",
        originCity: "",
        originCounty: "",
        destinationProvince: "",
        destinationCity: "",
        destinationCounty: ""
      },
      //车牌颜色
      clc: "黄色",
      //订单列表
      orders: [],
      base64ImgUrl: [],
      WorkingCard: [],
      isTop: true,
      showSelectPhone: false,
      selectPhoneColumns: [],
      //是否已存在号码
      isHavePhone: false,
      //搜索框
      searchName: "",
      searchItems: {},
      total: 0,
      isRefresh: false,
      cacheUserInfo: null,
      isPermission: null,
      isFinish: false
    };
  },
  created() {},
  onLoad() {
    this.formData = {
      //车牌号
      carLicenseNumber: "",
      //车牌颜色
      carLicenseColor: 2,
      //手机号
      driverPhone: "",
      //姓名
      driverName: "",
      originDetails: "",
      destinationDetails: "",
      originProvince: "",
      originCity: "",
      originCounty: "",
      destinationProvince: "",
      destinationCity: "",
      destinationCounty: ""
    };
    this.clc = "黄色";
    this.regionEnd = ["请选择省市区"];
    this.region = ["请选择省市区"];
  },
  onShow() {
    this.searchName = "";
    this.searchItems = {
      skip: 0,
      count: 10
    };
    this.total = 0;
    this.isRefresh = false;
    this.orders = [];

    this.isFinish = false;
    let cacheUserInfo = wx.getStorageSync("cacheUserInfo")
      ? wx.getStorageSync("cacheUserInfo")
      : null;
    if (cacheUserInfo) {
      this.getStatus(cacheUserInfo.enterpriseId);
      // api_order.GetEnterpriseById(cacheUserInfo.enterpriseId).then(res => {
      //   if (res.positioning) {
      //     // wx.hideLoading();
      //     this.isPermission = res.positioning;
      //     this.initOrderList();
      //     this.getlocation();
      //   } else {
      //     // wx.hideLoading();
      //     this.isPermission = false;
      //   }
      // });
    } else {
      this.isPermission = false;
    }
    this.cacheUserInfo = wx.getStorageSync("cacheUserInfo")
      ? wx.getStorageSync("cacheUserInfo")
      : null;
  },
  onPageScroll: function(e) {
    // if(e.scrollTop>0){
    //    this.isTop = false;
    // }
    this.scrollTop = e.scrollTop;
    console.log(this.scrollTop);
    wx.setStorageSync("scrollbar", this.scrollTop);
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    this.isTop = true;
    this.searchItems.skip = 0;
    this.isRefresh = true;

    this.initOrderList();
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },
  //上拉加载，拉到底部触发
  onReachBottom() {
    this.isTop = false;
    this.isRefresh = false;
    if (this.orders.length <= this.total) {
      this.searchItems.skip = Math.ceil(this.orders.length / 10) * 10;

      if (this.searchName == "") {
        this.initOrderList();
      }
    }
    console.log("dibu");
  },
  methods: {
    async getStatus(id){
      wx.showLoading({
        title: "加载中...",
        mask: true,
      });
      let res = await api_order.GetEnterpriseById(id);
       if (res.positioning) {
         this.isPermission = res.positioning;
          this.initOrderList();
          this.getlocation();
          wx.hideLoading();
        } else {
          this.isPermission = false;
          wx.hideLoading();
          }
    },
    initOrderList() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      api_order
        .GetLocationOrderInfoList(
          "",
          "",
          this.searchItems.skip,
          this.searchItems.count
        )
        .then(res => {
          this.orders = this.isRefresh
            ? [...res.data]
            : [...this.orders, ...res.data];
          this.total = res.total;
        });
    },
    searchOrderList(itemA, itemB) {
      api_order.GetLocationOrderInfoList(itemA, itemB, 0, -1).then(res => {
        this.orders = res.data;
        this.total = res.total;
      });
    },
    formSubmit: async function(e) {
      let res1 = await api_order.GetLocationOrderInfoInProcess(
        this.formData.carLicenseNumber,
        this.formData.carLicenseColor
      );
      if (res1 != null) {
        if (res1.creatorId == this.cacheUserInfo.id) {
          Dialog.confirm({
            title: "提示",
            message: `${this.formData.carLicenseNumber}有1个进行中的订单`,
            confirmButtonText: "前往查看",
            cancelButtonText: "结束并创建新订单"
          })
            .then(() => {
              // on confirm
              wx.navigateTo({
                url:
                  "/pages/orderDetail/main?id=" +
                  JSON.stringify(res1.id) +
                  "&isFirst=" +
                  false
              });
            })
            .catch(() => {
              // on cancel
              api_order.PutEndLocationOrderInfo(res1.id).then(res => {
                if (res == null) {
                  Toast("进行中的订单已结束");
                }
              });
            });
        } else {
          Dialog.confirm({
            title: "提示",
            message: `${
              this.formData.carLicenseNumber
            }有1个进行中的订单,创建人：${res1.creatorName},手机号：${
              res1.creatorPhone
            }`,
            confirmButtonText: "前往查看",
            showCancelButton: false
          })
            .then(() => {
              // on confirm
              wx.navigateTo({
                url:
                  "/pages/orderDetail/main?id=" +
                  JSON.stringify(res1.id) +
                  "&isFirst=" +
                  false
              });
            })
            .catch(() => {
              // on cancel
              api_order.PutEndLocationOrderInfo(res1.id).then(res => {
                if (res == null) {
                  Toast("进行中的订单已结束");
                }
              });
            });
        }
      } else {
        let forms = e.target.value;
        if (!this.formData.carLicenseNumber) {
          Toast(`车牌号不能为空`);
          return;
        }
        if (
          !/^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/.test(
            this.formData.carLicenseNumber
          )
        ) {
          Toast(`车牌号格式不正确`);
          return;
        }
        if (!this.formData.driverPhone) {
          Toast(`手机号不能为空`);
          return;
        }

        if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.formData.driverPhone)) {
          Toast(`手机号格式不正确`);
          return;
        }
        if (this.region) {
          this.formData.originProvince = this.region[0];
          this.formData.originCity = this.region[1];
          this.formData.originCounty = this.region[2];
        }

        if (
          !this.formData.originProvince ||
          !this.formData.originCity ||
          !this.formData.originCounty
        ) {
          Toast(`起始地省市区不能为空`);
          return;
        }
        if (this.regionEnd) {
          this.formData.destinationProvince = this.regionEnd[0];
          this.formData.destinationCity = this.regionEnd[1];
          this.formData.destinationCounty = this.regionEnd[2];
        }

        if (
          !this.formData.destinationProvince ||
          !this.formData.destinationCity ||
          !this.formData.destinationCounty
        ) {
          Toast(`目的地省市区不能为空`);
          return;
        }

        this.isFinish = true;
        let res = await api_order.PostAddLocationOrderInfo(this.formData);
        console.log("bt", res);

        if (res == null) {
          this.isFinish = false;
        } else {
          this.formData = {
            //车牌号
            carLicenseNumber: "",
            //车牌颜色
            carLicenseColor: 2,
            //手机号
            driverPhone: "",
            //姓名
            driverName: "",
            originDetails: "",
            destinationDetails: "",
            originProvince: "",
            originCity: "",
            originCounty: "",
            destinationProvince: "",
            destinationCity: "",
            destinationCounty: ""
          };
          this.clc = "黄色";
          this.regionEnd = ["请选择省市区"];
          this.isFinish = false;
          Toast("创建成功");
          wx.navigateTo({
            url:
              "/pages/orderDetail/main?id=" +
              JSON.stringify(res.locationOrderId) +
              "&isFirst=" +
              true
          });
        }
      }
    },
    formReset() {},
    onConfirm(e) {
      // const { picker, value, index } = event.detail;
      // console.log(event);
      this.clc = e.mp.detail.value;
      switch (e.mp.detail.value) {
        case "黄色":
          this.formData.carLicenseColor = 2;

          break;

        case "蓝色":
          this.formData.carLicenseColor = 1;

          break;

        case "其他色":
          this.formData.carLicenseColor = 3;

          break;

        default:
          break;
      }
      this.chargePhone(e, "color");
      this.show = false;
    },
    isSearchName(e) {
      console.log("ischang");

      if (e.target.value == "") {
        this.orders = [];
        this.searchItems.skip = 0;
        this.initOrderList();
      }
    },

    onCancel() {
      this.show = false;
    },
    showPop() {
      this.show = true;
    },
    onClose() {
      this.show = false;
    },
    chooseimage() {
      console.log(666);

      var _this = this;
      var FSM = wx.getFileSystemManager();

      var formData = this.formData;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], //选择图片返回的相对路径
            encoding: "base64", //编码格式
            success: res => {
              //成功的回调

              let url = res.data;

              // 调用云函数，返回用户openId，参数为云函数名称
              wx.cloud
                .callFunction({
                  name: "getToken",
                  data: {
                    image: url
                  }
                })
                .then(res => {
                  console.log("test", res);
                  if (res.result.words_result) {
                    wx.showToast({
                      title: "识别成功",
                      icon: "success"
                    });
                    let CarcodeColor = res.result.words_result.color;
                    _this.formData.carLicenseNumber =
                      res.result.words_result.number;
                    if (CarcodeColor == "blue") {
                      _this.formData.carLicenseColor = 1;
                      _this.clc = "蓝色";
                    } else if (CarcodeColor == "yellow") {
                      _this.formData.carLicenseColor = 2;
                      _this.clc = "黄色";
                    } else {
                      _this.formData.carLicenseColor = 3;
                      _this.clc = "其他色";
                    }
                    api_order
                      .GetLogInfoByCarLicense(
                        _this.formData.carLicenseNumber,
                        _this.formData.carLicenseColor
                      )
                      .then(res => {
                        _this.selectPhoneColumns = res.driverPhones;
                        if (res.driverPhones.length > 0) {
                          _this.isHavePhone = true;
                          if (res.driverPhones.length == 1) {
                            _this.formData.driverPhone = res.driverPhones[0];
                            _this.isHavePhone = false;
                          } else {
                            _this.formData.driverPhone = "";
                            _this.isHavePhone = true;
                            // this.showSelectPhone = true;
                          }
                        } else {
                          _this.isHavePhone = false;
                        }
                      });
                    api_order
                      .GetLocationOrderInfoInProcess(
                        _this.formData.carLicenseNumber,
                        _this.formData.carLicenseColor
                      )
                      .then(res => {
                        if (res != null) {
                          if (res.creatorId == _this.cacheUserInfo.id) {
                            Dialog.confirm({
                              title: "提示",
                              message: `${
                                _this.formData.carLicenseNumber
                              }有1个进行中的订单`,
                              confirmButtonText: "前往查看",
                              cancelButtonText: "结束并创建新订单"
                            })
                              .then(() => {
                                // on confirm
                                wx.navigateTo({
                                  url:
                                    "/pages/orderDetail/main?id=" +
                                    JSON.stringify(res.id) +
                                    "&isFirst=" +
                                    false
                                });
                              })
                              .catch(() => {
                                // on cancel
                                api_order
                                  .PutEndLocationOrderInfo(res.id)
                                  .then(res => {
                                    if (res == null) {
                                      Toast("进行中的订单已结束");
                                    }
                                  });
                              });
                          } else {
                            Dialog.confirm({
                              title: "提示",
                              message: `${
                                _this.formData.carLicenseNumber
                              }有1个进行中的订单,创建人：${
                                res.creatorName
                              },手机号：${res.creatorPhone}`,
                              confirmButtonText: "前往查看",
                              showCancelButton: false
                            })
                              .then(() => {
                                // on confirm
                                wx.navigateTo({
                                  url:
                                    "/pages/orderDetail/main?id=" +
                                    JSON.stringify(res.id) +
                                    "&isFirst=" +
                                    false
                                });
                              })
                              .catch(() => {
                                // on cancel
                                api_order
                                  .PutEndLocationOrderInfo(res.id)
                                  .then(res => {
                                    if (res == null) {
                                      Toast("进行中的订单已结束");
                                    }
                                  });
                              });
                          }
                        }
                      });
                  } else {
                    wx.showModal({
                      title: "识别结果",
                      content: "啊哦，无识别结果~",
                      showCancel: false
                    });
                  }
                })
                .catch(err => console.error(err));
            }
          });
        },
        fail: function(res) {
          console.log("quxiao");
          console.log(formData);
        }
      });
    },
    chargePhone(e, name) {
      console.log(e);

      let val = e.target.value;
      switch (name) {
        case "code":
          api_order
            .GetLocationOrderInfoInProcess(val, this.formData.carLicenseColor)
            .then(res => {
              if (res != null) {
                if (res.creatorId == this.cacheUserInfo.id) {
                  Dialog.confirm({
                    title: "提示",
                    message: `${
                      this.formData.carLicenseNumber
                    }有1个进行中的订单`,
                    confirmButtonText: "前往查看",
                    cancelButtonText: "结束并创建新订单"
                  })
                    .then(() => {
                      // on confirm
                      wx.navigateTo({
                        url:
                          "/pages/orderDetail/main?id=" +
                          JSON.stringify(res.id) +
                          "&isFirst=" +
                          false
                      });
                    })
                    .catch(() => {
                      // on cancel
                      api_order.PutEndLocationOrderInfo(res.id).then(res => {
                        if (res == null) {
                          Toast("进行中的订单已结束");
                        }
                      });
                    });
                } else {
                  Dialog.confirm({
                    title: "提示",
                    message: `${
                      this.formData.carLicenseNumber
                    }有1个进行中的订单,创建人：${res.creatorName},手机号：${
                      res.creatorPhone
                    }`,
                    confirmButtonText: "前往查看",
                    showCancelButton: false
                  })
                    .then(() => {
                      // on confirm
                      wx.navigateTo({
                        url:
                          "/pages/orderDetail/main?id=" +
                          JSON.stringify(res.id) +
                          "&isFirst=" +
                          false
                      });
                    })
                    .catch(() => {
                      // on cancel
                      api_order.PutEndLocationOrderInfo(res.id).then(res => {
                        if (res == null) {
                          Toast("进行中的订单已结束");
                        }
                      });
                    });
                }
              }
            });

          api_order
            .GetLogInfoByCarLicense(val, this.formData.carLicenseColor)
            .then(res => {
              this.selectPhoneColumns = res.driverPhones;
              if (res.driverPhones.length > 0) {
                this.isHavePhone = true;
                if (res.driverPhones.length == 1) {
                  this.formData.driverPhone = res.driverPhones[0];
                  this.isHavePhone = false;
                } else {
                  this.isHavePhone = true;
                  // this.showSelectPhone = true;
                }
              } else {
                this.isHavePhone = false;
              }
            });

          break;

        case "color":
          api_order
            .GetLocationOrderInfoInProcess(
              this.formData.carLicenseNumber,
              this.formData.carLicenseColor
            )
            .then(res => {
              if (res != null) {
                if (res.creatorId == this.cacheUserInfo.id) {
                  Dialog.confirm({
                    title: "提示",
                    message: `${
                      this.formData.carLicenseNumber
                    }有1个进行中的订单`,
                    confirmButtonText: "前往查看",
                    cancelButtonText: "结束并创建新订单"
                  })
                    .then(() => {
                      // on confirm
                      wx.navigateTo({
                        url:
                          "/pages/orderDetail/main?id=" +
                          JSON.stringify(res.id) +
                          "&isFirst=" +
                          false
                      });
                    })
                    .catch(() => {
                      // on cancel
                      api_order.PutEndLocationOrderInfo(res.id).then(res => {
                        if (res == null) {
                          Toast("进行中的订单已结束");
                        }
                      });
                    });
                } else {
                  Dialog.confirm({
                    title: "提示",
                    message: `${
                      this.formData.carLicenseNumber
                    }有1个进行中的订单,创建人：${res.creatorName},手机号：${
                      res.creatorPhone
                    }`,
                    confirmButtonText: "前往查看",
                    showCancelButton: false
                  })
                    .then(() => {
                      // on confirm
                      wx.navigateTo({
                        url:
                          "/pages/orderDetail/main?id=" +
                          JSON.stringify(res.id) +
                          "&isFirst=" +
                          false
                      });
                    })
                    .catch(() => {
                      // on cancel
                      api_order.PutEndLocationOrderInfo(res.id).then(res => {
                        if (res == null) {
                          Toast("进行中的订单已结束");
                        }
                      });
                    });
                }
              }
            });

          api_order
            .GetLogInfoByCarLicense(
              this.formData.carLicenseNumber,
              this.formData.carLicenseColor
            )
            .then(res => {
              this.selectPhoneColumns = res.driverPhones;
              if (res.driverPhones.length > 0) {
                this.isHavePhone = true;
                if (res.driverPhones.length == 1) {
                  this.formData.driverPhone = res.driverPhones[0];
                  this.isHavePhone = false;
                } else {
                  this.isHavePhone = true;
                  // this.showSelectPhone = true;
                }
              } else {
                this.isHavePhone = false;
              }
            });

          break;

        default:
          break;
      }
      console.log("val", e);
    },
    getlocation() {
      let self = this;
      wx.getLocation({
        type: "wgs84",
        success(res) {
          const latitude = res.latitude;
          const longitude = res.longitude;
          const speed = res.speed;
          const accuracy = res.accuracy;
          api.GetAddress(res.latitude, res.longitude).then(res => {
            self.location = res.address;
            let address = res.address;
            let addressDetail = res.address;
            if (address.indexOf("省") > -1) {
              addressDetail = address.slice(address.indexOf("省") + 1);
              address = address;
            } else if (address.indexOf("区") !== address.lastIndexOf("区")) {
              addressDetail = address.slice(address.indexOf("区") + 1);
              address = address.slice(address.indexOf("区") + 1);
            }

            if (address.indexOf("区") > -1) {
              addressDetail = address.slice(address.indexOf("区") + 1);
              address = address.slice(0, address.indexOf("区") + 1);
            } else if (address.indexOf("县") > -1) {
              addressDetail = address.slice(address.indexOf("县") + 1);
              address = address.slice(0, address.indexOf("县") + 1);
            } else if (address.indexOf("市") > -1) {
              addressDetail = address.slice(address.indexOf("市") + 1);
              address = address.slice(0, address.indexOf("市") + 1);
            }

            self.formData.originDetails = addressDetail;
            self.startAddress = address;
            self.region = [res.province, res.city, res.area];
            console.log(self.startAddress, address);

            wx.setStorageSync("location", address);

            wx.setStorageSync("locationDetail", addressDetail);
          });
        },
        fail(res) {
          // console.log('失败');
          return;
          if (res.errMsg) {
          }
        },
        complete(res) {
          console.log(res);
        }
      });
    },
    RegionChange(e) {
      console.log(e);

      this.region = e.target.value;
    },
    RegionEndChange(e) {
      console.log(e);

      this.regionEnd = e.target.value;
    },
    scanSuccess(e) {
      var that = this;
      that.result = e.result;
      wx.showLoading({
        title: "加载中..."
      });
      console.log("result", e.result);
      api_order
        .GetLocationOrderInfoByIdentificationCode(e.result)
        .then(res => {
          if (res == null) {
            wx.hideLoading();
            Dialog.alert({
              message: "无法识别"
            }).then(() => {});
          } else {
            wx.hideLoading();
            wx.navigateTo({
              url:
                "/pages/orderDetail/main?id=" +
                JSON.stringify(res.id) +
                "&isFirst=" +
                false
            });
          }
        })
        .catch(res => {
          wx.hideLoading();
          // console.log(res)
          Dialog.alert({
            message: "无法识别"
          }).then(() => {});
        });
    },
    scan() {
      var that = this;

      wx.scanCode({
        success: res => {
          // wx.hideLoading();
          that.scanSuccess(res);
        },
        fail: res => {
          Dialog.alert({
            message: "无法识别"
          }).then(() => {});
        }
      });
    },
    call(phone) {
      Dialog.confirm({
        title: "提示",
        message: `拨打电话${phone}`,
        confirmButtonText: "是",
        cancelButtonText: "否"
      })
        .then(() => {
          wx.makePhoneCall({
            phoneNumber: phone
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    naviagte(item) {
      console.log("item", item);

      wx.navigateTo({
        url:
          "/pages/orderDetail/main?id=" +
          JSON.stringify(item.id) +
          "&isFirst=" +
          false
      });
    },
    //图片转B64
    transformBase(res) {
      let that = this;
      var FSM = wx.getFileSystemManager();
      //循环将得到的图片转换为Base64
      for (let r in res.tempFilePaths) {
        // console.log(res.tempFilePaths[r])
        FSM.readFile({
          filePath: res.tempFilePaths[r],
          encoding: "base64",
          success: function(data) {
            let Working = data.data;
            that.getBase64ImageUrl(Working);
          }
        });
      }
    },
    getBase64ImageUrl: function(res) {
      /// 获取到base64Data
      var base64Data = res;
      /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
      /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      let base64ImgUrl = this.base64ImgUrl;
      let WorkingCard = this.WorkingCard; //需要赋值的图片base64字段
      let base64Url = "data:image/png;base64," + base64Data;
      base64ImgUrl.push(base64Url); //用来显示在页面上的base64路径（数组）
      WorkingCard = base64Url;
      // 获取文件(图片)MD5
      let dealToMD5 = sMD5.hexMD5(base64Url); //（var sMD5 = require('../../utils/common/spark-md5.js')）
      /// 刷新数据
      console.log(base64ImgUrl, "===========");
      // this.setData({
      //   isGetPicture: true,
      //   base64ImgUrl: base64ImgUrl,
      //   WorkingCard: WorkingCard,
      //   WorkingCardMD5: dealToMD5
      // });
    },
    //电话号码下拉
    seletPhone() {
      if (this.formData.driverPhone == "" && this.isHavePhone) {
        this.showSelectPhone = true;
      } else {
        this.isHavePhone = false;
      }
    },
    onCloseSelectPhone() {
      this.showSelectPhone = false;
      this.isHavePhone = false;
    },
    onCancelSelectPhone() {
      this.isHavePhone = false;
      this.showSelectPhone = false;
    },
    onConfirmSelectPhone(event) {
      this.formData.driverPhone = event.mp.detail.value;
      this.showSelectPhone = false;
      this.isHavePhone = false;
    },
    search() {
      if (this.searchName == "") {
        this.searchOrderList("", "");
      } else {
        if (
          /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(
            this.searchName
          )
        ) {
          this.searchOrderList(this.searchName, "");
          return;
        }

        if (/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.searchName)) {
          this.searchOrderList("", this.searchName);
          return;
        } else {
          Toast("请输入正确的车牌号或手机号");
        }
      }
    },
    goCreate() {
      wx.navigateTo({
        url: "/pages/createOrder/main"
      });
    }
  }
};
</script>
<style scoped lang="scss">
#mine {
  position: relative;
}
.order-main {
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(34, 32, 31, 0.1);
  border-radius: 8px;
  border-radius: 8px;
  margin: 10px;
  padding-bottom: 10px;
  // position: absolute;
  position: relative;
  z-index: 44;
  .btn-area {
    button {
      background: #ff9500;
      border-radius: 6px;
      border-radius: 6px;
      color: #ffffff;
      margin: 20px 30px 0 30px;
    }
  }
  .section {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: flex-start;
    .picker {
      width: 55%;
      border: 1px solid #e1e1e1;
      border-radius: 2px;
      border-radius: 2px;
      // padding: 10rpx;
      box-sizing: border-box;
      height: 2em;
      line-height: 2em;
    }
    .icon-input {
      position: relative;
      width: 55%;
      input {
        width: 100%;
      }
      .icon {
        position: absolute;
        right: 10rpx;
        top: 12rpx;
        z-index: 20;
        width: 20px;
        height: 17px;
      }
    }
    input {
      width: 55%;
      border: 1px solid #e1e1e1;
      border-radius: 2px;
      border-radius: 2px;
      padding: 10rpx;
      box-sizing: border-box;
      height: 2em;
      line-height: 2em;
    }
    .addressGroup {
      display: flex;
      justify-content: space-between;
      width: 55%;
      input {
        width: 30%;
        text-align: center;
      }
    }
    .section__title {
      height: 100%;
      // width: 100px;
      width: 100px;
      padding-right: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #000000;
      letter-spacing: 0;
      line-height: 15px;
    }
    .text {
      width: 56%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .service-item {
        background: #bdbdbd;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        line-height: 15px;
        padding: 8px;
        border-radius: 4px;
      }
      .select-items {
        background: #f15b48;
      }
      .more {
        width: 100%;
      }
      .section-text {
        word-break: break-all; /*允许在单词内换行*/
        text-align: left;
        color: #323232;
        line-height: 45rpx;
        text-overflow: -o-ellipsis-lastline; /*css3中webkit内核提供的一个方法类似ellipsis*/
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box; /*自适应盒子*/
        -webkit-line-clamp: 1; /*此处为1行,如果是两行就改成2*/
        -webkit-box-orient: vertical;
      }
      .iconBackChevronCopy {
        color: #eee;
      }
    }
  }
}
.search-txt {
  font-family: PingFangSC-Regular;
  color: #bbbbbb;
  letter-spacing: 0.26px;
  text-align: center;
}
.sbt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
.sbt-icon {
  width: 10%;
  text-align: center;
}
.search-b {
  background: #ffffff;
  box-shadow: 0 2px 10px 0 rgba(34, 32, 31, 0.1);
  border-radius: 45px;
  border-radius: 45px;
  // margin: 15px 0 15px 15px;
  height: 40px;
  width: 80%;
  padding: 0 20px;
  position: relative;
  display: flex;
  align-items: center;
}
.search-scan {
  vertical-align: middle;
  display: inline-block;
  width: 20px;
  height: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
.search-text {
  color: rgba(0, 0, 0, 0.3);
}
.search-input {
  display: inline-block;
  margin-left: 10rpx;
}
.search-iconsousuo {
  vertical-align: middle;
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 10px;
  img {
    width: 20px;
    height: 20px;
  }
}

.topnavFixed {
  width: 100%;
  z-index: 33;
  position: fixed;
  top: 25px;
}
.topnavFixed2 {
  width: 100%;
  z-index: 34;
  text-align: center;
  position: fixed;
  top: 0;
}

.orders-list {
  margin: 0 15px 15px 15px;
  padding-bottom: 15px;
  .item-b {
    padding: 10px;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(34, 32, 31, 0.1);
    border-radius: 8px;
    border-radius: 8px;
    margin-top: 6px;
    .machine-wrapper {
      position: relative;
      .mw {
        .m-u {
          display: flex;
          justify-content: flex-end;
          color: #797979;
          border-bottom: 1px solid #e3e3e3;
          padding-bottom: 10rpx;
          font-size: 12px;
        }
        .mu-d {
          display: flex;
          justify-content: space-between;
          vertical-align: middle;
          align-items: center;
          padding: 10px 15px;
          .mud-icon {
            img {
              width: 27px;
              height: 9px;
            }
          }
          .mud-m {
            text-align: center;
            width: 28%;
            p {
              color: #000000;
            }
            span {
              color: #b2b2b2;
              font-size: 12px;
            }
          }
        }
      }
      .mu-l {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
        color: #797979;
        font-size: 12px;
        img {
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10rpx;
        }
      }
    }
  }
}
.st-img {
  display: inline-block;
  img {
    width: 15px;
    height: 15px;
  }
}
.st {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pt40 {
  margin-top: 95px;
}
.nopermisson {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 12px;
  color: #666;
  .np-img {
    img {
      width: 150px;
      height: 150px;
    }
  }
}
.picker {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mud-l {
  .van-tag {
    border: 2px solid !important;
  }
}
.ycard {
  background: #fffaf0;
  border: 2px solid #ffb426;
  border-radius: 4px;
  border-radius: 4px;
  color: #ffb926;
  font-size: 14px;
  padding: 5rpx 7rpx;
}
.bcard {
  background: #f0f8ff;
  border: 2px solid #71c6ff;
  color: #1493ff;
}
.ocard {
  background: #f4f4f4;
  border: 2px solid #242424;
  color: #333333;
}
</style>





