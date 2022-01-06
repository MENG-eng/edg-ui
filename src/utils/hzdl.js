/**
 * 通用js方法封装处理
 */

import md5 from 'md5'

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 保留小数
export function decimal(num, count) {
  if (num === undefined) {
    return num
  } else {
    if (num.toFixed(count).toString().split(".")[1] > 0) {
      return num.toFixed(count)
    } else {
      return num.toString().split(".")[0]
    }
  }
}

/**
 * 断言
 * @param {*} condition 条件语句
 * @param {*} func 断言无误将执行的方法
 * @param {*} msg 异常信息
 */
export function assert(condition, func, msg) {
  let message = msg || "断言 - 未知异常";
  if (condition) {
    func();
  } else {
    throw new Error(`[vue] ${message}`);
  }
}


// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  })
  return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue == ('' + temp[val])) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用下载方法
export function download(fileName) {
  window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || Math.min.apply(Math, data.map(item => {
    return item[parentId]
  })) || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] == null || father[parentId] == rootId;
  });
  return treeData !== '' ? treeData : data;
}

export function md5Hashlist(hashlist) {
  const list = hashlist.sort(function (hash_pre, hash_suf) {
    return hash_pre.localeCompare(hash_suf);
  });
  let attachmentTotalHash;
  if (list.length <= 0) {
    attachmentTotalHash = null;
  } else {
    attachmentTotalHash = "";
    list.map((item) => {
      attachmentTotalHash += item;
    });
  }
  if (attachmentTotalHash) {
    attachmentTotalHash = md5(attachmentTotalHash);
  }
  return attachmentTotalHash;
}

// 操作类型枚举
const opt_type = {
  CREATE: "创建",
  ADD: "增加",
  MODIFY: "修改",
  COPY: "复制"
}

export function handleOptType(type) {
  return opt_type[type];
}

// 获取节点图形
export function nodeShape(type) {
  const opt_type = {
    CREATE: "circle",
    ADD: "rect",
    MODIFY: "diamond",
    COPY: "triangle",
  };
  return opt_type[type];
}

// 获取节点大小
export function nodeSize(type) {
  const opt_type = {
    CREATE: "28",
    ADD: [28, 28],
    MODIFY: "34",
    COPY: "18",
  };
  return opt_type[type];
}

// 获取偏移
export function nodeOffset(type) {
  const opt_type = {
    CREATE: 10,
    ADD: 11,
    MODIFY: 8,
    COPY: 16,
  };
  return opt_type[type];
}

// 加载动画
export function loadingView(cfg) {
  let config = {
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  };
  if (cfg) {
    for (const key of Object.keys(cfg)) {
      config[key] = cfg[key]
    }
  }
  const loading = this.$loading(config);
  return loading;
}
