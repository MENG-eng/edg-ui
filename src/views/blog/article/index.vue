<template>
  <div class="article-page">
    <div class="blog-container">
      <div class="row-top">
        <div class="blog-logo">能源数据共享博客</div>
      </div>
      <div class="article-container">
        <div class="nav-bar">
          <div class="path">{{ article.deptName || "路径" }}</div>
        </div>
        <div class="caption">{{ article.title }}</div>
        <div class="tip-container">
          <div class="tip">发布时间 {{ article.createTime }}</div>
          <div class="tip">浏览次数 {{ article.viewCount }}</div>
          <div class="tip">引用次数 {{ article.heat || 0 }}</div>
        </div>
        <div class="row between w100">
          <div class="tag-container">
            <div v-for="tag in article.tagNames" :key="tag">
              <div class="tag">{{ tag }}</div>
            </div>
          </div>
          <div>{{ article.author }}</div>
        </div>
        <div class="overview">概述:</div>
        <div class="overview">{{ article.content }}</div>
        <div class="attribute-container">
          <div class="attribute">
            数据名称：{{ article.evidenceName || "未知" }}
          </div>
          <div class="attribute">
            数据类型：{{ article.evidenceTypeName || "未知" }}
          </div>
          <div class="attribute">
            上链时间：{{ article.recentTime || "未知" }}
          </div>
        </div>
        <h4>数据升级预览</h4>
        <div style="margin: 5px 0">
          <span class="tipinfo">
            <img src="../../../assets/image/circle.png" />原始文件
          </span>
          <span class="tipinfo">
            <img src="../../../assets/image/triangle.png" />复制操作
          </span>
          <span class="tipinfo">
            <img src="../../../assets/image/star.png" />修改操作
          </span>
          <span class="tipinfo">
            <img src="../../../assets/image/rect.png" />增加操作
          </span>
        </div>
        <div id="mind-container" ref="mind"></div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { articleContent } from "../../../api/blog/article";
export default {
  data() {
    return {
      article: {},
      tree: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.drawMindChart();
    // });
    this.getCmsCategory();
    this.getArticleContent();
  },
  methods: {
    /** 获取文章内容 */
    getArticleContent() {
      articleContent(this.$route.params.id || "2020").then((response) => {
        const data = response.data || {};
        this.article = data;
        this.article.recentTime = data.evidenceNodeList[0].createTime; // 上链时间
        this.article.tagNames = data.tagNames.split(",");

        let evidenceNodeList = data.evidenceNodeList;
        // evidenceNodeList.map((item) => {
        //   evidenceNodeList.type = this.getShape(item.optType);
        // });
        for (let idx = 0; idx < evidenceNodeList.length; idx++) {
          let item = evidenceNodeList[idx];
          item.type = this.nodeShape(item.optType);
          item.size = this.nodeSize(item.optType);
        }
        let nodeTree = this.handleTree(evidenceNodeList, "id", "parentId");

        this.tree = nodeTree.length > 0 ? nodeTree[0] : {};
        this.drawMindChart();
      });
    },

    /** 绘制脑图 */
    drawMindChart() {
      var that = this;
      this.$refs.mind.innerHTML = "";
      const g6data = this.tree;

      const width =
        document.getElementById("mind-container").scrollWidth || 780;
      const height =
        document.getElementById("mind-container").scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: "mind-container",
        width,
        height,
        modes: {
          default: [
            {
              // type: "collapse-expand", // 折叠性
              // onChange: function onChange(item, collapsed) {
              //   const data = item.get("model").data;
              //   data.collapsed = collapsed;
              //   return true;
              // },
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
            fill: "#C6E5FF",
            stroke: "#5B8FF9",
            lineWidth: 2,
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
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 28;
          },
          getHGap: function getHGap() {
            return 28;
          },
        },
      });

      graph.node(function (node) {
        return {
          label: `${node.version}\n${node.operatorName}`,
          labelCfg: {
            offset: that.nodeOffset(node.optType),
            position: "bottom",
          },
        };
      });

      graph.data(g6data);
      graph.render();
      graph.fitCenter();
    },
    /** 获取栏目 */
    getCmsCategory() {
      this.category = ["其他", "咨询", "测试"];
    },
  },
};
</script>

<style lang="scss" scoped>
.article-page {
  width: 100%;
  text-align: center;
  background-size: cover;
  top: 0px;
  bottom: 0px;
  background-image: url(../../../assets/image/bg-blog.png);
  flex-direction: column;
  min-width: 1400px;
  min-height: 100%;
  height: 100%;
  overflow: auto;
}

.blog-container {
  margin: auto;
  width: 100%;
  height: 100%;
  padding: 0 18%;
}

.row-top {
  height: 210px;
  width: 800px;
  margin: auto;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.blog-logo {
  font-size: 32px;
  color: #fff;
  font-weight: 600;
}

.article-container {
  margin: auto;
  width: 800px;
  padding: 0 32px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 5px;
}

.nav-bar {
  height: 44px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.path {
  font-size: 14px;
  color: #999999;
  font-weight: bold;
}

.caption {
  font-size: 24px;
  color: #454545;
  font-weight: bold;
  margin: 8px 0 20px 0;
  cursor: pointer;
}

.tip-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: rgba(6, 39, 88, 0.8);
  width: 100%;
  height: 25px;
  line-height: 25px;
  margin-bottom: 10px;
}

.tip-container .tip {
  font-size: 12px;
  color: #ffffff;
  margin-right: 8px;
}

.tag-container {
  display: flex;
  flex-direction: row;
}

.tag {
  height: 26px;
  line-height: 12px;
  font-size: 12px;
  background-color: rgba(6, 39, 88, 0.8);
  padding: 8px;
  margin-right: 4px;
  color: #fff;
}

.overview {
  margin-top: 24px;
  font-size: 14px;
  line-height: 24px;
  color: #454545;
  overflow: hidden;
  width: 100%;
  text-align: left;
  // text-indent: 24px;
}

.attribute-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 10px;
}

.attribute {
  font-size: 14px;
  margin: 20px 0 0 0;
  border-bottom: #eee solid 1px;
  width: 100%;
}

.tipinfo {
  padding: 5px;
  margin: 5px;
}

.tipinfo img {
  margin-right: 5px;
  height: 20px;
  width: 20px;
}

#mind-container {
  margin: 24px;
  border: #ccc solid 1px;
}
</style>