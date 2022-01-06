<template>
  <div class="app-container">
    <div class="searchContainer">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="文件名" prop="fileName">
          <el-input
            v-model="queryParams.fileName"
            placeholder="请输入文件名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 一级 -->
    <div class="type-container">
      <el-popover
        v-for="node1 in typeTree"
        :key="node1.id"
        :disabled="(node1.children && node1.children.length) ? false : true"
        :close-delay="closeDelay"
        class="pop-container"
        placement="bottom"
        width="max-content"
        trigger="hover"
      >
        <el-button class="pop-item" @click="handleTypeBtn(node1)" slot="reference">
          <div class="svg-container" :class="`icon-${node1.icon}`">
            <svg-icon :icon-class="node1.icon" />
          </div>
          <div class="info-container">{{ node1.name }}</div>
        </el-button>

        <!-- 二级 -->
        <div v-if="node1.children">
          <el-popover
            v-for="node2 in node1.children"
            :key="node2.id"
            :disabled="(node2.children && node2.children.length) ? false : true"
            :close-delay="closeDelay"
            class="pop-container"
            placement="bottom"
            width="max-content"
            trigger="hover"
          >
            <el-button class="pop-item" @click="handleTypeBtn(node2)" slot="reference">
              <div class="svg-container" :class="`icon-${node2.icon}`">
                <svg-icon :icon-class="node2.icon" />
              </div>
              <div class="info-container">{{ node2.name }}</div>
            </el-button>
            <!-- 三级 -->
            <div v-if="node2.children">
              <el-popover
                v-for="node3 in node2.children"
                :key="node3.id"
                :disabled="(node3.children && node3.children.length) ? false : true"
                :close-delay="closeDelay"
                class="pop-container"
                placement="bottom"
                width="max-content"
                trigger="hover"
              >
                <el-button class="pop-item" @click="handleTypeBtn(node3)" slot="reference">
                  <div class="svg-container" :class="`icon-${node3.icon}`">
                    <svg-icon :icon-class="node3.icon" />
                  </div>
                  <div class="info-container">{{ node3.name }}</div>
                </el-button>
                <div v-if="node3.children"></div>
              </el-popover>
            </div>
          </el-popover>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import {
  /** 数据类型 */
  listDataType,
} from "../../../api/edg/evidence";
export default {
  data() {
    return {
      /** popup关闭延迟 */
      closeDelay: 1500,

      /** 搜索条件 */
      queryParams: {},

      /** 能源类型树 */
      typeTree: [],
    };
  },
  mounted() {
    // 获取能源类型
    this.getTypeList();
  },
  methods: {
    /** 获取能源类型列表 */
    getTypeList() {
      listDataType().then((response) => {
        const typeList = response.data || [];
        const tree = this.handleTree(typeList, "id", "parentId");
        this.typeTree = tree;
      });
    },

    /** 点击搜索 */
    handleSearch() {
      const fileName = this.queryParams.fileName || null;
      const item = {
        fileName: fileName,
      };
      this.$router.push({
        path: "/data/tracea/list",
        query: {
          item: JSON.stringify(item),
        },
      });
    },

    /** 前往对应能源类型 */
    handleTypeBtn(node) {
      const name = node.name;
      const id = node.id;
      const fileName = this.queryParams.fileName || null;
      const item = {
        name: node.name,
        id: node.id,
        fileName: fileName,
      };
      this.$router.push({
        path: "/data/tracea/list",
        query: {
          item: JSON.stringify(item),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.searchContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.type-container {
  display: flex;
  flex-direction: row;
  width: 50vw;
  margin: auto;
}

.pop-container {
  flex: 1;
  text-align: center;
}

.pop-item {
  //border: none;
  //background-color: burlywood;
  height: 100%;
  width: max-content;
  margin-right: 5px;
  text-align: center;
}

.pop-text2 {
  margin-top: 6px;
}

.svg-icon {
  height: 40px;
  width: 40px;
}

.svg-container {
  margin: 5px;
  float: left;
}

.info-container {
  float: left;
  margin-top: 25%;
}

.icon-energy {
  color: #6de497;
}

.icon-electricity {
  color: #5cbac0;
}

.icon-electricity1 {
  color: #5cbac0;
}

.icon-petroleum {
  color: #30495e;
}

.icon-petroleum1 {
  color: #30495e;
}

.icon-wind {
  color: #75a6b1;
}

.icon-wind1 {
  color: #75a6b1;
}

.icon-wind2 {
  color: #75a6b1;
}

.icon-wind3 {
  color: #75a6b1;
}

.icon-wind4 {
  color: #75a6b1;
}

.icon-water {
  color: #4d8fd9;
}

.icon-water1 {
  color: #4d8fd9;
}
</style>