<template>
  <div class="text-clamp-demo">
    <h1>TextClamp 组件使用示例</h1>
    
    <!-- 基础用法 -->
    <section class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-item">
        <h3>默认配置（5行，展开/收起）</h3>
        <TextClamp
          :content="longText"
          :rows="5"
          :expand-text="'展开'"
          :collapse-text="'收起'"
        />
      </div>
      
      <div class="demo-item">
        <h3>自定义行数（3行）</h3>
        <TextClamp
          :content="longText"
          :rows="3"
          :expand-text="'查看更多'"
          :collapse-text="'收起'"
        />
      </div>
    </section>

    <!-- 自定义样式 -->
    <section class="demo-section">
      <h2>自定义样式</h2>
      <div class="demo-item">
        <h3>自定义字体大小和行高</h3>
        <TextClamp
          :content="longText"
          :rows="4"
          :line-height="'28px'"
          :font-size="'16px'"
          :expand-text="'展开详情'"
          :collapse-text="'收起'"
        />
      </div>
      
      <div class="demo-item">
        <h3>自定义省略符号</h3>
        <TextClamp
          :content="longText"
          :rows="3"
          :dot="'...'"
          :expand-text="'展开'"
          :collapse-text="'收起'"
        />
      </div>
    </section>

    <!-- 事件列表样式 -->
    <section class="demo-section">
      <h2>事件列表样式（您提供的示例）</h2>
      <div class="demo-item">
        <h3>带箭头的文本截断</h3>
        <div class="event-list">
          <div 
            v-for="(item, index) in eventList" 
            :key="index" 
            class="event-item"
          >
            <TextClamp
              :content="item.title"
              :rows="2"
              :single="true"
              line-height="20px"
              font-size="14px"
              :custom-icon="arrowIcon"
              :show-action="false"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 高级用法 -->
    <section class="demo-section">
      <h2>高级用法</h2>
      <div class="demo-item">
        <h3>默认展开状态</h3>
        <TextClamp
          :content="longText"
          :rows="3"
          :default-expand="true"
          :expand-text="'展开'"
          :collapse-text="'收起'"
        />
      </div>
      
      <div class="demo-item">
        <h3>隐藏展开按钮</h3>
        <TextClamp
          :content="longText"
          :rows="3"
          :show-action="false"
        />
      </div>
      
      <div class="demo-item">
        <h3>监听展开状态变化</h3>
        <TextClamp
          :content="longText"
          :rows="3"
          @expand="onExpandChange"
        />
        <p class="status-text">当前状态: {{ expandStatus ? '已展开' : '已收起' }}</p>
      </div>
    </section>

    <!-- 不同内容长度测试 -->
    <section class="demo-section">
      <h2>不同内容长度测试</h2>
      <div class="demo-item">
        <h3>短文本（不需要截断）</h3>
        <TextClamp
          :content="shortText"
          :rows="3"
          :expand-text="'展开'"
          :collapse-text="'收起'"
        />
      </div>
      
      <div class="demo-item">
        <h3>中等长度文本</h3>
        <TextClamp
          :content="mediumText"
          :rows="2"
          :expand-text="'展开'"
          :collapse-text="'收起'"
        />
      </div>
    </section>
  </div>
</template>

<script>
import TextClamp from '@/components/TextClamp.vue'

export default {
  name: 'TextClampView',
  components: {
    TextClamp
  },
  data() {
    return {
      expandStatus: false,
      longText: `这是一段很长的文本内容，用于演示 TextClamp 组件的功能。这段文本包含了多个段落，每个段落都有不同的内容。第一段主要介绍组件的基本功能，包括文本截断、展开收起等特性。第二段详细说明了组件的配置选项，如行数设置、自定义样式、事件处理等。第三段展示了组件在实际项目中的应用场景，比如新闻列表、产品描述、用户评论等。第四段介绍了一些高级用法，如默认展开状态、隐藏操作按钮、监听状态变化等。最后一段总结了这个组件的优点和使用注意事项。`,
      shortText: '这是一段短文本，不需要截断。',
      mediumText: '这是一段中等长度的文本，可能会根据行数设置进行截断。这段文本包含了足够的内容来测试组件的截断功能。',
      eventList: [
        {
          title: '重要公告：公司将于下周一进行系统维护，预计维护时间为2小时，期间可能影响部分功能使用，请提前做好准备。',
          hasDetail: true
        },
        {
          title: '新产品发布：我们很高兴地宣布，全新的移动端应用已经正式上线，为用户提供更好的使用体验。',
          hasDetail: true
        },
        {
          title: '技术分享会：本周五下午2点将举办技术分享会，主题为"前端性能优化实践"，欢迎各位同事参加。',
          hasDetail: true
        },
        {
          title: '团队建设活动：为了增强团队凝聚力，我们计划在下个月组织一次户外团建活动，具体时间和地点将另行通知。',
          hasDetail: true
        }
      ],
      arrowIcon: `<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.33789 0.661438L0.630784 1.36854L4.26178 4.99954L0.630784 8.63053L1.33789 9.33764L5.67599 4.99954L1.33789 0.661438Z"
          fill="currentColor"
        />
      </svg>`
    }
  },
  methods: {
    onExpandChange(isExpand) {
      this.expandStatus = isExpand
      console.log('展开状态变化:', isExpand)
    }
  }
}
</script>

<style lang="less" scoped>
.text-clamp-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 40px;
  font-size: 28px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  color: #1890ff;
  margin-bottom: 20px;
  font-size: 20px;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 8px;
}

.demo-item {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}

.demo-item h3 {
  color: #666;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.status-text {
  margin-top: 10px;
  color: #52c41a;
  font-weight: 500;
}

// 事件列表样式
.event-list {
  .event-item {
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .text-clamp-demo {
    padding: 15px;
  }
  
  .demo-section {
    padding: 15px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .demo-section h2 {
    font-size: 18px;
  }
}
</style>
