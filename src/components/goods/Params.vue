<template>
  <div class="params">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="select">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="dialogVisible = true"
          >
            添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 渲染 tag 标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  class="tag"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template v-slot="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEdit(scope.row.attr_id)"
                  >编辑
                </el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="dialogVisible = true"
          >
            添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 渲染 tag 标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  class="tag"
                  closable
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template v-slot="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEdit(scope.row.attr_id)"
                  >编辑
                </el-button>
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editVisible"
      width="50%"
      @close="editClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品列表
      cateList: [],
      //   选中的分类的 id 数组
      selectedKeys: [],
      //   默认被激活的 tab 页签的名称
      activeName: "many",
      //   动态参数列表
      manyTableData: [],
      //  静态属性列表
      onlyTableData: [],
      //   是否显示对话框
      dialogVisible: false,
      // 添加参数对话框表单内容
      addForm: {},
      // 是否显示编辑对话框
      editVisible: false,
      // 编辑参数对话框表单内容
      editForm: {},

      // 添加参数验证规则
      addRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      // 修改参数验证规则
      editRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getCateList();
  },

  computed: {
    //   禁用按钮返回 true，否则返回 false
    isBtnDisabled() {
      if (this.selectedKeys.length != 3) {
        return true;
      } else {
        return false;
      }
    },

    // 当前选中的三级分类的 id
    cateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      }
    },

    // 动态计算对话框标题文本
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },

  methods: {
    //  获取所有商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200)
        return this.$msg.error("获取商品分类列表失败！");

      this.cateList = res.data;
    },

    //   根据所选分类的 id，和当前所处的面板，获取对应参数
    async getParamsList() {
      // 只能设置三级分类的参数
      if (this.selectedKeys.length != 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
      }
      const { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status != 200) return this.$msg.error("获取参数列表失败！");

      // 将字符串对象转换为数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    // 级联选择框选中项变化触发函数
    handleChange() {
      this.getParamsList();
    },

    // tab 页签点击事件的处理函数
    handleTabClick() {
      this.getParamsList();
    },

    // 点击确定添加按钮
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status != 201) return this.$msg.error("添加参数失败！");

        this.$msg.success("添加参数成功！");
        this.dialogVisible = false;
        this.getParamsList();
      });
    },

    // 关闭添加参数对话框重置表单
    addClose() {
      this.$refs.addFormRef.resetFields();
    },

    // 点击编辑按钮显示对话框
    async showEdit(id) {
      const { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status != 200) return this.$msg.error("获取参数信息失败！");

      console.log(res.data);
      this.editForm = res.data;
      this.editVisible = true;
    },

    // 点击确定编辑按钮
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;

        const { data: res } = await this.$http.put(
          `/categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.editForm.attr_vals,
          }
        );
        if (res.meta.status != 200) return this.$msg.error("修改参数失败！");

        this.$msg.success("修改参数成功！");
        this.getParamsList();
        this.editVisible = false;
      });
    },

    // 关闭编辑参数对话框重置表单
    editClose() {
      this.$refs.editFormRef.resetFields();
    },

    // 点击删除参数按钮
    removeParams(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `/categories/${this.cateId}/attributes/${id}`
          );
          if (res.meta.status != 200) return this.$msg.error("删除参数失败！");
          this.$msg.success("删除参数成功！");
          this.getParamsList();
        })
        .catch(() => {
          this.$msg({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 文本框失去焦点或按下 enter 时触发
    async handleInputConfirm(row) {
      // trim 去掉两端空格
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
      } else {
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        // 提交新建 tag
        const { data: res } = await this.$http.put(
          `/categories/${this.cateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: row.attr_vals.join(","),
          }
        );
        if (res.meta.status != 200) return this.$msg.error("新增标签失败！");
        this.$msg.success("新增标签成功！");
      }
      row.inputVisible = false;
    },

    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick ：当页面上元素被重新渲染后，才指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除 tag 标签
    async handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      // 提交删除
      const { data: res } = await this.$http.put(
        `/categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status != 200) return this.$msg.error("删除标签失败！");
      this.$msg.success("删除标签成功！");
    },
  },
};
</script>

<style scoped>
.select {
  margin: 20px 0;
}
.tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
