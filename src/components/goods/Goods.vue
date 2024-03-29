<template>
  <div class="goods">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @change="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table 表格区 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量(克)"
          width="100"
        ></el-table-column>
        <el-table-column label="商品创建时间" width="120">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <!-- 操作 -->
          <template v-slot="scope">
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">
            </el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //   商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    //   获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("/goods", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$msg.error("获取商品列表失败！");

      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    // 改变分页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // 改变当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 跳转添加商品路由页面
    addGood() {
      this.$router.push("/goods/add");
    },

    // 根据 id 删除商品
    removeGoods(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`/goods/${id}`);
          if (res.meta.status != 200) return this.$msg.error("删除商品失败！");
          this.$msg.success("删除商品成功！");
          this.getGoodsList();
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>
