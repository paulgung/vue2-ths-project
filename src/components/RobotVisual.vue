<template>
  <div id="visual-container" @selectstart="disableSelect">
    <Component
      class="robotVisual"
      :is="comId"
      v-bind="propsObj"
      :style="styleObj"
      v-if="comId"
    />
  </div>
</template>

<script lang="ts">
import loadScript from 'load-script'
import { defineComponent } from 'vue'
import Vue from 'vue'

type ObjType = Record<string, any>

export default defineComponent({
  name: "RobotVisual",
  
  props: {
    dataType: String, // 类型
    dataComurl: String, // 组件地址
    dataProps: String, // 组件属性
    dataStyle: String, // 组件样式
    dataVersion: String, // 组件版本
    aimeData: String, // aime可视化数据
  },

  data() {
    return {
      comId: '',
      propsObj: {} as ObjType,
      styleObj: {} as ObjType
    }
  },

  created() {
    // 初始化数据
    this.initData()
    // 注册组件
    this.injectCom()
  },

  methods: {
    initData() {
      try {
        this.propsObj = JSON.parse(decodeURIComponent(this.dataProps || '')) || {}
        this.styleObj = JSON.parse(decodeURIComponent(this.dataStyle || '')) || {}
      } catch (e) {
        throw e
      }
    },

    // 注册组件
    injectCom() {
      const { dataType, dataComurl, dataVersion } = this

      // 处理以下有龙虎榜组件的情况，在组件渲染提前处理，能有效的防止闪一下
      this.handleLonghuIframe()
      this.$nextTick(() => {
        this.handleTableComponent()
      })

      const id = `${dataType}_index@${dataVersion}`
      const comId = `Robot_${id}`.replace(/[_|\@]/g, '')

      // 加载js
      if (dataComurl) {
        loadScript(dataComurl, (err) => {
          if (err) {
            return
          }
          Vue.component(comId, (window as any)[id].default)
          this.comId = comId
        })
      }
    },

    // 龙虎榜特殊处理，判断有龙虎榜的组件，就去掉iframe
    handleLonghuIframe() {
      const { dataType, propsObj } = this
      const LONGHU_TYPE = 'thsf2e_common-long-hu-rank'
      const { iframeComponentId } = (propsObj?.dataSetting ?? {})

      if (dataType === LONGHU_TYPE && iframeComponentId) {
        const iframe = document.querySelector(`iframe[data-id="${iframeComponentId}"]`) as HTMLIFrameElement
        if (iframe) {
          iframe.remove()
        }
      }
    },

    // 表格组件特殊处理，判断有表格的组件，就去掉对应id的table标签
    handleTableComponent() {
      const { dataType, propsObj } = this
      const COMPONENT_NAME = 'thsf2e_ai-table'
      const { tableComponentId } = (propsObj?.dataSetting ?? {})
      if (dataType === COMPONENT_NAME && tableComponentId) {
        const dom = document.querySelector(`table[data-id="${tableComponentId}"]`) as HTMLElement
        if (dom) {
          dom.remove()
        }
      }
    },

    // 禁止用户选择
    disableSelect(e: Event) {
      console.log('禁止用户选择')
      e.preventDefault()
    }
  }
})
</script>

<style lang="less" scoped>
#visual-container {
  position: relative;
  z-index: 1;  // 防止可视化图表组件的层级过高
  // 由于正文里面设置了通配符，这里需要重置禁止用户选择
  * {
    user-select: none !important;
  }
}
</style>
