<template>
  <div>
    <component
      v-for="(component, index) in components"
      :is="component.type"
      :key="index"
      v-bind="component.props"
    />
  </div>
</template>

<script>
// 定义组件类型映射字典
const JGY_TO_RENDER_SDKDICTIONARY = {
  jgy: "jgyRender",
  jgySdk: "jgyRenderSdk",
  jgyLoading: "jgyRenderLoading",
  radar2: "jgyRadar2",
  newRadar: "jgyRadar2",
  bar3: "jgyBar3",
  barline3: "jgyBarLine3",
  line3: "jgyLine3",
  pie2: "jgyPie2",
  newPie: "jgyPie2",
  rankLine3: "jgyRankLine3",
  stackBar1: "jgyStackBar1",
  stackBar: "jgyStackBar1",
  title1: "jgyTitle1",
  transverseBar1: "jgyTransverseBar1",
  transverseBar: "jgyTransverseBar1",
  container: "jgyContainer",
  txt1: "jgyTxt1",
  timeChart1: "jgyTimeChart1",
  timeChart: "jgyTimeChart1",
  timeBar1: "jgyTimeBar1",
  timeBar: "jgyTimeBar1",
  timeTrack1: "jgyTimeTrack1",
  xuangu_tableV1: "jgyXuanguTable1",
  tableV1: "jgyTable1",
  kline3: "jgyKline3",
  kline2: "jgyKline2",
  lowcode: "jgyLowcode",
  container2: "container2",
};

export default {
  data() {
    return {
      components: [], // 存储组件数据的数组
    };
  },
  created() {
    this.fetchData(); // 组件创建时获取数据
  },
  methods: {
    // 从API获取数据
    fetchData() {
      fetch(
        "https://yapi.myhexin.com/yapi/mock_v2/310020/server-page/app/v1/11"
      )
        .then((response) => response.json())
        .then((data) => {
          const content = data.data.newsInfo.content;
          this.parseContent(content); // 解析获取的内容
        })
        .catch((error) => console.error("获取数据时出错:", error));
    },
    // 解析内容
    parseContent(content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const robotParseTags = tempDiv.querySelectorAll("robot-parse");

      Array.from(robotParseTags).map((tag) => {
        const aimeData = tag.getAttribute("aime-data");
        if (aimeData) {
          const dataObj = JSON.parse(decodeURIComponent(aimeData));
          const { data, cdn } = dataObj;
          // 加载CSS
          if (cdn.css) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cdn.css;
            document.head.appendChild(link);
          }
          // 加载JS
          if (cdn.js) {
            const script = document.createElement("script");
            script.src = `https:${cdn.js}`;
            script.onload = () => {
              Vue.use(window.jgyRenderLib, {
                locale: "zh-CN",
              });
              const convertedData = this.convertToJGYRenderSDK(data);
              this.addAimeComponent(convertedData);
            };
            document.body.appendChild(script);
          }
        }
      });
    },
    // 添加AIME组件
    addAimeComponent(data) {
      this.components.push({
        type: "jgyRenderSdk",
        props: {
          language: "zh",
          answer: data,
          sourceType: "Iwencai",
          divclass: "outclass",
          source: "yuyinzhushou",
          statName: "gyy",
        },
      });
    },
    // 转换数据为JGYRenderSDK格式
    convertToJGYRenderSDK(resultPageData) {
      const { components, page } = resultPageData;
      // 重命名组件类型
      const renamedComponents = components.map((component) => {
        component.show_type =
          JGY_TO_RENDER_SDKDICTIONARY[component.show_type] ||
          component.show_type;
        return component;
      });
      const layoutData = JSON.parse(page.layout.layout_data);
      // 重命名页面布局数据
      const renamedPage = {
        ...page,
        layout: {
          ...page.layout,
          layout_data: JSON.stringify(
            layoutData.map((layout) => this.renameLayoutData(layout))
          ),
        },
      };
      return {
        ...resultPageData,
        components: renamedComponents,
        page: renamedPage,
      };
    },
    // 递归重命名布局数据
    renameLayoutData(layout) {
      let newChildren = layout.children;
      if (Array.isArray(layout.children)) {
        newChildren = layout.children.map((child) =>
          this.renameLayoutData(child)
        );
      }
      return {
        ...layout,
        children: newChildren,
        showType: JGY_TO_RENDER_SDKDICTIONARY[layout.showType],
      };
    },
  },
};
</script>

<style scoped>
/* 添加你的样式 */
</style>
