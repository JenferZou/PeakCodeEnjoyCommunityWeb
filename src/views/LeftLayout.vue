<template>
    <div class="main-container">
        <div class="sidebar">
            <!-- 左侧导航栏内容 -->
            <ul class="nav">
                <li class="nav-item">
                    <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/profile">Profile</router-link>
                </li>
                <!-- 添加更多导航项 -->
            </ul>
        </div>

<!--        <div class="content">-->
<!--            &lt;!&ndash; 主要内容区域，用来显示路由视图 &ndash;&gt;-->
<!--            <router-view></router-view>-->
<!--        </div>-->
    </div>
</template>

<script>
export default {
    name: 'LeftLayout',
    // 组件逻辑和生命周期方法
}
</script>

<style scoped>
.main-container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 200px;
    padding: 20px;
    margin: 20px;
    background-color: #fff; /* 设置导航栏背景颜色为白色 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.nav {
    list-style: none;
    padding: 0;
    margin-top: 20px; /* 为导航栏顶部添加空隙 */
}

.nav-item {
    margin-bottom: 10px;
}

.nav-item a {
    text-decoration: none;
    color: #333; /* 设置导航栏链接文字颜色为深灰色 */
}

.content {
    flex: 1;
    padding: 20px;
    margin: 20px; /* 为内容区域添加空隙 */
    background-color: #fff; /* 设置内容区域背景颜色为白色 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
</style>
