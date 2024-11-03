<template>
  <div class="article-container">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">
          新增分类
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="handleBatchDelete(scope.selectedListIds)"
        >
          批量删除分类
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
    <CategoryDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx" name="category">
import { ref, reactive } from 'vue'
import ProTable from '@/components/ProTable/index.vue'
import { getCategoryList, addCategory, editCategory, deleteCategory } from '@/api/modules/content'
import { CirclePlus, Delete, View, EditPen } from '@element-plus/icons-vue'
import { useHandleData } from '@/hooks/useHandleData'
import CategoryDrawer from '@/views/content/components/CategoryDrawer/index.vue'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { Content } from '@/api/interface'

// ProTable 实例
const proTable = ref<ProTableInstance>()
const columns = reactive<ColumnProps<Content.ResCategory>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'isInMenu',
    label: '是否在菜单',
    render: (scope) => {
      return <el-tag>{scope.row.isInMenu ? '是' : '否'}</el-tag>
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 230 }
])

const handleBatchDelete = async (selectedListIds) => {
  await useHandleData(deleteCategory, { ids: selectedListIds }, '删除所选分类信息')
  proTable.value?.clearSelection()
  proTable.value?.getTableList()
}

const handleDelete = async (row) => {
  await useHandleData(deleteCategory, { ids: [row.id] }, `删除【${row.name}】分类`)
  proTable.value?.getTableList()
}

const getTableList = (params: any) => {
  return getCategoryList(params)
}

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof CategoryDrawer> | null>(null)
const openDrawer = (title: string, row: Partial<Content.ResCategory> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? addCategory : title === '编辑' ? editCategory : undefined,
    getTableList: proTable.value?.getTableList
  }
  drawerRef.value?.acceptParams(params)
}
</script>
