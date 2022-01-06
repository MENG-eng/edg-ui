import {decimal} from '@/utils/hzdl.js'
import { evidenceStatistics, userActivity, fileSizeStatistics, typeEvidenceStatistics, evidenceQuoteTop10, evidenceExceptionStatistics, evidenceMonthStatistics } from "../../../../api/data/statistics"

// 获取数据统计 
export const gettotalInfoData = () => {
    return evidenceStatistics().then((response) => {
        if (response.code === 200) {
          const data = response.data || {};
          // 今日数据
          const t_e_cnt = data.todayEvidenceCount || 0;
          // 昨日数据
          const y_e_cnt = data.yesterdayEvidenceCount || 0;
          // 总数据量
          const total_cnt = data.totalEvidenceCount || 0;
          // 今日共享
          const t_e_c_cnt = data.todayEvidenceCopyCount || 0;
          // 昨日共享
          const y_e_c_cnt = data.yesterdayEvidenceCopyCount || 0;

          let totalInfoData = {
            todayCount: "",
            totalCount: "",
            share: "",
          };

          // decimal 全局求余方法
          totalInfoData.todayCount = `${t_e_cnt}笔 ${
            t_e_cnt - y_e_cnt >= 0 ? "+" : ""
          }${decimal((t_e_cnt / (y_e_cnt || 1)) * 100, 2)}%`;

          totalInfoData.totalCount = `${total_cnt}`;

          totalInfoData.share = `${t_e_c_cnt}笔 ${
            t_e_c_cnt - y_e_c_cnt >= 0 ? "+" : ""
          }${decimal((t_e_c_cnt / (y_e_c_cnt || 1)) * 100, 2)}%`;

          return totalInfoData
        }
    });
}

// 获取用户活跃度
export const getuserActivityData = () => {
    return userActivity().then((response) => {
        if (response.code === 200) {
          let userActivityData = 0;
          userActivityData = `${decimal((response.data || 1) * 100,2)}%`;
          return userActivityData
        }
    });
}

// 获取数据存量
export const getfileSizeStatisticsData = () => {
    return fileSizeStatistics().then((response) => {
        if (response.code === 200) {
          let fileSizeStatisticsData = 0;
          fileSizeStatisticsData = `${decimal(response.data || 0, 2) || 0} `;
          return fileSizeStatisticsData
        }
    });
} 

// 获取各能源数据占比
export const getpieData = () => {
    return typeEvidenceStatistics().then((response) => {
        if (response.code === 200) {
          const data = response.data || [];
          let total = 0;
          data.map((item) => {
            total += item.cnt;
          });
          let pieData = [];
          data.map((item) => {
            pieData.push({
              name: item.name,
              value: item.cnt,
            });
          });
          return pieData
        }
    });
}

// 获取热度共享数据排名
export const getxBarData = () => {
    return evidenceQuoteTop10().then((response) => {
        if(response.code === 200) {
            const data = response.data || [];
            let xBarData = {
                name: [],
                cnt: [],
            };
            data.map((item) => {
                xBarData.name.push(item.name);
                xBarData.cnt.push(item.cnt);
            });
            return xBarData
        }
    });
}

// 获取各能源存证量以及异常统计
export const getyBarData = () => {
    return evidenceExceptionStatistics().then((response) => {
        if(response.code === 200) {
            const data = response.data || [];
            let yBarData = {
                evidenceCnt: [],
                exceptionCnt: [],
                date: [],
            };
            data.map((item) => {
                yBarData.evidenceCnt.push(item.evidenceCnt);
                yBarData.exceptionCnt.push(item.exceptionCnt);
                yBarData.date.push(item.date);
            });
            return yBarData
        }
    });
}

// 获取各能源数据本月存证
export const getLineData = () => {
    return evidenceMonthStatistics().then((response) => {
        if(response.code === 200) {
            const resData = response.data || [];
            let LineData = {
                // 日期
                dateList: [],
                // 能源类型
                typeList: [],
                // 能源类型每日数据
                cntList: [],
            }

            //能源类型列表表
            resData.map((item) => {
                LineData.typeList.push(item.type);
            });

            //日期列表
            if (resData.length > 0) {
                const data = resData[0].data;
                data.map((item) => {
                    LineData.dateList.push(item.name);
                });
            }

            //能源类型列表表
            for (let typeIdx = 0; typeIdx < LineData.typeList.length; typeIdx++) {
                // 存储数据
                let newCnt = [];
                for (let dateIdx = 0; dateIdx < LineData.dateList.length; dateIdx++) {
                    newCnt.push(resData[typeIdx].data[dateIdx].cnt);
                }
                LineData.cntList.push(newCnt);
            }
            return LineData
        }
    });
}