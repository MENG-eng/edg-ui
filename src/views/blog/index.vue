<template>
  <div class="blog-page">
    <div class="blog-container">
      <div class="nav-bar">
        <div class="row">
          <div class="organization">{{ articleParams.deptName }}</div>
          <el-dropdown trigger="click" @command="handleSelectOrganization">
            <div class="organization point">[切换]</div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in deptList"
                :key="item.id"
                :command="index"
                >{{ item.deptName }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <div :style="{ width: '16px' }"></div>
          <!-- <div class="organization point" @click="handleLogin">登录后台</div> -->
        </div>
      </div>
      <div class="top-logoInfo">
        <div class="blog-logo">能源数据共享博客</div>
      </div>
      <div class="tab-container-wrapper">
        <div class="tab-container">
          <el-menu
            :default-active="activeIndex"
            class="el-menu"
            active-text-color="#1791ff"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item
              v-for="(item, idx) in evidenceTypes"
              :key="item.id"
              :index="`${idx}`"
              >{{ item.name }}</el-menu-item
            >
          </el-menu>
        </div>
        <div>
          <el-input
            class="search-input"
            v-model="articleParams.keywords"
            placeholder="请输入搜索内容"
            @keyup.enter.native="handleSearch"
            clearable
          >
          </el-input>
          <el-button
            icon="el-icon-search"
            @click.native="handleSearch"
          ></el-button>
        </div>
      </div>

      <div class="body-container">
        <div class="body-left-container">
          <div id="notice-container">
            <div
              v-for="(notice, idx) in noticeList"
              :key="notice.noticeId"
              class="notice"
              :style="{ top: `${(idx - noticeIdx) * 30}px` }"
            >
              {{ (notice && notice.noticeTitle) || "暂无通知" }}
            </div>
          </div>

          <div v-if="rotation.length > 0" class="carousel-container">
            <el-carousel :interval="5000">
              <el-carousel-item
                v-for="(item, index) in rotation"
                :key="item.rotationId"
              >
                <img
                  class="carousel-img"
                  :src="item.rotationUrl"
                  @click="handleCarousel(index)"
                  alt
                />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="article-border-container">
            <div class="article-ategory">最新文章</div>
            <div style="width: 100%">
              <div v-if="visableArticleList.length <= 0" class="article-none">
                暂无内容
              </div>
              <div v-else>
                <div
                  v-for="(article, idx) in visableArticleList"
                  :key="article.articleId"
                >
                  <div class="article-container">
                    <div class="row through">
                      <div v-for="tag in article.tagsList" :key="tag">
                        <div class="tag" :style="{ background: colors[idx] }">
                          #{{ tag }}
                        </div>
                      </div>
                      <div class="caption" @click="handleCaption(article)">
                        {{ article.title }}
                      </div>
                      <span class="info">{{ article.createTime }}</span>
                    </div>
                    <div class="overview">{{ article.content }}</div>
                    <div class="row another">
                      <div class="tip vertical">
                        浏览次数 (<span class="realNum">{{
                          article.viewCount
                        }}</span
                        >)
                      </div>
                      <div class="tip">
                        引用次数 (<span class="realNum">{{ article.heat }}</span
                        >)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="el-page-container">
              <div></div>
              <el-pagination
                background
                layout="prev, pager, next"
                :current-page="currentPage"
                :page-size="5"
                :total="pageCount"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>

        <div class="body-right-container">
          <div style="display: none">
            <div class="block-title">机构介绍</div>
            <div class="block-body">
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">机构名称</div>
                  <div>：</div>
                  <div>{{ deptInfo.deptName }}</div>
                </div>
              </div>
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">负责人</div>
                  <div>：</div>
                  <div>{{ deptInfo.leader }}</div>
                </div>
              </div>
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">联系电话</div>
                  <div>：</div>
                  <div>{{ deptInfo.phone }}</div>
                </div>
              </div>
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">邮箱</div>
                  <div>：</div>
                  <div>{{ deptInfo.email }}</div>
                </div>
              </div>
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">总数据量</div>
                  <div>：</div>
                  <div>{{ deptInfo.params.articleCount || 0 }}笔</div>
                </div>
              </div>
              <div class="archive-text">
                <div class="row">
                  <div class="textDec">总文章数</div>
                  <div>：</div>
                  <div>{{ deptInfo.params.evidenceCount || 0 }}篇</div>
                </div>
              </div>
            </div>
          </div>

          <div class="block-title">日期</div>
          <div class="block-body">
            <div
              :style="{
                width: '300px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
              }"
            >
              <a-calendar
                :fullscreen="false"
                :locale="locale"
                @panelChange="onPanelChange"
                @change="onDateChange"
                class="ant-calender-hide-radio"
              >
                <div slot="dateCellRender" slot-scope="scope" class="dateCell">
                  <div v-if="isDocumentsDate(scope)" class="dateCellBack"></div>
                </div>
              </a-calendar>
            </div>
          </div>

          <div class="block-title">档案</div>
          <div class="block-body">
            <div
              class="archive-text point"
              v-for="item in monthArticle"
              :key="item.dimension"
              :class="`archive-text point${
                item.dimension === articleParams.monthDimension
                  ? ' archive-text-hilight'
                  : ''
              }`"
              @click="handleMonthDimension(item)"
            >
              {{ `${parseTime(item.dimension, "{y}年{m}月")} (${item.nums})` }}
            </div>
          </div>

          <div class="block-title">栏目</div>
          <div class="block-body">
            <div
              v-for="item in category"
              :key="item.dimensionId"
              :class="`archive-text point${
                item.dimensionId === articleParams.dimensionId
                  ? ' archive-text-hilight'
                  : ''
              }`"
              @click="handleCategory(item.dimensionId)"
            >
              {{ `${item.dimension} (${item.nums})` }}
            </div>
          </div>

          <div class="block-title">标签</div>
          <div class="block-body">
            <div class="tags-container">
              <div
                class="tag point"
                v-for="(tag, idx) in tags"
                :key="tag.dimensionId"
                :style="{ background: colors[idx] }"
                @click="handleTag(tag.dimensionId)"
              >
                {{ `${tag.dimension} (${tag.nums})` }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  // 数据类型
  listEvidenceType,

  // 机构列表
  listDept,

  //机构详情
  deptInfo,

  // 公告
  listNotice,

  // 轮播图
  listRotation,

  // 栏目
  listCategoryTitle,

  // 标签
  listTagsTitle,

  // 月份统计列表（档案）
  listArticleMonth,

  // 日份统计列表
  listArticleDays,

  // 最新文章
  listArticleNew,
} from "@/api/blog/blog";
import { Calendar, Divider } from "ant-design-vue";
import "moment/locale/zh-cn";
export default {
  components: {
    Calendar,
  },
  data() {
    return {
      // 标签tag颜色
      colors: ["#2A92E8", "#60B676", "#C3A577", "#53B1D7", "#6F8AE4"],

      noticeIdx: 0,

      /** deptId */
      deptId: "",

      /** tab当前 */
      activeIndex: "0",

      /** 当前日期 */
      currentDate: Date(),

      /** 日期控件汉化 */
      locale: {
        lang: {
          month: "月",
          year: "年",
        },
      },

      /** 数据类型 */
      evidenceTypes: [],

      /** 公告 */
      noticeList: [],

      /** 当前公告位置 */
      noticeIndex: 0,

      /** 机构列表  */
      deptList: [],

      /** 机构详情 */
      deptInfo: {
        params: {},
      },

      /** 标签 */
      tags: [],

      /** 栏目 */
      category: [],

      /** 轮播图 */
      rotation: [],

      /** 档案 */
      monthArticle: [],

      /** 有文章的天数 */
      dayPointList: [],

      /** 当前页码 */
      currentPage: 0,

      /** 搜索信息 */
      articleParams: {
        deptId: null,
        deptName: null,
        evidenceType: null,
        categoryId: null,
        tagId: null,
        monthDimension: null,
        dayDimension: null,
        /** 搜索关键字 */
        keywords: null,
      },

      /** 最新文章 */
      articleNewList: [],

      /** 显示的文章 */
      visableArticleList: [],
    };
  },
  mounted() {
    // this.deptId = this.$store.state.user.deptId;
    // this.articleParams.deptId = this.deptId;
    this.deptId = 101;
    this.articleParams.deptId = this.deptId;
    this.articleParams.deptName = null;

    // 获取所有数据类型
    this.getEvidenceTypes();

    // 获取机构列表
    this.getListDept();

    // 获取机构详情
    // this.getDeptInfo();

    // 获取公告
    this.getNotice();

    // 获取轮播图
    this.getRotation();

    // 获取栏目
    this.getCmsCategory();

    // 获取标签
    this.getCmsTags();

    // 获取月份统计列表（档案）
    this.getArticleMonth();

    // 获取日份统计列表
    this.getArticleDays();

    // 获取最新文章
    this.getArticleNew();
  },
  computed: {
    pageCount() {
      return this.articleNewList.length || 0;
    },
  },
  methods: {
    /** 重置 */
    reset() {
      this.articleParams = {
        ...this.articleParams,
        categoryId: null,
        tagId: null,
        monthDimension: null,
        dayDimension: null,
        /** 搜索关键字 */
        keywords: null,
      };
    },

    /** 获取所有数据类型 */
    getEvidenceTypes() {
      listEvidenceType().then((response) => {
        let data = response.data || [];
        let all = {
          id: null,
          name: "全部",
        };
        data.splice(0, 0, all);
        this.evidenceTypes = data;
        if (data.length > 0) {
          this.articleParams.evidenceType = data[0].id;
        }
      });
    },

    /** 获取机构列表 */
    getListDept() {
      listDept().then((response) => {
        this.deptList = response.data || [];
        if (this.deptList.length) {
          setTimeout(() => {
            this.handleSelectOrganization(0);
          }, 1000);
        }
      });
    },

    /** 获取机构详情 */
    // getDeptInfo() {
    //   deptInfo(this.articleParams.deptId).then((response) => {
    //     this.deptInfo = response.data || {};
    //   });
    // },

    /** 获取公告 */
    getNotice() {
      listNotice().then((response) => {
        this.noticeList = response.data || [];
        this.noticeScroll();
      });
    },

    // 实现通告title -- noticeTitle滚动
    noticeScroll() {
      setInterval(() => {
        let idx = this.noticeIdx;
        idx++;
        if (idx >= this.noticeList.length) {
          idx = 0;
        }
        this.noticeIdx = idx;
      }, 2000);
    },

    /** 获取轮播图 */
    getRotation() {
      listRotation(this.articleParams.deptId).then((response) => {
        this.rotation = response.rows || [];
      });
    },

    /** 获取栏目 */
    getCmsCategory() {
      listCategoryTitle(this.articleParams.deptId).then((response) => {
        this.category = response.rows || [];
      });
    },

    /** 获取标签 */
    getCmsTags() {
      listTagsTitle(this.articleParams.deptId).then((response) => {
        this.tags = response.rows || [];
      });
    },

    /** 获取月份统计列表 */
    getArticleMonth() {
      listArticleMonth(this.articleParams.deptId).then((response) => {
        this.monthArticle = response.rows || [];
      });
    },

    /** 获取日份统计列表 */
    getArticleDays() {
      const year = parseInt(this.parseTime(this.currentDate, "{y}"));
      const month = parseInt(this.parseTime(this.currentDate, "{m}"));

      listArticleDays(this.articleParams.deptId, year, month).then(
        (response) => {
          let daysArticle = response.rows || [];
          let dayList = [];
          daysArticle.map((day) => {
            dayList.push(this.parseTime(day.dimension, "{y}-{m}-{d}"));
          });
          this.dayPointList = dayList;
        }
      );
    },

    /** 获取最新文章 */
    getArticleNew() {
      listArticleNew(this.articleParams).then((response) => {
        var list = response.rows || [];
        let articleList = list.filter((article) => {
          let keywords = (article.keywords || "").split(",");
          article.keywordsList = keywords;
          article.tagsList = (article.tagNames || "").split(",");
          return article;
        });
        this.articleNewList = articleList;
        this.visableArticleList = articleList.slice(0, 5);
      });
    },

    /** 选择机构 command string/number/object */
    handleSelectOrganization(command) {
      const deptInfo = this.deptList[command];
      this.articleParams.deptId = deptInfo.deptId;
      this.articleParams.deptName = deptInfo.deptName;
      // 文章
      this.getArticleNew();
      // 机构详情
      // this.getDeptInfo();
      // 栏目
      this.getCmsCategory();
      // 档案
      this.getArticleMonth();
      this.getArticleDays();
      // 标签
      this.getCmsTags();
    },

    /** 搜索 */
    handleSearch() {
      this.getArticleNew();
    },

    /** 登录后台 */
    handleLogin() {
      this.getConfigKey("backLogin.url").then((response) => {
        if (response.code === 200) {
          let href = response.msg;
          window.open(href, "_blank");
        }
      });
    },

    /** 点击轮播图 */
    handleCarousel(index) {
      if (!this.rotation[index].relateObjId) {
        return;
      }
      const page = this.$router.resolve(
        "/blog/" + this.rotation[index].relateObjId
      );
      window.open(page.href, "_blank");
    },

    /** 点击文章标题 新窗口打开文章页 */
    handleCaption(article) {
      const page = this.$router.resolve("/blog/" + article.articleId);
      window.open(page.href, "_blank");
    },

    /** 切换tab */
    handleSelect(key, keyPath) {
      this.reset();
      this.articleParams.evidenceType = this.evidenceTypes[key].id;
      //刷新文章
      this.getArticleNew();
    },

    /** 选择栏目 */
    handleCategory(categoryId) {
      this.reset();
      this.articleParams.categoryId = categoryId;
      //刷新文章
      this.getArticleNew();
    },

    /** 选择标签 */
    handleTag(tagId) {
      this.reset();
      this.articleParams.tagId = tagId;
      //刷新文章
      this.getArticleNew();
    },

    /** 日期变化 年、月 */
    onPanelChange(value, mode) {
      this.reset();
      this.currentDate = this.parseTime(value._d);
      // 重新获取有文档的天数
      this.getArticleDays();
      this.articleParams.dayDimension = this.parseTime(value._d, "{y}-{m}-{d}");
      //刷新文章
      this.getArticleNew();
    },

    /** 日期变化 天 */
    onDateChange(value, mode) {
      this.reset();
      this.currentDate = this.parseTime(value._d);
      this.articleParams.dayDimension = this.parseTime(value._d, "{y}-{m}-{d}");
      //刷新文章
      this.getArticleNew();
    },

    /** 切换档案 */
    handleMonthDimension(item) {
      this.reset();
      this.articleParams.monthDimension = item.dimension || null;
      //刷新文章
      this.getArticleNew();
    },

    /** 某一天是否有文档 */
    isDocumentsDate(scope) {
      const dayList = this.dayPointList;
      let findDate = dayList.filter((date) => {
        return this.parseTime(scope._d, "{y}-{m}-{d}") === date;
      });
      return findDate.length >= 1;
      // return (
      //   findDate.length >= 1 &&
      //   this.parseTime(scope._d, "{m}") ===
      //     this.parseTime(this.currentDate, "{m}")
      // );
    },

    /** 切换页码 */
    handleCurrentChange(page) {
      this.visableArticleList = this.articleNewList.slice(
        (page - 1) * 5,
        page * 5
      );
    },
  },
};
</script>


<style lang="scss">
.el-menu {
  background-color: transparent !important;
}

.el-menu-item.is-active {
  border: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

.el-menu.el-menu--horizontal {
  border: none !important;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 5px #07dbff solid !important;
}

.el-button--default {
  background-color: #07224a !important;
  border: 1px #394e6e solid !important;
  color: #07dbff !important;

  &:hover {
    color: #1890ff !important;
    border-color: #1890ff !important;
  }
}
</style>
<style lang="scss" scoped>
.blog-page {
  width: 100%;
  text-align: center;
  background-size: cover;
  top: 0px;
  bottom: 0px;
  -webkit-box-align: center;
  flex-direction: column;
  min-width: 1400px;
  min-height: 100%;
  height: 100%;
  background-image: url(../../assets/image/bg-blog.png);
  overflow: auto;
}

.blog-container {
  margin: auto;
  width: 100%;
  height: 100%;
  padding: 0 12%;
}

.nav-bar {
  height: 44px;
  padding-top: 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  float: right;
}

.blog-logo {
  font-size: 32px;
  color: #fff;
  font-weight: 600;
  padding-top: 2%;
}

.search-container {
  margin: auto;
  display: flex;
  flex-direction: row;
}

.search-input {
  margin-left: 26px;
  width: 70%;
}

.top-logoInfo {
  height: 13%;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.tab-container-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(6, 39, 88, 0.8);
  padding: 0 16px;

  .tab-container {
    display: flex;
    flex-direction: row;
  }
}

.body-container {
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: row;

  .body-left-container {
    width: 100%;
    background-color: #fff;
    padding: 16px;
    margin-bottom: 16px;
  }

  .body-right-container {
    margin-left: 16px;
    width: 332px;
  }

  .block-title {
    background-color: rgba(6, 39, 88, 0.8);
    margin-bottom: 1px;
    text-align: left;
    padding: 10px;
    color: #fff;
  }

  .block-body {
    background-color: #fff;
    text-align: left;
    padding: 16px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .site-calendar-demo-card {
    //width: 300px;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
  }

  .archive-text {
    line-height: 30px;
    border-bottom: #ddd solid 1px;
    color: #666;
  }

  .archive-text-hilight {
    color: #1791ff;
  }

  .tags-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.textDec {
  width: 60px;
  text-align-last: justify;
  text-align: justify;
  text-justify: distribute-all-lines;
}

.img-container {
  margin: 20px 0 60px 0;
  height: 300px;
  display: flex;
  flex-direction: row;
}

.img-container .carousel-container {
  margin: 20px 0 20px 10px;
  width: 80%;
  height: 100%;
  background-color: #fefefe;
}

.article-border-container {
  margin-top: 16px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.article-container {
  padding: 10px 20px 5px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);

  .through {
    height: 45px;
    width: 100%;
    // background: url(../../assets/image/gray-bg.png) left bottom repeat-x;
  }

  .info {
    margin-left: auto;
    font-size: 12px;
    color: #999;
  }

  .another {
    width: 100%;
    background-color: #e9f2f8;
    height: 28px;
    line-height: 28px;
    margin-bottom: 15px;
  }
}

.organization {
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.dateCellBack {
  margin-top: -14px;
  margin-left: 17px;
  position: absolute;
  height: 4px;
  width: 4px;
  background-color: #1791ff;
  border-radius: 2px;
}

.article-ategory {
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  // background-color: #005ea0;
  text-align: left;
  // color: #fff;
  margin-bottom: 15px;
}

.article-none {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin: 44px 0;
}

.el-page-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
}

.tag {
  height: 26px;
  line-height: 12px;
  font-size: 12px;
  background-color: #00b9ff;
  padding: 8px;
  margin-right: 4px;
  color: #fff;
  margin-top: 2px;
  // border-radius: 16px;
}

.article-container .caption {
  font-size: 16px;
  color: #666;
  font-weight: bold;
  margin-left: 8px;
  margin-top: 2px;
  cursor: pointer;
}

.article-container .caption:hover {
  color: #409eff;
}

.article-container .overview {
  font-size: 14px;
  color: #666;
  max-height: 60px;
  overflow: hidden;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.article-container .tip {
  font-size: 13px;
  color: #666;
  margin-right: 8px;
  padding: 0 8px 0 0;
  height: 16px;
  line-height: 16px;
}

.vertical {
  border-right: #ccc solid 1px;
  margin-left: 4px;
}

.realNum {
  color: #0066cc;
}

.point {
  cursor: pointer;

  &:hover {
    color: blue;
  }
}

.carousel-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.rotaryContainer {
  background-color: yellow;
  color: red;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  overflow: hidden;
  position: relative;
}

.rotaryBlockFirst {
  animation: rotaryBlockFirst 20s linear infinite;
  white-space: nowrap;
  position: absolute;
  width: 100%;
}

.rotaryBlockSecond {
  animation: rotaryBlockSecond 20s linear infinite;
  position: absolute;
  white-space: nowrap;
  width: 100%;
}

#notice-container {
  height: 30px;
  overflow: hidden;
  margin-bottom: 16px;
  line-height: 30px;
  overflow: hidden;
  position: relative;
  display: block;
  text-align: left;
  background-color: rgba(6, 39, 88, 0.8);
  color: #fff;
  padding: 0 12px;
}

.anim {
  transition: all 1s;
  margin-top: -30px;
  white-space: nowrap;
  position: absolute;
  width: 100%;
  text-align: left;
}

#notice-container .notice {
  position: absolute;
  height: 30px;
  width: 100%;
  text-align: left;
  transition: 0.5s;
}
</style>
