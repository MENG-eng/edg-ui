<template>
  <div id="app-container" class="app-container">
    <div class="previous-container">
      <div class="row">
        <h4 :style="{ marginBottom: '0px', color: '#FFFFFF' }">节点溯源</h4>
        <div class="tip-container">
          <p class="tipinfo">
            <img src="../../../assets/image/circle.png" />原始文件
          </p>
          <p class="tipinfo">
            <img src="../../../assets/image/triangle.png" />复制操作
          </p>
          <p class="tipinfo">
            <img src="../../../assets/image/star.png" />修改操作
          </p>
          <p class="tipinfo">
            <img src="../../../assets/image/rect.png" />增加操作
          </p>
        </div>
      </div>

      <div class="row">
        <div v-if="progressVisable" class="row">
          <div style="margin-right: 12px">溯源中...</div>
          <el-progress
            class="traceability-progress"
            :text-inside="true"
            :stroke-width="26"
            :percentage="progressValue"
          ></el-progress>
        </div>

        <div v-else class="row">
          <div v-if="lastTraceInfo" class="row">
            <div class="traceability-text">上次溯源</div>
            <div class="traceability-text">时间：{{ lastTraceInfo.date }}</div>
            <div class="traceability-text">
              节点数量：{{ lastTraceInfo.nodeCount }}
            </div>
            <div class="traceability-text">
              操作人：{{ lastTraceInfo.operator }}
            </div>
            <div class="row">
              <div class="traceability-text">结果：</div>
              <div
                :style="{
                  color: lastTraceInfo.success === true ? '#7ed321' : '#d02d02',
                }"
              >
                {{ lastTraceInfo.success === true ? "溯源无误" : "溯源异常" }}
              </div>
            </div>
          </div>
        </div>
        <el-button
          type="primary"
          @click="handleValid"
          :disabled="progressVisable"
          :style="{ marginLeft: '16px' }"
          >溯源</el-button
        >
      </div>
    </div>

    <div class="content-page">
      <div class="page-top">
        <div class="mind-container-wrapper">
          <div id="mindContainer" ref="mind"></div>
          <el-dialog
            title=""
            :visible.sync="dialogVisible"
            customClass="customWidth"
            @close="handleCancle"
          >
            <div class="topDemo">
              <div>
                <div v-if="currentNode" class="node-info">
                  <div class="row" style="margin: 3px 0">
                    <div class="message-blod">
                      {{ `文件版本：${currentNode.version}` }}
                    </div>
                    <span class="m10">|</span>
                    <div class="message-blod">
                      {{ `所在区块号：${currentNode.blockHeight}` }}
                    </div>
                    <span class="m10">|</span>
                    <div class="message-blod">
                      {{ `操作类型：${handleOptType(currentNode.optType)}` }}
                    </div>
                  </div>

                  <div class="row">
                    <div class="textDec">操作人</div>
                    <div>：</div>
                    <div class="message">
                      {{ currentNode.operatorName || "" }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="textDec">操作时间</div>
                    <div>：</div>
                    <div class="message">
                      {{ currentNode.createTime || "" }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="textDec">文件描述</div>
                    <div>：</div>
                    <div class="message">
                      {{ currentNode.description || "" }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="row">
                      <div class="textDec">
                        链上交易码
                        <el-tooltip effect="light" placement="top-start">
                          <div slot="content">
                            链上交易码：<br />区块链由区块链接形成，区块由多<br />笔交易构成，每笔交易都拥有自己<br />唯一的交易码，交易码存储在区块<br />中不可被篡改。
                          </div>
                          <i class="el-icon-info"></i
                        ></el-tooltip>
                      </div>
                      <div>：</div>
                    </div>
                    <div class="message">{{ currentNode.txid }}</div>
                  </div>
                  <div class="row">
                    <div class="row">
                      <div class="textDec">
                        文件摘要
                        <el-tooltip effect="light" placement="top-start">
                          <div slot="content">
                            文件摘要：<br />文件摘要由文件本体计算而出，具<br />有唯一性，同一份文件计算出的摘<br />要相同。文件摘要可用于验证文件<br />一致性。
                          </div>
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </div>
                      <div>：</div>
                    </div>
                    <div class="message">{{ currentNode.fileHash || "" }}</div>
                  </div>
                  <div class="row">
                    <div class="row">
                      <div class="textDec">
                        附件总摘要
                        <el-tooltip effect="light" placement="top-start">
                          <div slot="content">
                            附件总摘要：<br />附件总摘要由所有附件共同计算而<br />出，具有唯一性，如果其中某一份<br />附件发生改变，附件总摘要也会发<br />生变化，可用于验证附件集合的一<br />致性。
                          </div>
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </div>
                      <div>：</div>
                    </div>
                    <div class="message">
                      {{ currentNode.attachmentTotalHash || "无" }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="row">
                      <div class="textDec">
                        所在区块哈希号
                        <el-tooltip effect="light" placement="top-start">
                          <div slot="content">
                            所在区块哈希号：<br />标识包含本次操作的交易所在区块<br />的哈希号，哈希号是区块唯一性的<br />标志，不可篡改。
                          </div>
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </div>
                      <div>：</div>
                    </div>
                    <div class="message">{{ currentNode.blockHash || "" }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div id="mind-containerAll" ref="mindAnother"></div>
          </el-dialog>
          <div class="btn-container">
            <el-tooltip
              class="item"
              effect="light"
              content="全屏"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                class="normal-btn"
                type="text"
                icon="el-icon-full-screen"
                @click="handleFull"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="light"
              content="重置"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                class="normal-btn"
                type="text"
                icon="el-icon-refresh"
                @click="handleResetChart"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="light"
              content="放大"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                class="normal-btn"
                type="text"
                icon="el-icon-plus"
                @click="handleEnlarge"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="light"
              content="缩小"
              placement="bottom"
              :open-delay="1500"
            >
              <el-button
                class="normal-btn"
                type="text"
                icon="el-icon-minus"
                @click="handleReduce"
              ></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="node-describe-container">
          <div>
            <div v-if="currentNode" class="node-info">
              <div class="row">
                <div class="message-blod">
                  {{ `文件版本：${currentNode.version}` }}
                </div>
                <span class="m10">|</span>
                <div class="message-blod">
                  {{ `所在区块号：${currentNode.blockHeight}` }}
                </div>
                <span class="m10">|</span>
                <div class="message-blod">
                  {{ `操作类型：${handleOptType(currentNode.optType)}` }}
                </div>
              </div>

              <div class="row">
                <div class="textDec">操作人</div>
                <div>：</div>
                <div class="message">
                  {{ currentNode.operatorName || "" }}
                </div>
              </div>
              <div class="row">
                <div class="textDec">操作时间</div>
                <div>：</div>
                <div class="message">
                  {{ currentNode.createTime || "" }}
                </div>
              </div>
              <div class="row">
                <div class="textDec">文件描述</div>
                <div>：</div>
                <div class="message">
                  {{ currentNode.description || "" }}
                </div>
              </div>
              <div class="row">
                <div class="row">
                  <div class="textDec">
                    链上交易码
                    <el-tooltip effect="light" placement="top-start">
                      <div slot="content">
                        链上交易码：<br />区块链由区块链接形成，区块由多<br />笔交易构成，每笔交易都拥有自己<br />唯一的交易码，交易码存储在区块<br />中不可被篡改。
                      </div>
                      <i class="el-icon-info"></i
                    ></el-tooltip>
                  </div>
                  <div>：</div>
                </div>
                <div class="message">{{ currentNode.txid }}</div>
              </div>
              <div class="row">
                <div class="row">
                  <div class="textDec">
                    文件摘要
                    <el-tooltip effect="light" placement="top-start">
                      <div slot="content">
                        文件摘要：<br />文件摘要由文件本体计算而出，具<br />有唯一性，同一份文件计算出的摘<br />要相同。文件摘要可用于验证文件<br />一致性。
                      </div>
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                  <div>：</div>
                </div>
                <div class="message">{{ currentNode.fileHash || "" }}</div>
              </div>
              <div class="row">
                <div class="row">
                  <div class="textDec">
                    附件总摘要
                    <el-tooltip effect="light" placement="top-start">
                      <div slot="content">
                        附件总摘要：<br />附件总摘要由所有附件共同计算而<br />出，具有唯一性，如果其中某一份<br />附件发生改变，附件总摘要也会发<br />生变化，可用于验证附件集合的一<br />致性。
                      </div>
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                  <div>：</div>
                </div>
                <div class="message">
                  {{ currentNode.attachmentTotalHash || "无" }}
                </div>
              </div>
              <div class="row">
                <div class="row">
                  <div class="textDec">
                    所在区块哈希号
                    <el-tooltip effect="light" placement="top-start">
                      <div slot="content">
                        所在区块哈希号：<br />标识包含本次操作的交易所在区块<br />的哈希号，哈希号是区块唯一性的<br />标志，不可篡改。
                      </div>
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </div>
                  <div>：</div>
                </div>
                <div class="message">{{ currentNode.blockHash || "" }}</div>
              </div>
            </div>
          </div>
          <div v-if="currentNode" class="opt-container">
            <el-button
              type="text"
              icon="el-icon-plus"
              @click="handleAdd"
              class="reset-btn"
              >增加附件</el-button
            >
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate"
              class="reset-btn"
              >修改文件</el-button
            >
          </div>
        </div>
      </div>

      <div class="page-bot">
        <div class="file-container">
          <el-table :data="dataFiles" row-key="id" stripe>
            <el-table-column label="原始文件" align="center">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      scope.row.id === currentAttachmentId ? '#1890ff' : '',
                    cursor: 'pointer',
                  }"
                  @click="handleFile(scope.row, scope.row.id)"
                >
                  {{ scope.row.fileName || "" }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="attachments" row-key="id">
            <el-table-column label="附件" align="center">
              <template slot-scope="scope">
                <div
                  :style="{
                    color:
                      scope.row.id === currentAttachmentId ? '#1890ff' : '',
                    cursor: 'pointer',
                  }"
                  @click="handleFile(scope.row, scope.row.id)"
                >
                  {{ scope.row.fileName || "" }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="imgPreviewContainer">
          <div
            class="row between"
            :style="{ width: '100%', marginBottom: '16px' }"
          >
<!--            <div>-->
<!--              {{ (currentAttachment && currentAttachment.fileName) || "" }}-->
<!--            </div>-->
            <div>共享内容预览</div>
            <div class="row">
              <el-button
                size="mini"
                type="primary"
                @click="handleDownload"
                :loading="downloadLoading"
                >下载</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleDownloadBlockFile"
                :loading="downloadAllLoading"
                >下载区块全部文件</el-button
              >
            </div>
          </div>
          <div class="file-wrapper">
            <div class="preview-txt-container" v-if="ifTxtFile">
              {{ fileContent }}
            </div>
            <iframe
              v-else
              :src="previewUrl"
              class="preview-iframe"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="visable" class="dialog">
      <el-form
        :model="formParams"
        ref="form"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="数据名称" prop="fileName">
          <el-input
            v-model="formParams.model.fileName"
            placeholder="数据名称"
            clearable
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="数据文件" prop="file">
          <el-upload
            ref="fileUpload"
            class
            action
            :limit="1"
            accept=".jpg,.png,.pdf,.doc"
            :file-list="formParams.fileList"
            :before-upload="handleBeforeUpload"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :http-request="uploadDataFile"
            :disabled="title === '增加'"
          >
            <el-button size="small" type="primary" :disabled="title === '增加'"
              >点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">
              可上传jpg/png/pdf/doc格式文件
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据类型" prop="evidenceType">
          <el-input
            v-model="formParams.model.evidenceTypeName"
            placeholder="数据类型"
            size="small"
            disabled
          />
        </el-form-item>

        <el-form-item label="文件描述" prop="description">
          <el-input
            type="textarea"
            v-model="formParams.description"
            placeholder="文件描述"
            :autosize="{ minRows: 6, maxRows: 10 }"
          ></el-input>
        </el-form-item>

        <el-form-item label="附件">
          <el-upload
            ref="attachmentUpload"
            class
            action
            accept=".jpg,.png,.pdf,.doc"
            :file-list="formParams.attachmentFileList"
            :before-upload="handleBeforeUploadAttachment"
            :before-remove="beforeRemoveAttachment"
            :http-request="uploadAttachmentFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              可上传jpg/png/pdf/doc格式文件
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import request from "../../../utils/request";
import request2 from "../../../utils/request2";
import { downloadFile } from "./zip-download";
import {
  /** @api 获取所有节点 */
  evidenceContentNodeList,
} from "../../../api/edg/content";

import {
  /** @api 上一次溯源信息 */
  lastVerifyInfo,

  /** @api 获取节点所有附件 */
  evidenceAttachment,

  /** @api 溯源 */
  evidenceNodeValid,

  /** @api 获取节点文件 */
  evidenceFiles,

  /** @api 增加数据 */
  addEvidence,

  /** @api 修改数据 */
  modifyEvidence,
} from "../../../api/edg/evidence";

import {
  /** @api 上传文件 */
  uploadFile,
} from "@/api/file";

import md5 from "md5";
import { file_api } from '../../../settings'

/**
 * @节点颜色
 * 0 主链 蓝
 * 1 从链 棕
 * 2 原始 灰
 * 3 异常 红
 */
const nodeColors = ["#99d0ff", "#e3d5bb", "#cfcfcf", "#f89aa4"];

export default {
  inject: ["reload"],
  data() {
    /** 校验是否上传文件 */
    const validateFileEmpty = (rule, value, callback) => {
      if (this.formParams.fileList.length > 0) {
        callback();
      } else {
        callback(new Error("数据文件不能为空"));
      }
    };
    return {
      // 是否满屏显示
      dialogVisible: false,

      /** 起始节点 */
      originNodeId: null,

      /** 所有节点 */
      nodeListData: [],

      /** 流程图 */
      mindChart: null,

      /** 当前节点id */
      evidenceNodeId: "",

      /** 下载文件 */
      downloadLoading: false,

      /** 下载所有文件 */
      downloadAllLoading: false,

      /** 描原始文件 */
      dataFiles: [],

      /** 附件 */
      attachments: [],

      /** 当前文件 */
      currentAttachment: null,

      /** 是否是文档文件 */
      ifTxtFile: false,

      /** 当前文件内容 */
      fileContent: "",

      /** 当前附件id */
      currentAttachmentId: "",

      /** 当前节点 */
      currentNode: null,

      /** 最近一次溯源信息 */
      lastTraceInfo: null,

      /** 进度条可见 */
      progressVisable: false,

      /** 进度条进度 */
      progressValue: 0,

      /** 文件服务器地址 */
      fileServer: null,

      /** 预览服务器地址 */
      previewServer: null,

      /** 文件预览地址 */
      previewUrl: null,

      /** 流程图数据 */
      nodes: [],

      /** 个人最新版本 */
      newestNode: null,

      /** 节点树 */
      nodeTree: {},

      /** 弹窗标题 */
      title: "",

      /** 弹窗是否可见 */
      visable: false,

      /** 弹窗参数 */
      formParams: {
        /** 描述 */
        description: "",

        // /** 附件名称 */
        // attachmentFileNameList: [],

        /** 暂存模型 */
        model: {},

        /** 原始文件 */
        fileList: [],

        /** 附件 */
        attachmentFileList: [],

        /** 原来的附件 */
        oldAttachmentFileList: [],
        // 数据名称
        fileName: null,
        // 数据类型
        evidenceTypeName: null,
      },

      // 弹窗rules
      formRules: {
        /** 原始文件不能为空 */
        file: [{ required: true, validator: validateFileEmpty }],

        /** 描述不能为空 */
        description: [
          { required: true, message: "描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    defaultFileChange() {
      const { fileServer, previewServer, dataFiles } = this;
      return { fileServer, previewServer, dataFiles };
    },
  },
  watch: {
    /** 设置默认选中的文件 */
    defaultFileChange(newValue, oldValue) {
      if (this.fileServer && this.previewServer && this.dataFiles.length) {
        const file = this.dataFiles[0];
        this.handleFile(file, file.id);
      }
    },
  },
  mounted() {
    const item = JSON.parse(this.$route.query.item);
    this.evidenceNodeId = item.originNodeId;
    this.originNodeId = item.originNodeId;
    this.evidenceTypeName = item.evidenceTypeName;
    this.fileName = item.fileName;

    this.getEvidenceNode();
    this.getEvidenceAttachment(this.evidenceNodeId);
    this.getLastVerifyInfo();
    this.getServer();

    window.onresize = () => {
      this.pageResize(this.reload, 300);
    };
  },
  methods: {
    /** 页面重绘 */
    pageResize(func, delay) {
      return (function (args) {
        let that = this;
        let _args = args;
        clearTimeout(func.timer);
        func.timer = setTimeout(function () {
          func.call(that, _args);
        }, delay);
      })();
    },

    // 关闭dialog时，mindChart 由全屏chart指向内页面 chart
    handleCancle() {
      this.drawMindChart("mind-container", "mind");
    },

    /** 获取数据节点信息 */
    getEvidenceNode() {
      const item = JSON.parse(this.$route.query.item);
      const originNodeId = item.originNodeId || "";
      this.originNodeId = originNodeId;
      evidenceContentNodeList(originNodeId).then((response) => {
        let list = response.data || [];
        this.nodeListData = list;
        this.handleNodeTree();
      });
    },

    /** 处理节点信息 */
    handleNodeTree() {
      let list = this.nodeListData;
      let nodes = list.filter((node) => {
        node.style = {
          fill: nodeColors[node.nodeType],
          lineWidth: node.id == this.originNodeId ? 2 : 0,
        };
        node.type = this.nodeShape(node.optType);
        node.size = this.nodeSize(node.optType);
        return node;
      });
      this.nodes = nodes;
      let nodeTree = this.handleTree(nodes, "id", "parentId");
      this.nodeTree = nodeTree.length > 0 ? nodeTree[0] : {};
      /** 画溯源图 */
      this.drawDagreChart("mindContainer", "mind");
      this.$nextTick(() => {
        this.handleNode(parseInt(this.originNodeId));
      });
      /** 最新版本 */
      let mainNodes = nodes.filter((item) => {
        return item.nodeType === 0;
      });

      let newNode = { id: -1 };
      for (let idx = 0; idx < mainNodes.length; idx++) {
        const node = mainNodes[idx];
        if (node.id > newNode.id) {
          newNode = node;
        }
      }
      this.newestNode = newNode;
    },

    /** 获取数据节点附件 */
    getEvidenceAttachment(evidenceNodeId) {
      const loading = this.loadingView({ background: "rgba(0, 0, 0, 0)" });
      evidenceAttachment(evidenceNodeId)
        .then((response) => {
          loading.close();
          this.dataFiles = [];
          this.attachments = [];
          const data = response.data || [];
          data.map((file) => {
            if (file.bizType === "0") {
              this.dataFiles.push(file);
            }
            if (file.bizType === "1") {
              this.attachments.push(file);
            }
          });
        })
        .catch(() => {
          loading.close();
        });
    },

    /** 最近一次溯源信息 */
    getLastVerifyInfo() {
      lastVerifyInfo(this.originNodeId).then((response) => {
        this.lastTraceInfo = response.data;
      });
    },

    /** 获取服务地址 */
    getServer() {
      this.getConfigKey("edg.file.server").then((response) => {
        if (response.code === 200) {
          // this.fileServer = response.msg;
          this.fileServer = 'http://10.112.56.65:3080'
          console.log("---------------"+this.fileServer+"---------------")
        }
      });
      this.getConfigKey("edg.file.server").then((response) => {
        if (response.code === 200) {
          this.previewServer = 'http://10.112.56.65:3080';
        }
      });
      // this.fileServer = "10.112.57.239:8082";
      // this.previewServer = "10.112.57.239:8082";
    },

    handleFile(row, id) {
      this.currentAttachment = row;
      this.currentAttachmentId = id;
      /** 如果是json、txt等文本类型 获取内容预览 */
      const txt_type_list = ["json", /** "txt", */ "md"];
      if (txt_type_list.indexOf(row.fileType) > -1) {
        this.ifTxtFile = true;
        this.fileContent = "请稍后...";
        request({
          url: encodeURI(this.fileServer + row.filePath),
          method: "get",
        })
          .then((res) => {
            this.fileContent = res || "未知错误";
          })
          .catch(() => {
            this.fileContent = "未知错误";
          });

        console.log(encodeURI(this.fileServer + row.filePath))
      } else {
        this.ifTxtFile = false;
        let filePath = row.filePath;
        this.previewUrl =
          this.previewServer +
          "/onlinePreview?url=" +
          encodeURIComponent(this.fileServer + filePath);

        console.log(encodeURIComponent(this.fileServer + filePath))
      }
    },

    /** 溯源 */
    handleValid() {
      this.progressVisable = true;
      let interval = setInterval(() => {
        this.progressValue += 3;
        if (this.progressValue >= 70) {
          clearInterval(interval);
        }
      }, 90);
      const before = new Date();
      evidenceNodeValid(this.evidenceNodeId)
        .then((response) => {
          const after = new Date();
          if (after - before < 3000) {
            // 延迟
            setTimeout(() => {
              this.progressValue = 100;
              setTimeout(() => {
                this.progressVisable = false;
                this.progressValue = 0;
                if (response.code === 200) {
                  const data = response.data;
                  if (response.data.success) {
                    this.$message({
                      message: "溯源无误",
                      type: "success",
                    });
                  } else {
                    this.$message.error(data.err);
                  }
                }
                this.getLastVerifyInfo();
              }, 1000);
            }, 3000 - (after - before));
          } else {
            this.progressValue = 100;
            setTimeout(() => {
              this.progressVisable = false;
              this.progressValue = 0;
            }, 1000);
          }
        })
        .catch(() => {
          this.progressVisable = false;
          this.progressValue = 0;
        });
    },

    drawDagreChart(id, ref) {
      // 已经存在
      if (this.$refs.ref) {
        this.$refs.ref.innerHTML = "";
      }
      let that = this;
      const g6data = this.nodeTree;
      const graph = new G6.TreeGraph({
        container: id,
        width: document.getElementById(id).scrollWidth || 500,
        height: document.getElementById(id).scrollHeight | 300,
        fitCenter: true,
        animate: false,
        modes: {
          default: [
            {
              // type: "collapse-expand", // 折叠性
              onChange: function onChange(item, collapsed) {
                const data = item.get("model").data;
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
            "zoom-canvas",
          ],
        },
        defaultNode: {
          size: 18,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          style: {
            fill: "#99d0ff",
            lineWidth: 0,
          },
        },
        defaultEdge: {
          type: "line",
          style: {
            stroke: "#A3B1BF",
          },
        },

        layout: {
          type: "compactBox",
          direction: "LR",
          getId: function getId(d) {
            return d.id;
          },
          getSize: function getHeight(d) {
            return 12;
          },
          getHeight: function getHeight() {
            return 12;
          },
          getWidth: function getWidth() {
            return 12;
          },
          getVGap: function getVGap() {
            return 28;
          },
          getHGap: function getHGap() {
            return 28;
          },
        },
      });
      // 节点点击事件
      graph.on("node:click", function (evt) {
        const item = evt.item;
        /** 改变边框 */
        for (let idx = 0; idx < that.nodeListData.length; idx++) {
          const id = that.nodeListData[idx].id;
          const item = graph.findById(id);
          const model = item.getModel();
          model.style.lineWidth = id == evt.item._cfg.id ? 2 : 0;
        }
        graph.changeData();
        that.handleNode(evt.item._cfg.id);
      });

      graph.node(function (node) {
        return {
          label: `${node.version}\n${node.operatorName}`,
          labelCfg: {
            offset: that.nodeOffset(node.optType),
            position: "bottom",
            size: 10,
            style: {
              fill: "#e3dcdc",
            },
          },
        };
      });

      graph.data(g6data);
      graph.render();
      graph.fitCenter();
      graph.changeData();

      if (id === "mindContainer") {
        const c_item = graph.findById(that.originNodeId);
        graph.focusItem(c_item, true, {
          easing: "easeCubic",
          duration: 0,
        });

        that.mindChart = graph;
      }
    },

    /** 文件下载 */
    handleDownload() {
      let filePath = this.currentAttachment.filePath;
      let domin = this.fileServer;
      try {
        this.downloadLoading = true;
        setTimeout(() => {
          this.downloadLoading = false;
        }, 2000);
        downloadFile(
          [`${this.fileServer}${this.currentAttachment.filePath}`],
          this.currentAttachment.fileName.split(".")[0]
        );
      } catch (error) {
        this.$message.error("下载出错");
      }
    },

    /** 下载区块全部文件 */
    handleDownloadBlockFile() {
      let filePath = this.dataFiles.length
        ? `${this.fileServer}${this.dataFiles[0].filePath}`
        : "";
      let attachmentsFilePath = [];
      this.attachments.map((item) => {
        attachmentsFilePath.push(`${this.fileServer}${item.filePath}`);
      });
      const { operatorName, version } = this.currentNode;
      let zip_name = `区块文件_${operatorName}_${version}`;
      this.downloadAllLoading = true;
      setTimeout(() => {
        this.downloadAllLoading = false;
      }, 2000);
      downloadFile([filePath, ...attachmentsFilePath], zip_name);
    },

    /** 点击节点 */
    handleNode(evt) {
      const nodeId = evt;
      for (let index = 0; index < this.nodeListData.length; index++) {
        const node = this.nodeListData[index];
        if (node.id === nodeId) {
          this.currentNode = node;
        }
      }
      this.currentAttachmentId = nodeId;
      this.getEvidenceAttachment(nodeId);
    },

    /** 重置脑图 */
    handleResetChart() {
      if (this.mindChart) {
        this.mindChart.fitCenter();
        const c_item = this.mindChart.findById(this.currentNode.id);
        this.mindChart.focusItem(c_item, true, {
          easing: "easeCubic",
          duration: 0,
        });
      }
    },

    /** 放大 */
    handleEnlarge() {
      let chart = this.mindChart;
      chart.zoom(1.1);
    },

    /** 缩小 */
    handleReduce() {
      let chart = this.mindChart;
      chart.zoom(0.9);
    },

    /** 全屏 */
    handleFull() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.drawDagreChart("mind-containerAll", "mindAnother");
      });
    },

    /** 点击添加 */
    handleAdd() {
      //重置
      this.reset();
      this.title = "增加";
      this.getFiles();
    },

    /** 点击修改 */
    handleUpdate() {
      //重置
      this.reset();
      this.title = "修改";
      this.getFiles();
    },

    /** 重置表单 */
    reset() {
      this.resetForm("form");
      this.formParams = {
        description: "",
        // attachmentFileList: [],
        //attachmentFileNameList: [],
        model: {},
        //原始文件
        fileList: [],
        //附件
        attachmentFileList: [],
        //原来的附件
        oldAttachmentFileList: [],
      };
    },

    /** 关闭弹窗 */
    handleCancel() {
      this.visable = false;
    },

    /** 弹窗确定操作 */
    handleConfirm() {
      this.formParams;
      const evidenceNodeId = this.formParams.model.id;
      this.$refs.form.validate((vali) => {
        if (vali) {
          if (this.title === "增加") {
            this.add();
          } else {
            this.modify();
          }
        }
      });
    },

    /** 增加数据 */
    add() {
      const evidenceNodeId = this.newestNode.id;
      const description = this.formParams.description;

      let attachments = [];
      const oldCount = this.formParams.oldAttachmentFileList.length;
      const fileList = this.formParams.attachmentFileList;

      // 计算附件hash
      let hash_list = [];
      for (let idx = 0; idx < fileList.length; idx++) {
        const file = fileList[idx];
        hash_list.push(file.hash);
      }
      const attachmentTotalHash = this.md5Hashlist(hash_list);

      if (fileList.length === oldCount) {
        this.$message({
          message: "未上传新文件",
          type: "error",
        });
        return;
      }

      for (let idx = oldCount; idx < fileList.length; idx++) {
        const file = fileList[idx];
        attachments.push({
          fileName: file.name,
          hash: file.hash,
          size: file.size,
          uri: file.uri,
        });
      }

      const data = {
        evidenceNodeId: evidenceNodeId,
        attachmentTotalHash: attachmentTotalHash,
        description: description,
        attachments: attachments,
      };

      const loading = this.loadingView({ text: "上链中..." });
      this.visable = false;
      addEvidence(data)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.reload();
            this.$message({
              message: "操作成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    /** 修改数据 */
    modify() {
      const evidenceNodeId = this.formParams.model.id;
      const description = this.formParams.description;

      const file = this.formParams.fileList[0];

      let dataFile = {
        fileName: file.name,
        hash: file.hash,
        size: file.size,
        uri: file.uri,
      };

      let attachments = [];
      const fileList = this.formParams.attachmentFileList;

      // 计算附件hash
      let hash_list = [];
      for (let idx = 0; idx < fileList.length; idx++) {
        const file = fileList[idx];
        hash_list.push(file.hash);
      }
      const attachmentTotalHash = this.md5Hashlist(hash_list);

      // 没有修改文件
      if (
        this.currentNode.fileHash === file.hash &&
        attachmentTotalHash === this.currentNode.attachmentTotalHash
      ) {
        this.$message({
          message: "没有文件修改",
          type: "error",
        });
        return;
      }

      for (let idx = 0; idx < fileList.length; idx++) {
        const file = fileList[idx];
        attachments.push({
          fileName: file.name,
          hash: file.hash,
          size: file.size,
          uri: file.uri,
        });
      }

      const data = {
        evidenceNodeId: evidenceNodeId,
        description: description,
        attachments: attachments,
        attachmentTotalHash: attachmentTotalHash,
        dataFile: dataFile,
      };

      const loading = this.loadingView({ text: "上链中..." });
      this.visable = false;
      modifyEvidence(data)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.reload();
            this.$message({
              message: "操作成功",
              type: "success",
            });
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    /** 获取对应文件 */
    getFiles() {
      const { newestNode } = this;
      evidenceFiles(newestNode.id).then((response) => {
        let model = newestNode;
        model.fileName = this.fileName;
        const dataFile = response.data.dataFile || {};
        const attachments = response.data.attachments || [];

        let fileList = [
          {
            name: dataFile.fileName,
            uri: dataFile.uri,
            hash: dataFile.hash,
            size: dataFile.size,
          },
        ];

        let attachFileList = [];
        attachments.map((item) => {
          attachFileList.push({
            name: item.fileName,
            uri: item.uri,
            hash: item.hash,
            size: item.size,
          });
        });

        this.formParams.model = model;
        // 数据类型 数据名称
        this.formParams.model.evidenceTypeName = this.evidenceTypeName;
        this.formParams.model.fileName = this.fileName;

        this.formParams.description = newestNode.description;
        this.formParams.fileList = fileList;
        this.formParams.attachmentFileList = attachFileList;
        this.formParams.oldAttachmentFileList = JSON.parse(
          JSON.stringify(attachFileList)
        );
        this.visable = true;
      });
    },

    //上传原始文件之前
    handleBeforeUpload(file) {
      return true;
    },

    //上传原始文件超出
    handleExceed(files, fileList) {
      this.$message.error(`只能上传 1 个文件`);
    },

    //删除原始文件
    beforeRemove(file, fileList) {
      this.formParams.fileList = [];
      return true;
    },

    /** 上传文件原始数据 */
    uploadDataFile(event) {
      const file = event.file;
      const type = this.formParams.model.evidenceTypeName || "未知类型";
      let formData = new window.FormData();
      formData.append("file", file);
      formData.append("scene", type);
      formData.append("output", "json");
      let loading = this.loadingView({ background: "rgba(0, 0, 0, 0)" });
      uploadFile(formData)
        .then((response) => {
          loading.close();
          if (response.path && response.path.length > 0) {
            const name = file.name || "未知文件";
            const path = response.path || "未知路径";
            const hash = response.md5 || "未知hash";
            const size = response.size || 0;
            const theFile = {
              name: name,
              uri: path,
              hash: hash,
              size: size,
            };
            this.formParams.fileList.push(theFile);
          } else {
            this.$message.error("文件上传失败");
          }
        })
        .catch((error) => {
          loading.close();
        });
    },

    //上传附件之前
    handleBeforeUploadAttachment(file) {
      let can = true;
      let fileList = this.formParams.attachmentFileList;
      for (let idx = 0; idx < fileList.length; idx++) {
        const theFile = fileList[idx];
        if (file.name === theFile.name && file.size === theFile.size) {
          can = false;
          this.$message.error(`此文件已存在`);
          break;
        }
      }
      return can;
    },

    //删除附件
    beforeRemoveAttachment(file, fileList) {
      if (this.title === "增加") {
        let isOld = false;
        this.formParams.oldAttachmentFileList.map((item) => {
          if (file.name === item.name && file.hash === item.hash) {
            isOld = true;
          }
        });
        if (isOld) {
          this.$message.error("不可移除之前的文件");
          return false;
        } else {
          this.formParams.attachmentFileList = fileList;
          return true;
        }
      } else {
        this.formParams.attachmentFileList = fileList;
        return true;
      }
    },

    /** 上传附件 */
    uploadAttachmentFile(event) {
      const file = event.file;
      const type = this.formParams.model.evidenceTypeName || "未知类型";
      let formData = new window.FormData();
      formData.append("file", file);
      formData.append("scene", type);
      formData.append("output", "json");
      let loading = this.loadingView({ background: "rgba(0, 0, 0, 0)" });
      uploadFile(formData)
        .then((response) => {
          loading.close();
          if (response.path && response.path.length > 0) {
            const name = file.name || "未知文件";
            const path = response.path || "未知路径";
            const hash = response.md5 || "未知hash";
            const size = response.size || 0;
            const theFile = {
              name: name,
              uri: path,
              hash: hash,
              size: size,
            };
            this.formParams.attachmentFileList.push(theFile);
          } else {
            this.$message.error("文件上传失败");
          }
        })
        .catch((error) => {
          loading.close();
        });
    },
  },
};
</script>

<style>
.row {
  color: #ffffff;
}

.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  text-align: left;
  margin-top: 120px;
  z-index: 999;
  pointer-events: none;
}

.customWidth {
  width: 90%;
  height: 90%;
  margin: 5%;
  padding: 0;
}

.el-dialog__header {
  height: 5%;
}

.el-dialog__body {
  padding: 10px 20px;
}

.app-container {
  background-color: #001233;
}

.el-table__header {
  padding: 0 !important;
}

.el-table__body {
  padding: 0 !important;
}
</style>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style lang="scss" scoped>
.previous-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 16px 0;
  .tip-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 24px;

    .tipinfo {
      padding: 5px;
      margin: 5px;

      img {
        margin-right: 5px;
        height: 20px;
        width: 20px;
      }
    }
  }
}

.previous-container .text {
  margin-left: 10px;
}

.traceability-progress {
  height: 16px;
  width: 220px;
  margin-bottom: 8px;
  border-radius: 5px;
}

.traceability-text {
  margin-left: 10px;
}

.content-page {
  display: flex;
  flex-direction: column;
  width: 100%;

  .page-top {
    height: 320px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .mind-container-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      border: 1px solid #07dbff;
      height: 320px;
      box-sizing: border-box;
      //width: 660px;
      width: 100%;
      min-width: 660px;
      position: relative;

      #mindContainer {
        box-sizing: border-box;
        height: 320px;
        //width: 660px;
        width: 100%;
        min-width: 570px;
        overflow: hidden;
      }

      #mind-containerAll {
        width: 100%;
        height: calc(100%);
        overflow: hidden;
      }

      .topDemo {
        position: absolute;
        width: max-content;
        border: solid 1px #07dbff;

        h4 {
          margin: 5px 0 0 10px;
        }

        .node-info {
          padding: 10px;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .textDec {
        display: inline-block;
        width: 121px;
        text-align-last: justify;
        text-align: justify;
        text-justify: distribute-all-lines;
      }

      .message {
        width: auto;
        margin: 4px;
        padding-top: 4px;
        color: #ffffff;
      }

      .message-blod {
        color: #07dbff;
        font-weight: 600;
      }

      .btn-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        position: absolute;
        top: 10px;
        left: 0;
        margin-left: 15px;
      }
    }
    .node-describe-container {
      border: solid 1px #07dbff;
      padding: 16px;
      margin: 0 0 0 16px;
      width: 100%;
      color: #ffffff;

      .node-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        i {
          margin-right: 5px;
        }

        .textDec {
          display: inline-block;
          width: 121px;
          text-align-last: justify;
          text-align: justify;
          text-justify: distribute-all-lines;
        }

        .message {
          width: auto;
          margin: 4px;
          padding-top: 4px;
          color: #ffffff;
        }

        .message-blod {
          color: #07dbff;
          font-weight: 600;
        }
      }

      .opt-container {
        margin: 5px 0 0 0;
        display: flex;
        flex-direction: row;
      }
    }
  }

  .page-bot {
    margin: 16px 0 0 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: solid 1px #07dbff;

    .file-container {
      width: 220px;
      height: calc(100vh - 320px);
      min-height: 800px;
      border-right: solid 1px #07dbff;
    }
    .imgPreviewContainer {
      width: 100%;
      height: calc(100vh - 320px);
      min-height: 800px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 32px 32px 32px;
      .file-wrapper {
        height: 100%;
        width: 100%;
        background-color: #FFFFFF;
        color: #333333;
        .preview-txt-container {
          border: solid 1px #07dbff;
          height: 100%;
          width: 100%;
          padding: 16px;
          color: #333333;
        }
        .preview-iframe {
          display: block;
          padding: 16px 16px 0 16px;
          border: none;
        }
      }
    }
  }
}

.dialog {
  width: 1200px;
  margin: auto;
}
</style>
