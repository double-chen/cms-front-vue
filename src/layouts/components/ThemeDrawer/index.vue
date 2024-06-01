<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="290px">
    <!-- 布局样式 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Notification /></el-icon>
      布局样式
    </el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]"
          @click="setLayout('vertical')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout == 'vertical'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]"
          @click="setLayout('classic')"
        >
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout == 'classic'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]"
          @click="setLayout('transverse')"
        >
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout == 'transverse'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div
          :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]"
          @click="setLayout('columns')"
        >
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout == 'columns'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'
import { LayoutType } from '@/stores/interface'
// import { DEFAULT_PRIMARY } from '@/config'
import mittBus from '@/utils/mittBus'
// import SwitchDark from '@/components/SwitchDark/index.vue'

const { setAsideTheme } = useTheme()

const globalStore = useGlobalStore()
const {
  layout
  //   primary,
  //   isGrey,
  //   isWeak,
  //   asideInverted,
  //   headerInverted,
  //   isCollapse,
  //   accordion,
  //   breadcrumb,
  //   breadcrumbIcon,
  //   tabs,
  //   tabsIcon,
  //   footer
} = storeToRefs(globalStore)

// 设置布局方式
const setLayout = (val: LayoutType) => {
  globalStore.setGlobalState('layout', val)
  setAsideTheme()
}

// 打开主题设置
const drawerVisible = ref(false)
mittBus.on('openThemeDrawer', () => (drawerVisible.value = true))
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
