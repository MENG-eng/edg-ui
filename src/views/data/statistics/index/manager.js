import {
  decimal
} from "@/utils/hzdl.js"
import {
  // 数据统计
  evidenceStatistics,

  // 用户活跃度
  userActivity,

  // 数据存量
  fileSizeStatistics,

  // 各种类型能源数据数据占比
  typeEvidenceStatistics,

  // 数据数据量、异常统计
  evidenceExceptionStatistics,

  // 热度共享数据
  evidenceQuoteTop10,

  // 各能源数据本月数据折线图
  evidenceMonthStatistics,
} from "../../../../api/data/statistics";

// 获取数据统计
export const getPanelGroupData = () => {
  return new Promise((resolve, reject) => {
    let evidenceData, fileSizeData, activityData;
    evidenceStatistics().then(res => {
      evidenceData = res.data;
      return fileSizeStatistics()
    }).then(res => {
      fileSizeData = res.data;
      return userActivity()
    }).then(res => {
      activityData = res.data;
      //console.log(evidenceData, fileSizeData, activityData)

      // 今日数据
      const t_e_cnt = evidenceData.todayEvidenceCount || 0;
      // 昨日数据
      const y_e_cnt = evidenceData.yesterdayEvidenceCount || 0;
      // 总数据量
      const total_cnt = evidenceData.totalEvidenceCount || 0;
      // 今日共享
      const t_e_c_cnt = evidenceData.todayEvidenceCopyCount || 0;
      // 昨日共享
      const y_e_c_cnt = evidenceData.yesterdayEvidenceCopyCount || 0;

      const item1 = {
        name: "今日数据笔数",
        value: `${t_e_cnt}笔 ${
                    t_e_cnt - y_e_cnt >= 0 ? "+" : ""
                  }${decimal(((t_e_cnt) / (y_e_cnt || 1)) * 100, 2)}%`,
        icon: "todayCount",
      }
      const item2 = {
        name: "总数据量",
        value: `${evidenceData.totalEvidenceCount}笔`,
        icon: "totalCount",
      }
      const item3 = {
        name: "今日共享次数",
        value: `${t_e_c_cnt}笔 ${
            t_e_c_cnt - y_e_c_cnt >= 0 ? "+" : ""
          }${decimal(
            ((t_e_c_cnt) / (y_e_c_cnt || 1)) * 100,
            2
          )}%`,
        icon: "share",
      }
      const item4 = {
        name: "能源大数据存量",
        value: `${
          decimal(fileSizeData || 0, 2) || 0
        } GB`,
        icon: "energyData",
      }
      const item5 = {
        name: "用户活跃度",
        value: `${decimal((activityData || 1)* 100,2) }%`,
        icon: "consumer",
      }
      resolve([item1, item2, item3, item4, item5])

    })
  })
}

// 获取热度共享数据TOP10
export const getStripData = () => {
  return evidenceQuoteTop10().then((response) => {
    if (response.code === 200) {
      const data = response.data || [];
      let val = []
      data.map(item => {
        val.push({
          name: item.name,
          value: item.cnt
        })
      })
      return val
    }
  });
}

// 获取各能源数据占比
export const getPieData = () => {
  return typeEvidenceStatistics().then((response) => {
    if (response.code === 200) {
      const data = response.data || [];
      let total = 0;
      data.map((item) => {
        total += item.cnt;
      });
      let val = [];
      data.map((item) => {
        val.push({
          name: item.name,
          value: item.cnt,
        });
      });
      return val
    }
  });
}

// 获取各能源存证量以及异常统计
export const getHistogramData = () => {
  return evidenceExceptionStatistics().then((response) => {
    if (response.code === 200) {
      const data = response.data || [];
      let val = {
        type: [],
        value1: [],
        value2: [],
      };
      data.map((item) => {
        val.type.push(item.date);
        val.value1.push(item.evidenceCnt);
        val.value2.push(item.exceptionCnt);
      });
      return val
    }
  });
}
