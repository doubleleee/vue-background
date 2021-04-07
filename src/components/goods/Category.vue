<template>
  <div class="category">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateClick">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表区 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success success"
            v-if="scope.row.cat_deleted == false"
          ></i>
          <i class="el-icon-error error" v-else></i>
        </template>

        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template v-slot:opt="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEdit(scope.row.cat_id)"
            >编辑
          </el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addIsShow"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addCateForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 用来指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
            @change="parentCateChange"
            clearable
            class="cas-width"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addIsShow = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editIsShow"
      width="50%"
      @close="editdDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editCateForm"
        :rules="rules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="editIsShow = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 获取分类列表的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   总数据条数
      total: 0,

      //   为 table 指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前列使用的模板名称
          template: "opt",
        },
      ],

      //   是否显示添加分类的对话框
      addIsShow: false,

      //   添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0, // 分类的父 id
        cat_level: 0, // 默认添加的分类等级为一级
      },

      //   父级分类的列表
      parentList: [],
      //   选中的父级分类的 id 数组
      selectedKeys: [],

      //   是否显示编辑分类的对话框
      editIsShow: false,
      //   编辑分类对话框展示的表单内容
      editCateForm: {},

      //  添加分类的验证规则
      rules: {
        cat_name: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      },
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("/categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$msg.error("获取商品分类列表失败！");

      this.cateList = res.data.result;
      this.total = res.data.total;
      console.log(this.cateList);
    },

    // 获取父级分类的数据列表
    async getParentList() {
      const { data: res } = await this.$http.get("/categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200)
        return this.$msg.error("获取父级分类数据失败！");

      this.parentList = res.data;
    },

    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },

    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },

    // 展示添加分类按钮对话框
    addCateClick() {
      this.getParentList();
      this.addIsShow = true;
    },

    // 选择项发生变化触发
    parentCateChange() {
      // 如果 selectedKeys 数组中的 length 大于 0，证明选中了父级分类
      // 反之，证明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //   父级分类的 id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击确定添加分类按钮
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/categories",
          this.addCateForm
        );
        if (res.meta.status != 201) return this.$msg.error("添加分类失败！");

        this.$msg.success("添加分类成功！");
        this.getCateList();
        this.addIsShow = false;
      });
    },

    // 关闭添加分类对话框重置表单内容
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 展示编辑分类对话框
    async showEdit(id) {
      const { data: res } = await this.$http.get("/categories/" + id);
      if (res.meta.status != 200) return this.$msg.error("获取分类信息失败！");

      this.editCateForm = res.data;
      this.editIsShow = true;
    },

    // 点击确定编辑分类按钮
    async editCate() {
      const { data: res } = await this.$http.put(
        "/categories/" + this.editCateForm.cat_id,
        { cat_name: this.editCateForm.cat_name }
      );
      if (res.meta.status != 200) return this.$msg.error("修改分类名称失败！");

      this.$msg.success("修改分类名称成功！");
      this.getCateList();
      this.editIsShow = false;
    },

    // 关闭编辑分类对话框重置表单内容
    editdDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 根据 id 删除对应分类
    removeCate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/categories/" + id);
          if (res.meta.status != 200) return this.$msg.error("删除分类失败！");
          this.$msg.success("删除分类成功！");
          this.getCateList();
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
.success {
  color: green;
}
.error {
  color: red;
}
.tree-table {
  margin-top: 20px;
}
.cas-width {
  width: 100%;
}
</style>
