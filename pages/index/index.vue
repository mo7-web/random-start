<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ nowTime }}</text>
    </view>
    <view class="text-area">
      <text class="title">上班日: {{ isWorkDay }}</text>
    </view>
    <view class="text-area" v-if="isWorkDay">
      <text class="title">上班时间: {{ isWorkTime }}</text>
    </view>

    <view class="text-area">
      <text class="title">上班打卡时间段: {{ isUpWordDingTime }}</text>
    </view>
    <view class="text-area">
      <text class="title">下班打卡时间段: {{ isDownWorkDingTime }}</text>
    </view>

    <button @click="OpenQiYeWeiXin">手动打开企业微信</button>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { isWorkday } from "chinese-workday";
import { CreateInterval_Global, GetRandom } from "@/common/tools";

const upStartWorkDingTime_str = "08:51:00";
const upWorkTime_str = "09:00:00";
const upEndWorkDingTime_str = "09:07:00";

const downWorkTime_str = "18:00:00";
const downWorkDingEndTime_str = "18:20:00";

export default {
  data() {
    return {
      nowTime: "",
      isWorkDay: false,
      isWorkTime: false,
      isWorkDown: false,
      isUpWordDingTime: false,
      isDownWorkDingTime: false,
    };
  },
  onLoad() {
    const _this = this;
    _this.GetNowTime();
    CreateInterval_Global(
      "IndexTimer",
      () => {
        _this.GetNowTime();
      },
      1000
    );
  },
  methods: {
    GetNowTime() {
      const _this = this;
      _this.nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      _this.isWorkDay = false;
      _this.isWorkTime = false;
      _this.isWorkDown = false;
      _this.isUpWordDingTime = false;
      _this.isDownWorkDingTime = false;
      _this.WorkdayFun();
    },

    WorkdayFun() {
      const _this = this;
      const NowIsWorkday = isWorkday(_this.nowTime);
      this.isWorkDay = NowIsWorkday;
      if (this.isWorkDay) {
        const DayObj = dayjs();
        const day_str = DayObj.format("YYYY-MM-DD");
        const upWorkDingStartTime = dayjs(
          `${day_str} ${upStartWorkDingTime_str}`
        );
        const upWorkDingEndTime = dayjs(`${day_str} ${upEndWorkDingTime_str}`);

        const isUpWorkDingStart = DayObj.isAfter(upWorkDingStartTime); // 之后
        const isUpWorkDingEnd = DayObj.isBefore(upWorkDingEndTime); // 之前
        if (isUpWorkDingStart && isUpWorkDingEnd) {
          _this.isUpWordDingTime = true;
          _this.WordDingFun(upWorkDingEndTime.subtract(upWorkDingStartTime));
        }
        _this.WordDingFun(upWorkDingEndTime.subtract(upWorkDingStartTime));

        const downWorkTime = dayjs(`${day_str} ${downWorkTime_str}`);
        const downWorkDingEndTime = dayjs(
          `${day_str} ${downWorkDingEndTime_str}`
        );
        const isDownWorkTime = DayObj.isAfter(downWorkTime); // 之后
        const isDownWorkDingEndTime = DayObj.isBefore(downWorkDingEndTime); // 之前

        if (isDownWorkTime && isDownWorkDingEndTime) {
          _this.isDownWorkDingTime = true;
          _this.WordDingFun(downWorkDingEndTime.subtract(downWorkTime));
        }

        const upWorkTime = dayjs(`${day_str} ${upWorkTime_str}`);
        const isUpWorkTimeAfter = DayObj.isAfter(upWorkTime); // 之后
        const isDownWorkTimeBefore = DayObj.isBefore(downWorkTime); // 之前

        if (isUpWorkTimeAfter && isDownWorkTimeBefore) {
          _this.isWorkTime = true;
        }
      }
    },

    WordDingFun(diff) {
      const secDiff = diff / 1000;
      const randSec = GetRandom(0, secDiff);

      console.log("randSec", randSec);
    },

    OpenQiYeWeiXin() {
      plus.runtime.launchApplication(
        {
          pname: "com.tencent.wework",
        },
        (e) => {
          alert(+e.message);
        }
      );
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 100rpx;
  width: 100rpx;
  margin-top: 20rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
