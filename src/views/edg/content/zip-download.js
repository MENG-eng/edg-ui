import FileSaver from 'file-saver'; //https://stuk.github.io/jszip/
import JSZip from 'jszip'; //https://github.com/eligrey/FileSaver.js/
import axios from 'axios';

export function downloadFile(data, zip_name) {
  handleBatchDownload(data, zip_name)
}

async function handleBatchDownload(selectList, name) {
  const data = selectList;
  const zip = new JSZip()
  const cache = {}
  const promises = []
  await data.forEach((item) => {
    const promiseItem = getFile(item).then(dta => {
      // dta为getFile处理过的arraybuffer格式的单个文件
      const arr_name = item.split("/"); // 处理名称
      var file_name = arr_name[arr_name.length - 1]
      zip.file(file_name, dta, {
        binary: true
      }) // 逐个添加文件
      cache[file_name] = dta
    })
    promises.push(promiseItem)
  })
  Promise.all(promises).then(() => {
    zip.generateAsync({
      type: "blob"
    }).then(content => { // 生成二进制流
      FileSaver.saveAs(content, name + ".zip") // 利用file-saver保存文件
    }).catch(err => {
      message.error('网络出现了一点小问题，请稍后重试')
    })
  })
}

// 获取文件的arraybuffer格式并传入进行打包准备
export function getFile(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    }).then(res => {
      resolve(res.data)
    }).catch(error => {
      reject(error.toString())
    })
  })
}
