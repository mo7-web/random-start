<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ nowTime }}</text>
    </view>
    <button @click="OpenQiYeWeiXin">打开企业微信</button>
  </view>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      nowTime: "",
    };
  },
  onLoad() {
    setInterval(() => {
      this.GetNowTime();
    }, 1000);
  },
  methods: {
    GetNowTime() {
      const date = dayjs().format("YYYY-MM-DDTHH:mm:ss");
      this.nowTime = date;
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
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
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
