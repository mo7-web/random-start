// 小工具集合

export const CloneDeep = (data) => {
  if (data) {
    return JSON.parse(JSON.stringify(data));
  } else {
    return data;
  }
};

const Timer = {};
export const CreateInterval_Global = (TimerName, Func, time = 1000) => {
  clearInterval(Timer[TimerName]);
  Timer[TimerName] = setInterval(() => {
    Func();
  }, time);
};

export const ClearInterval_Global = (TimerName) => {
  clearInterval(Timer[TimerName]);
};
