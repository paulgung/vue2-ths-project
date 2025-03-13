<template>
  <div>
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "MotanRobot",
  data() {
    return {
      content: "", // 存储API返回的内容
    };
  },
  created() {
    this.fetchData(); // 组件创建时获取数据
  },
  methods: {
    // 从API获取数据
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          "https://yapi.myhexin.com/yapi/mock_v2/310020/server-page/app/v1/11"
        );
        const data = await response.json();
        if (data && data.data && data.data.newsInfo) {
          this.content = data.data.newsInfo.content;
          this.parseContent(this.content); // 解析获取的内容
        } else {
          throw new Error("数据格式不正确");
        }
      } catch (error) {
        this.error = `获取数据时出错: ${error.message}`;
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },
    // 解析内容
    parseContent(content) {
    },
  },
};
</script>

<style scoped>
/* 添加你的样式 */
</style>
