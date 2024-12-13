<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    {{ Version }}
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
      <text class="title">
        上班打卡({{ LocalData.IsUpWorkDing }}):
        {{ LocalData.UpWorkDingTime }}
      </text>
    </view>
    <view class="text-area">
      <text class="title">
        下班打卡({{ LocalData.IsDownWorkDing }}):
        {{ LocalData.DownWorkDingTime }}
      </text>
    </view>

    <button @click="OpenQiYeWeiXin">手动打开企业微信</button>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { isWorkday } from "chinese-workday";
import { CloneDeep, CreateInterval_Global, GetRandom } from "@/common/tools";
import manifestJson from "@/manifest.json";

const upStartWorkDingTime_str = "08:50:00";
const upWorkTime_str = "09:00:00";
const upEndWorkDingTime_str = "09:07:00";

const downWorkTime_str = "18:00:00";
const downWorkDingEndTime_str = "18:20:00";

export default {
  data() {
    return {
      Version: "",
      nowTime: "",
      isWorkDay: false,
      isWorkTime: false,

      LocalData: {},
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
      _this.Version = manifestJson.versionName;

      const NowDay = dayjs().format("YYYY-MM-DD");
      _this.nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

      // uni.removeStorageSync("LocalData");

      const LocalData = uni.getStorageSync("LocalData");
      if (!LocalData) {
        const LocalData = {
          LastDay: NowDay, // 最后的日期
          IsUpWorkDing: false, // 是否打了上班卡
          UpWorkDingTime: "", // 上班打卡时间
          IsDownWorkDing: false, // 是否打了下班卡
          DownWorkDingTime: "", // 下班打卡时间
        };
        uni.setStorageSync("LocalData", LocalData);
        return;
      }

      if (LocalData.LastDay != NowDay) {
        uni.removeStorageSync("LocalData");
        return;
      }
      _this.LocalData = LocalData;

      _this.isWorkDay = false;
      _this.isWorkTime = false;
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

        const downWorkTime = dayjs(`${day_str} ${downWorkTime_str}`);
        const downWorkDingEndTime = dayjs(
          `${day_str} ${downWorkDingEndTime_str}`
        );

        const upWorkTime = dayjs(`${day_str} ${upWorkTime_str}`);

        const isUpWorkTimeAfter = DayObj.isAfter(upWorkTime); // 之后
        const isDownWorkTimeBefore = DayObj.isBefore(downWorkTime); // 之前
        if (isUpWorkTimeAfter && isDownWorkTimeBefore) {
          _this.isWorkTime = true;
        }

        if (
          _this.LocalData.UpWorkDingTime &&
          _this.LocalData.DownWorkDingTime
        ) {
          //
        } else {
          const upWorkDiff =
            upWorkDingEndTime.subtract(upWorkDingStartTime) / 1000;
          const downWorkDiff =
            downWorkDingEndTime.subtract(downWorkTime) / 1000;

          const upWorkDingDelay = GetRandom(0, upWorkDiff);
          const downWorkDingDelay = GetRandom(0, downWorkDiff);

          const upWorkDingTime = upWorkDingStartTime.add(
            upWorkDingDelay,
            "second"
          );
          const downWorkDingTime = downWorkTime.add(
            downWorkDingDelay,
            "second"
          );

          _this.LocalData.UpWorkDingTime = upWorkDingTime.format(
            "YYYY-MM-DD HH:mm:ss"
          );
          _this.LocalData.DownWorkDingTime = downWorkDingTime.format(
            "YYYY-MM-DD HH:mm:ss"
          );
          uni.setStorageSync("LocalData", CloneDeep(_this.LocalData));
        }
        _this.WordDingFunc();
      }
    },

    WordDingFunc() {
      const _this = this;
      if (!_this.LocalData.IsUpWorkDing) {
        // 没打上班卡
        const UpWorkDingTime = _this.LocalData.UpWorkDingTime;
        const IsUpDing = dayjs().isAfter(dayjs(UpWorkDingTime));

        if (IsUpDing) {
          _this.OpenQiYeWeiXin("UpDing");
        }
      }
      if (!_this.LocalData.IsDownWorkDing) {
        // 没打下班卡
        const DownWorkDingTime = _this.LocalData.DownWorkDingTime;
        const IsDownDing = dayjs().isAfter(dayjs(DownWorkDingTime));
        if (IsDownDing) {
          _this.OpenQiYeWeiXin("DownDing");
        }
      }
    },

    OpenQiYeWeiXin(type) {
      const _this = this;
      if (type == "UpDing") {
        _this.LocalData.IsUpWorkDing = true;
      }
      if (type == "DownDing") {
        _this.LocalData.IsDownWorkDing = true;
      }
      uni.setStorageSync("LocalData", CloneDeep(_this.LocalData));

      plus.runtime.launchApplication(
        {
          pname: "com.tencent.wework",
        },
        (e) => {
          alert(+e.message);
          if (type == "UpDing") {
            _this.LocalData.IsUpWorkDing = false;
          }
          if (type == "DownDing") {
            _this.LocalData.IsDownWorkDing = false;
          }
          uni.setStorageSync("LocalData", CloneDeep(_this.LocalData));
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
