import {
  decimal
} from '@/utils/hzdl.js'
import {
  // 机构数量汇总
  deptTotal,

  // 能源类型数量汇总
  typeTotal,

  // 数据类型数量汇总
  evidenceTotal,

  // 信息汇总
  infoTotal,

  // 各类文章数量汇总
  articleTotal,

  // 无条件共享详情
  evidenceShare,

  // 更新周期详情
  updateInfo,
} from "../../../../api/data/statistics";

// 获取能源机构总数 
export const getDeptPanelData = () => {
  return deptTotal().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          count: item.count,
          des: "个机构"
        })
      })
      return val
    }
  });
}

// 获取数据类型总数 
export const getEnergyTypePanelData = () => {
  return typeTotal().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          count: item.count,
          des: "类能源"
        })
      })
      return val
    }
  });
}

// 获取数据类型数量汇总
export const getEvidencePanelData = () => {
  return evidenceTotal().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          count: item.count,
          des: "份数据"
        })
      })
      return val
    }
  });
}

// 获取能源数据共享率
export const getSharePanelData = () => {
  return evidenceShare().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          proportion: `${decimal((item.sharedCount / (item.coun || 1)) * 100, 2)}%`
        })
      })
      return val
    }
  });
}

// 获取能源数据更新率
export const getFrequencyPanelData = () => {
  return updateInfo().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          proportion: `${decimal((item.params.refreshCount / (item.count || 1)) * 100, 2)}%`
        })
      })
      return val
    }
  });
}

// 获取机构文章统计
export const getDeptArticlePanelData = () => {
  return infoTotal().then((response) => {
    if (response.code === 200) {
      return response.data || []
    }
  });
}

// 获取文章统计
export const getArticleData = () => {
  return articleTotal().then((response) => {
    if (response.code === 200) {
      const res = response.data || []
      let val = []
      res.map(item => {
        val.push({
          name: item.name,
          value: item.count
        })
      })
      return val
    }
  });
}

export const colors = [
  "#0FFCFF",
  "#48D36C",
  "#016DFF",
  "#FFD201",
  "#FF8955",
  "#FE5454",
  "#3FFFEA",
  "#417DE9",
  "#A87239",
  "#7AA284",
  "#1DCAFF",
  "#944EFF",]
