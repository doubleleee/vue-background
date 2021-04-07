<template>
  <div class="roles">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addIsShow = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="index1"
              :class="['bdbottom', index1 == 0 ? 'bdtop' : '']"
              class="vcenter"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                  :class="[index2 == 0 ? '' : 'bdtop']"
                  class="vcenter"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot:default="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.id)"
              >编辑
            </el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row.id)"
              >删除
            </el-button>
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRole(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addIsShow"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addRolesForm"
          :rules="rules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮区 -->
        <span slot="footer">
          <el-button @click="addIsShow = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editIsShow"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form :model="editRolesForm" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="editRolesForm.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮区 -->
        <span slot="footer">
          <el-button @click="editIsShow = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setIsShow"
        width="50%"
        @close="setDialogClosed"
      >
        <!-- 内容主体区  树形控件 -->
        <el-tree
          :data="setRolesList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>

        <!-- 底部按钮区 -->
        <span slot="footer">
          <el-button @click="setIsShow = false">取 消</el-button>
          <el-button type="primary" @click="setRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      addIsShow: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      editIsShow: false,
      editRolesForm: {},
      setIsShow: false,
      setRolesList: [],

      // 树形控件的属性绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的节点 id 数组
      defKeys: [],

      // 当前即将分配权限的角色 id
      roleId: "",

      //  添加角色验证规则
      rules: {
        roleName: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles/");
      if (res.meta.status != 200) return this.$msg.error("获取角色列表失败");
      this.rolesList = res.data;
    },

    // 监听确定添加角色按钮，表单预验证
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/roles",
          this.addRolesForm
        );

        if (res.meta.status != 201) return this.$msg.error("添加角色失败！");
        this.$msg.success(res.meta.msg);

        // 隐藏对话框
        this.addIsShow = false;
        // 重新渲染页面
        this.getRolesList();
        console.log(res);
      });
    },

    // 关闭添加角色对话框重置表单内容
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

    // 展示编辑角色列表的对话框
    async showEdit(id) {
      const { data: res } = await this.$http.get("/roles/" + id);
      if (res.meta.status != 200) return this.$msg.error("获取角色信息失败");
      this.editRolesForm = res.data;
      this.editIsShow = true;
    },

    // 编辑角色信息并提交
    async editRole() {
      const { data: res } = await this.$http.put(
        "/roles/" + this.editRolesForm.roleId,
        {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc,
        }
      );
      if (res.meta.status != 200) return this.$msg.error("更新角色信息失败");
      this.editIsShow = false;
      this.getRolesList();
      this.$msg.success("更新角色信息成功");
      console.log(this.editRolesForm);
    },

    // 关闭编辑角色对话框重置表单内容
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 根据 id 删除对应角色
    async removeRole(id) {
      // 弹框询问是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      // console.log(confirmResult);

      if (confirmResult != "confirm") {
        return this.$msg.info("已取消删除");
      }

      // 发起请求
      const { data: res } = await this.$http.delete("/roles/" + id);
      if (res.meta.status != 200) {
        return this.$msg.error("删除角色失败！");
      }
      this.$msg.success("删除角色成功！");
      this.getRolesList();
    },

    // 根据 id 删除对应权限标签
    async removeRight(role, id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      // console.log(confirmResult);

      if (confirmResult != "confirm") {
        return this.$msg.info("已取消删除");
      }

      // 发起请求
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${id}`
      );
      if (res.meta.status != 200) return this.$msg.error("删除权限失败");

      this.$msg.success("删除权限成功");
      // this.getRolesList();
      role.children = res.data;
    },

    // 展示分配权限的对话框
    async showSetRole(role) {
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$http.get("/rights/tree");
      if (res.meta.status != 200) return this.$msg.error("获取权限数据失败");

      this.setRolesList = res.data;
      console.log(this.setRolesList);

      // 递归获取三级节点的 id
      this.getDefKeys(role, this.defKeys);

      this.setIsShow = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的 id，并保存到 defKeys 数组中
    getDefKeys(node, arr) {
      // 如果当前节点不包含 children 属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach((item) => this.getDefKeys(item, arr));
      }
    },

    // 关闭分配权限对话框重置选中内容
    setDialogClosed() {
      this.defKeys = [];
    },

    // 点击确定为角色分配权限
    async setRole() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");

      // 请求角色授权
      const { data: res } = await this.$http.post(
        `/roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status != 200) return this.$msg.error("分配权限失败");
      this.$msg.success("分配权限成功");
      this.getRolesList();
      this.setIsShow = false;
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
