<template>
  <div id="app">
    <component
      v-for="(component, index) in components"
      :is="component.type"
      :key="index"
      v-bind="component.props"
    />
  </div>
</template>

<script>
import loadScript from "load-script";

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
      components: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch(
        "https://yapi.myhexin.com/yapi/mock_v2/310020/server-page/app/v1/11"
      )
        .then((response) => response.json())
        .then((data) => {
          const content = data.data.newsInfo.content;
          this.parseContent(content);
        })
        .catch((error) => console.error("Error fetching data:", error));
    },
    parseContent(content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const robotParseTags = tempDiv.querySelectorAll("robot-parse");

      Array.from(robotParseTags).map((tag) => {
        const aimeData = tag.getAttribute("aime-data");
        if (aimeData) {
          const dataObj = JSON.parse(decodeURIComponent(aimeData));
          const { data, cdn } = dataObj;
          if (cdn.css) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cdn.css;
            document.head.appendChild(link);
          }
          loadScript(cdn.js, (err) => {
            if (err) {
              return;
            }
            Vue.use(window.jgyRenderLib, {
              locale: "zh-CN",
            });
            const convertedData = this.convertToJGYRenderSDK(data);
            this.addAimeComponent(convertedData);
          });
        }
      });
    },
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
    convertToJGYRenderSDK(resultPageData) {
      const { components, page } = resultPageData;
      const renamedComponents = components.map((component) => {
        component.show_type =
          JGY_TO_RENDER_SDKDICTIONARY[component.show_type] ||
          component.show_type;
        return component;
      });
      const layoutData = JSON.parse(page.layout.layout_data);
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
