<template>
  <div :class="['text-ellipsis', !isExpand && 'un-expand']">
    <div
      ref="contentEl"
      class="text-ellipsis-content"
      :style="{
        maxHeight: isExpand ? 'none' : `${maxHeight}px`,
        lineHeight: lineHeight,
        fontSize: fontSize,
      }"
    >
      <!-- 占位符 -->
      <span class="text-ellipsis-placeholder" :style="{ height: placeholderHeight + 'px' }"></span>
      <!-- 内容+操作按钮,不留空格 -->
      <span class="text-content" :style="{ lineHeight: lineHeight }" v-html="isExpand ? content : ''"></span
      ><span v-if="isEll" ref="tailEl" class="text-ellipsis-tail">
        <span v-if="!isExpand" class="text-ellipsis-dot">{{ dot }}</span>
        <span v-if="customIcon" class="custom-icon" v-html="customIcon"></span>
        <span v-if="!single && showAction" class="text-ellipsis-action" @click="onActionClick"
          >{{ actionText }}
        </span> </span
      ><span class="text-content" :style="{ lineHeight: lineHeight }" v-html="isExpand ? '' : content"></span
      ><span v-if="!isEll && customIcon" class="custom-icon" v-html="customIcon"></span>
    </div>
    <span v-if="single && isEll && showAction" class="text-ellipsis-action" @click="onActionClick">{{
      actionText
    }}</span>
  </div>
</template>

<script>
export default {
  name: 'TextClamp',
  props: {
    // 文本内容
    content: {
      type: String,
      default: '',
      required: true,
    },
    // 省略行数
    rows: {
      type: Number,
      default: 5,
    },
    // 展开文案
    expandText: {
      type: String,
      default: '展开',
    },
    // 收起文案
    collapseText: {
      type: String,
      default: '收起',
    },
    // 省略点
    dot: {
      type: String,
      default: '...',
    },
    single: {
      type: Boolean,
      default: false,
    },
    // 行高属性
    lineHeight: {
      type: String,
      default: '22px',
    },
    // 字体大小
    fontSize: {
      type: String,
      default: '14px',
    },
    // 是否默认展开
    defaultExpand: {
      type: Boolean,
      default: false,
    },
    // 是否显示展开/收起按钮
    showAction: {
      type: Boolean,
      default: true,
    },
    // 自定义省略点后的图标
    customIcon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isEll: false, // 是否省略
      isExpand: this.defaultExpand, // 是否展开
      placeholderHeight: 0, // 占位符高度
      maxHeight: 0, // 最大高度
      lazyToCalc: false, // 延迟执行
    };
  },
  computed: {
    actionText() {
      return this.isExpand ? this.collapseText : this.expandText;
    },
  },
  watch: {
    content: {
      handler: 'calcEll',
      immediate: false,
    },
    rows: {
      handler: 'calcEll',
      immediate: false,
    },
  },
  beforeMount() {
    this.calcEll();
  },
  methods: {
    toNum(val) {
      if (!val) return 0;
      return parseFloat(val);
    },
    // 计算内容省略
    async calcEll() {
      await this.$nextTick();
      if (!this.$refs.contentEl) return;

      // 计算最大高度，确保行高计算正确
      const lineHeightNum = this.toNum(this.lineHeight);
      this.maxHeight = lineHeightNum * this.rows;

      // 判断是否省略内容
      this.isEll = this.$refs.contentEl.scrollHeight > this.maxHeight;

      // 计算占位符高度: 容器高度 - 操作按钮高度
      if (this.isEll) {
        // 延迟执行, 解决内容已经展开时, 触发计算, tailEl 容器展开时的高度与收起时高度不一致, 导致错位
        if (this.isExpand) {
          this.lazyToCalc = true;
          return;
        }
        await this.$nextTick();
        if (this.$refs.tailEl) {
          this.placeholderHeight = this.maxHeight - this.$refs.tailEl.offsetHeight;
        }
      }
    },
    // 展开/收起点击
    onActionClick() {
      this.isExpand = !this.isExpand;
      this.$emit('expand', this.isExpand);

      if (this.lazyToCalc) {
        this.lazyToCalc = false;
        this.calcEll();
      }
    },
    // 暴露的方法
    update() {
      this.calcEll();
    },
  },
};
</script>

<style lang="less" scoped>
.text-ellipsis {
  &.un-expand {
    .text-ellipsis-placeholder {
      float: right;
    }
    .text-ellipsis-tail {
      float: right;
      clear: both;
    }
  }
  &.is-single {
    .text-ellipsis-action {
      display: block;
    }
  }
}
.text-ellipsis-content {
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  text-justify: inter-character;
  text-align: justify;
  white-space: pre-line;
}
.text-ellipsis-action {
  color: #4167d9;
  cursor: pointer;
  word-break: keep-all;
}

.custom-icon {
  display: inline-block;
  margin-left: 4px;
  width: 12px;
  text-align: center;
}
</style>
