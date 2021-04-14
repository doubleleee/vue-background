<template>
  <div class="add">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示文本区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab 标签页 -->
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTab"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息的表单栏 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item 项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTabData"
              :key="index"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTabData"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action 表示图片要上传到的后台 API 接口 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" @click="add" class="addbtn"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      //   添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: "",
        // 参数，包括动态参数和静态属性
        attrs: [],
      },
      cateList: [],
      manyTabData: [],
      onlyTabData: [],
      //   上传图片的路径
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //   上传图片组件的 headers 请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   预览图片的路径
      previewPath: "",
      previewVisible: false,

      // 验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请输入商品分类",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    //   获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200) return this.$msg.error("获取商品分类失败！");

      this.cateList = res.data;
    },

    // 级联选择器选中项变化会触发
    handleChange() {
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
      console.log(this.addForm.goods_cat);
    },

    // 切换 tab 栏会触发（切换前后）
    beforeTab(activeName, oldActiveName) {
      //   activeName、 oldActiveName 值为 tab-pane 的 name 属性
      //   商品分类未选择不能切换到其他标签页
      if (oldActiveName == "0" && this.addForm.goods_cat.length != 3) {
        this.$msg.error("请先选择商品分类！");
        return false;
      }
    },

    //  切换到 tab 栏会触发（切换后）
    async tabClick() {
      // 证明访问商品参数面板
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `/categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status != 200)
          return this.$msg.error("获取动态参数列表失败！");

        res.data.forEach((item) => {
          if (item.attr_vals != "") {
            item.attr_vals = item.attr_vals.split(",");
          }
        });
        this.manyTabData = res.data;
      }
      // 证明访问商品属性面板
      else if (this.activeIndex == "2") {
        const { data: res } = await this.$http.get(
          `/categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status != 200)
          return this.$msg.error("获取静态参数列表失败！");

        this.onlyTabData = res.data;
      }
    },

    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },

    // 处理移除图片的操作
    handleRemove(file) {
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2、从 pics 数组中，找到图片对应的索引值
      const i = this.addForm.pics.findIndex((item) => item.pic == filePath);
      // 3、调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },

    // 监听图片上传成功
    handleSuccess(response) {
      // 1、拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2、将图片信息对象 push 到 pics 数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },

    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$msg.error("请填写必要的表单项！");

        // 执行添加的业务逻辑

        // 处理动态参数，只需要上传 attr_id 和 attr_value 两个属性
        this.manyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          this.addForm.attrs.push(newInfo);
          //   console.log(this.addForm);
        });

        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });

        // 商品分类 goods_cat 要求上传数据类型为字符串，需要深拷贝
        const form = JSON.parse(JSON.stringify(this.addForm));
        form.goods_cat = form.goods_cat.join(",");

        console.log(form);
        // 发起请求添加商品
        // 商品名必须是唯一的
        const { data: res } = await this.$http.post("/goods", form);
        if (res.meta.status != 201) return this.$msg.error("添加商品失败！");

        this.$msg.success("添加商品成功！");
        this.$router.push("/goods");
        console.log(res);
      });
    },
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 5px 5px;
}
.previewImg {
  width: 100%;
}
.addbtn {
  margin-top: 20px;
}
</style>
