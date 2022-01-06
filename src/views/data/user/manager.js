
import { quoteTop, quoteTotal } from "@/api/edg/evidence"
// 获取热度共享数据排名
export const getxBarData = () => {
    return quoteTop().then((response) => {
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

// 获取各能源数据占比
export const getpieData = () => {
    return quoteTotal().then((response) => {
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