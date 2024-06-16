<template>
  <div class="tag-container">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">
          新增标签
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="handleBatchDelete(scope.selectedListIds)"
        >
          批量删除标签
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">
          查看
        </el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">
          编辑
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <TagDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="TagList">
import { ref, reactive } from 'vue'
import { CirclePlus, View, Delete, EditPen } from '@element-plus/icons-vue'
import ProTable from '@/components/ProTable/index.vue'
import TagDrawer from '@/views/content/components/TagDrawer/index.vue'
import { useHandleData } from '@/hooks/useHandleData'
import { getTagList, addTag, editTag, deleteTag } from '@/api/modules/content'

import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { Content } from '@/api/interface'

// ProTable 实例
const proTable = ref<ProTableInstance>()
const columns = reactive<ColumnProps<Content.ResTag>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'name',
    label: '名称',
    search: { el: 'input', tooltip: '按名称模糊搜索' }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 230 }
])

const handleBatchDelete = async (selectedListIds) => {
  await useHandleData(deleteTag, { ids: selectedListIds }, '删除所选标签信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

const handleDelete = async (row) => {
  await useHandleData(deleteTag, { ids: [row.id] }, `删除【${row.name}】标签`)
  proTable.value?.getTableList()
}

const getTableList = (params: any) => {
  return getTagList(params)
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof TagDrawer> | null>(null)
const openDrawer = (title: string, row: Partial<Content.ResTag> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? addTag : title === '编辑' ? editTag : undefined,
    getTableList: proTable.value?.getTableList
  }
  drawerRef.value?.acceptParams(params)
}
</script>
