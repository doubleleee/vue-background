<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠侧边栏按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>

        <!-- unique-opened 是否只保持一个子菜单的展开，默认值为 false-->
        <!-- 只写 unique-opened 与 :unique-opened='true' 效果一样-->
        <!-- 开启路由模式 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 动态绑定 index 数据类型应为字符串 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],

      // 菜单列表图标  id:图标
      iconsObj: {
        125: "el-icon-user",
        103: "el-icon-key",
        101: "el-icon-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },

      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();

    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    /**
     * 网络数据请求
     */

    // 请求左侧菜单栏
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status != 200) return this.$msg.error(res.meta.msg);
      this.menulist = res.data;
    },

    /**
     * 监听点击事件
     */

    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    // 点击按钮展开/折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      // 重新赋值
      this.activePath = activePath;
    },
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
</style>
