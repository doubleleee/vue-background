<template>
  <div class="orders">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @change="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="ordersList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格(元)"
        ></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 修改地址 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddress"
            >
            </el-button>
            <!-- 物流进度 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress(1106975712662)"
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

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressIsShow"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            class="cas-width"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addressIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addressIsShow = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressIsShow" width="50%">
      物流信息
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";

export default {
  name: "Orders",
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      ordersList: [],
      addressIsShow: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      // 省市区/县数据
      cityData,
      progressIsShow: false,
      progressForm: [],

      // 验证规则
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区/县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getOrdersList();
  },

  methods: {
    // 请求订单列表数据
    async getOrdersList() {
      const { data: res } = await this.$http.get("/orders", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$msg.error("获取订单列表失败！");

      this.ordersList = res.data.goods;
      this.total = res.data.total;
      console.log(this.ordersList);
    },

    // 每页条数改变触发事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },

    // 当前页码改变触发事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    },

    // 展示修改地址的对话框
    showAddress() {
      this.addressIsShow = true;
    },

    // 关闭编辑地址对话框重置表单内容
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },

    // 展示物流进度的对话框
    async showProgress(id) {
      // const { data: res } = await this.$http.get("/kuaidi/" + id);
      // if (res.meta.status != 200) return this.$msg.error("获取物流信息失败！");

      // this.progressForm = res.data;
      this.progressIsShow = true;
    },
  },
};
</script>

<style scoped>
.cas-width {
  width: 100%;
}
</style>
