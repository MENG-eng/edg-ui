<template>
  <div class="app-container">
    <div class="allBackColor">
      <div class="row between">
        <div class="table-tabInfo">文件名：{{ evidenceData.fileName }}</div>
        <div v-hasPermi="['edg:evidence:verify']" class="row-between">
          <div>
            <div v-if="progressVisable" class="row">
              <div style="margin-right: 12px; color: #ffffff">溯源中...</div>
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
                <div class="traceability-text">
                  时间：{{ lastTraceInfo.date }}
                </div>
                <div class="traceability-text">
                  节点数量：{{ lastTraceInfo.nodeCount }}
                </div>
                <div class="traceability-text">
                  操作人：{{ lastTraceInfo.operatorName }}
                </div>
                <div class="row">
                  <div class="traceability-text">结果：</div>
                  <div
                    :style="{
                      color:
                        lastTraceInfo.success === true ? '#7ed321' : '#d02d02',
                    }"
                  >
                    {{
                      lastTraceInfo.success === true ? "溯源无误" : "溯源异常"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-button
            class="traceability-btn"
            type="primary"
            @click="handleValid"
            :disabled="progressVisable"
            >溯源
          </el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="p-container">
        <div class="infoTip">
          数据类型：<span class="infoFollow">{{
            evidenceData.evidenceTypeName
          }}</span>
        </div>
        <span class="m10">|</span>
        <div class="infoTip">
          创建时间：<span class="infoFollow">{{
            evidenceData.createTime
          }}</span>
        </div>
        <span class="m10">|</span>
        <div class="infoTip">
          创建者：<span class="infoFollow">{{ evidenceData.createBy }}</span>
        </div>
        <span class="m10">|</span>
        <div class="infoTip">
          文件描述：<span class="infoFollow">{{
            evidenceData.description
          }}</span>
        </div>
      </div>
    </div>
    <div class="allBackColor-first">
      <div class="row" :style="{ marginTop: '12px' }">
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
      <div class="chart-container">
        <div class="mind-container-wrapper">
          <div id="mind-container" ref="mind"></div>
          <el-dialog
            title=""
            :visible.sync="dialogVisible"
            @close="handleCancle"
          >
            <div class="topDemo">
              <div v-show="nodeInfo" class="node-info">
                <div class="row">
                  <div class="message-blod">
                    文件版本：{{ nodeInfo.version || "" }}
                  </div>
                  <span class="m10">|</span>
                  <div class="message-blod">
                    所在区块号：{{ nodeInfo.blockHeight }}
                  </div>
                  <span class="m10">|</span>
                  <div class="message-blod">
                    操作类型：{{ handleOptType(nodeInfo.optType) }}
                  </div>
                </div>
                <div class="row">
                  <div class="textDec">操作人</div>
                  <div>：</div>
                  <div class="message">{{ nodeInfo.operatorName || "" }}</div>
                </div>
                <div class="row">
                  <div class="textDec">操作时间</div>
                  <div>：</div>
                  <div class="message">{{ nodeInfo.createTime || "" }}</div>
                </div>
                <div class="row">
                  <div class="textDec">操作描述</div>
                  <div>：</div>
                  <div class="message">{{ nodeInfo.description || "" }}</div>
                </div>
                <div class="row">
                  <div class="row">
                    <div class="textDec">
                      链上交易码
                      <el-tooltip effect="light" placement="top-start">
                        <div slot="content">
                          链上交易码：<br />区块链由区块链接形成，区块由多<br />笔交易构成，每笔交易都拥有自己<br />唯一的交易码，交易码存储在区块<br />中不可被篡改。
                        </div>
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </div>
                    <div>：</div>
                  </div>
                  <div class="message">{{ nodeInfo.txid }}</div>
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
                  <div class="message">{{ nodeInfo.fileHash || "" }}</div>
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
                    {{ nodeInfo.attachmentTotalHash || "无" }}
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
                  <div class="message">{{ nodeInfo.blockHash || "" }}</div>
                </div>
              </div>
            </div>
            <div id="mind-containerAll" ref="mindContainerAll"></div>
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
        <div class="info-container">
          <div class="row-copy">
            <el-button
              v-hasPermi="['edg:evidence:copy']"
              type="primary"
              @click="copy"
              :disabled="handleOptType(nodeInfo.optType) === '复制'"
              >复制
            </el-button>
          </div>
          <div v-show="nodeInfo" class="node-info">
            <div class="row">
              <div class="message-blod">
                文件版本：{{ nodeInfo.version || "" }}
              </div>
              <span class="m10">|</span>
              <div class="message-blod">
                所在区块号：{{ nodeInfo.blockHeight }}
              </div>
              <span class="m10">|</span>
              <div class="message-blod">
                操作类型：{{ handleOptType(nodeInfo.optType) }}
              </div>
            </div>
            <div class="row">
              <div class="textDec">操作人</div>
              <div>：</div>
              <div class="message">{{ nodeInfo.operatorName || "" }}</div>
            </div>
            <div class="row">
              <div class="textDec">操作时间</div>
              <div>：</div>
              <div class="message">{{ nodeInfo.createTime || "" }}</div>
            </div>
            <div class="row">
              <div class="textDec">操作描述</div>
              <div>：</div>
              <div class="message">{{ nodeInfo.description || "" }}</div>
            </div>
            <div class="row">
              <div class="textDec">
                链上交易码
                <el-tooltip effect="light" placement="top-start">
                  <div slot="content">
                    链上交易码：<br />区块链由区块链接形成，区块由多<br />笔交易构成，每笔交易都拥有自己<br />唯一的交易码，交易码存储在区块<br />中不可被篡改。
                  </div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </div>
              <div>：</div>
              <div class="message">{{ nodeInfo.txid }}</div>
            </div>
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
              <div class="message">{{ nodeInfo.fileHash || "" }}</div>
            </div>
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
              <div class="message">
                {{ nodeInfo.attachmentTotalHash || "无" }}
              </div>
            </div>
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
              <div class="message">{{ nodeInfo.blockHash || "" }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="allBackColor">
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
            :style="{ width: '100%', marginBottom: '16px', color: '#FFFFFF' }"
          >
            <div>
              {{ (currentAttachment && currentAttachment.fileName) || "" }}
            </div>
            <div>文件内容预览</div>
            <div class="row">
              <el-button
                size="mini"
                type="primary"
                @click="handleDownload"
                :loading="downloadLoading"
                >下载
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDownloadBlockFile"
                :loading="downloadAllLoading"
                >下载区块全部文件
              </el-button>
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
  </div>
</template>
<script>
import {
  /** 管理员数据详情 */
  listAdminEvidenceDetail,

  /** 数据详情 */
  listEvidenceDetail,

  /** 数据溯源 */
  evidenceVerify,

  /** 复制数据 */
  evidenceCopy,
} from "@/api/edg/evidenceDetail";
import {
  /** @api 获取节点所有附件 */
  evidenceAttachment,
} from "../../../api/edg/evidence";
import { downloadFile } from "../content/zip-download";
import G6 from "@antv/g6";
import request from "../../../utils/request";
import { file_api } from '../../../settings'

export default {
  inject: ["reload"],
  data() {
    return {
      // 是否满屏显示
      dialogVisible: false,

      /** 数据id */
      evidenceId: null,

      /** 溯源页 */
      isTrace: false,

      /** table加载组件 */
      loading: false,

      /** 进度条可见 */
      progressVisable: false,

      /** 进度条进度 */
      progressValue: 0,

      /** 节点列表 */
      nodeList: [],

      /** 数据数据 */
      evidenceData: {},

      /** 上次溯源信息 */
      lastTraceInfo: null,

      /** 节点树 */
      nodeTree: {},

      /** 当前节点信息 */
      nodeInfo: {},

      /** 脑图 */
      mindChart: null,

      /**  通过文件验证进来的fileHash 当前为文件验证页面 */
      fileHash: null,

      /** 是否为管理员溯源 */
      isAdmin: false,

      /** 描原始文件 */
      dataFiles: [],

      /** 附件 */
      attachments: [],

      /** 当前文件 */
      currentAttachment: null,

      /** 当前文件id */
      currentAttachmentId: null,

      /** 是否是文档文件 */
      ifTxtFile: false,

      /** 文件服务器地址 */
      fileServer: null,

      /** 预览服务器地址 */
      previewServer: null,

      /** 文件预览地址 */
      previewUrl: null,

      fileContent: "",

      /** 下载文件 */
      downloadLoading: false,

      /** 下载所有文件 */
      downloadAllLoading: false,
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
    const evidenceId = JSON.parse(this.$route.query.evidenceId);
    this.evidenceId = evidenceId || "";
    /** 当前为文件验证页 */
    this.fileHash = this.$route.query.fileHash
      ? JSON.parse(this.$route.query.fileHash)
      : null;
    /** 当前为溯源页 */
    this.isAdmin = this.$route.query.admin
      ? JSON.parse(this.$route.query.admin)
      : false;

    this.getEvidenceDetail();
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

    /** 获取服务地址 */
    getServer() {
      this.getConfigKey("edg.file.server").then((response) => {
        if (response.code === 200) {
          this.fileServer = 'http://10.112.11.224:3080';
        }
      });
      this.getConfigKey("edg.file.server").then((response) => {
        if (response.code === 200) {
          this.previewServer = 'http://10.112.11.224:3080';
        }
      });
      // this.fileServer = "10.112.57.239:8082";
      // this.previewServer = "10.112.57.239:8082";
    },

    /** 获取数据详情 */
    getEvidenceDetail(tracea) {
      const listAPI = this.isAdmin
        ? listAdminEvidenceDetail
        : listEvidenceDetail;

      listAPI(this.evidenceId).then((response) => {
        /** 如果是溯源操作只刷新溯源数据 */
        if (tracea) {
          this.lastTraceInfo = response.data && response.data.lastTraceInfo;
          return;
        }

        this.evidenceData = (response.data && response.data.evidence) || {};
        this.lastTraceInfo = response.data && response.data.lastTraceInfo;
        let nodes = (response.data && response.data.nodes) || [];

        this.nodeList = nodes;

        // 根节点
        let tree = this.handleTree(nodes, "id", "parentId");
        let nodeInfo = tree.length ? tree[0] : null;
        this.nodeInfo = nodeInfo;

        // 处理节点树
        for (let idx = 0; idx < nodes.length; idx++) {
          let item = nodes[idx];
          item.type = this.nodeShape(item.optType);
          item.size = this.nodeSize(item.optType);
          item.style = {
            fill: item.id === nodeInfo.id ? "#5B8FF9" : "#C6E5FF",
          };
          if (this.fileHash) {
            item.style.lineWidth = item.fileHash === this.fileHash ? 2 : 0;
          }
        }
        let nodeTree = this.handleTree(nodes, "id", "parentId");
        this.nodeTree = nodeTree.length > 0 ? nodeTree[0] : {};
        this.nodeInfo = this.nodeTree;

        // 画溯源图
        this.drawMindChart("mind-container", "mind");
        /** 默认选中最后一个 */
        this.$nextTick(() => {
          this.handleNode(parseInt(this.nodeInfo.id));
        });
      });
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
      const evidenceId = JSON.parse(this.$route.query.evidenceId || "");

      evidenceVerify(evidenceId)
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
                this.getEvidenceDetail(true);
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

    /** 绘制脑图 */
    drawMindChart(containerId, containerRef) {
      if (this.$refs[containerRef]) {
        this.$refs[containerRef].innerHTML = "";
      }
      var that = this;

      const g6data = this.nodeTree;
      const width = document.getElementById(containerId).scrollWidth || 500;
      const height = document.getElementById(containerId).scrollHeight || 400;
      const graph = new G6.TreeGraph({
        container: containerId,
        width,
        height,
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
          size: 16,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
          style: {
            fill: "#C6E5FF",
            stroke: "#5B8FF9",
            lineWidth: 0,
          },
        },
        defaultEdge: {
          type: "line",
          style: {
            stroke: "#7FA7E1",
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
      // 点击节点获取当前数据信息
      graph.on("node:click", function (evt) {
        const item = evt.item;
        /** 改变颜色 */
        for (let idx = 0; idx < that.nodeList.length; idx++) {
          const id = that.nodeList[idx].id;
          const item = graph.findById(id);
          const model = item.getModel();
          model.style.fill = id == evt.item._cfg.id ? "#5B8FF9" : "#C6E5FF";
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

      if (containerId === "mind-container") {
        const c_item = graph.findById(that.nodeInfo.id);
        graph.focusItem(c_item, true, {
          easing: "easeCubic",
          duration: 0,
        });
      }

      that.mindChart = graph;
    },

    /** 点击节点 */
    handleNode(id) {
      let nodes = this.nodeList;
      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (node.id === id) {
          this.nodeInfo = node;
        }
      }

      this.currentAttachmentId = id;
      this.getEvidenceAttachment(id);
    },

    /** 重置脑图 */
    handleResetChart() {
      if (this.mindChart) {
        this.mindChart.fitCenter();
        const c_item = this.mindChart.findById(this.nodeInfo.id);
        this.mindChart.focusItem(c_item, true, {
          easing: "easeCubic",
          duration: 0,
        });
      }
    },

    /** 放大 */
    handleEnlarge() {
      const chart = this.mindChart;
      chart.zoom(1.1);
    },

    /** 缩小 */
    handleReduce() {
      const chart = this.mindChart;
      chart.zoom(0.9);
    },

    /** 全屏 */
    handleFull() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.drawMindChart("mind-containerAll", "mindContainerAll");
      });
    },

    // 复制
    copy() {
      let copyInfo = this.nodeInfo;
      let that = this;
      // 选中的节点Id
      let copyNodeid = copyInfo.id;
      let loading = that.loadingView();
      this.$confirm(
        '是否确认复制版本号为"' + copyInfo.version + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return evidenceCopy(copyNodeid);
        })
        .then((response) => {
          if (response != "") {
            this.getEvidenceDetail();
            this.msgSuccess("复制成功");
          }
          loading.close();
        })
        .catch(function () {
          loading.close();
        });
    },

    // /** 获取数据节点附件 */
    getEvidenceAttachment(evidenceNodeId) {
      evidenceAttachment(evidenceNodeId)
        .then((response) => {
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
        .catch(() => {});
    },

    handleFile(row, id) {
      this.currentAttachment = row;
      this.currentAttachmentId = id;
      /** 如果是json、txt等文本类型 获取内容预览 */
      const txt_type_list = ["json", /* "txt", */ "md"];
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
      } else {
        this.ifTxtFile = false;
        let filePath = row.filePath;
        this.previewUrl =
          this.previewServer +
          "/onlinePreview?url=" +
          encodeURIComponent(this.fileServer + filePath);
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
      const { operatorName, version } = this.nodeInfo;
      let zip_name = `区块文件_${operatorName}_${version}`;
      this.downloadAllLoading = true;
      setTimeout(() => {
        this.downloadAllLoading = false;
      }, 2000);
      downloadFile([filePath, ...attachmentsFilePath], zip_name);
    },
  },
};
</script>

<style lang="scss">
.row {
  color: #ffffff;
}

.el-dialog {
  width: 90%;
  height: 90%;
  margin: 5%;
  padding: 0;

  .el-dialog__header {
    height: 5%;
  }

  .el-dialog__body {
    // height: 95%;
    padding: 10px 20px;
  }
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
<style lang="scss" scoped>
.allBackColor {
  background-color: #07224a;
  padding: 15px 0;
}

.allBackColor-first {
  background-color: #07224a;
  margin: 20px 0;
}

.row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
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

.traceability-btn {
  margin-left: 10px;
}

.infoTip {
  color: #ffffff;
}

.infoFollow {
  color: #07dbff;
}

.p-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 15px;
}

.tipinfo {
  padding: 5px;
  margin: 5px;
  color: #ffffff;
}

.tipinfo img {
  margin-right: 5px;
  height: 20px;
  width: 20px;
}

.chart-container {
  margin: 12px 0;
  height: 320px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.mind-container-wrapper {
  position: relative;
  width: 48%;
  height: 100%;
  overflow: hidden;
  padding: 8px;
}

#mind-container {
  width: 100%;
  height: 100%;
  border: solid 1px #07dbff;
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

  .node-info {
    padding: 10px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffffff;
  }
}

.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: absolute;
  top: 10px;
  margin-left: 15px;
}

.normal-btn {
  height: 32px;
}

.info-container {
  height: 100%;
  width: 52%;
  margin: auto;
  position: relative;
  padding: 8px;

  .node-info {
    padding: 10px;
    border: solid 1px #07dbff;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffffff;
  }
}

.info-container .info {
  margin: 0px;
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

.textDec {
  width: 120px;
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 15px 0;
}

.row-copy {
  position: absolute;
  top: 24px;
  right: 22%;
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
      background-color: #ffffff;
      color: #333333;

      .preview-txt-container {
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
</style>
