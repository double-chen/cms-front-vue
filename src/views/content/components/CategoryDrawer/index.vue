<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}分类`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="105px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属父类" prop="parentId">
        <el-tree-select
          v-model="drawerProps.row!.parentId"
          check-strictly
          lazy
          :load="load"
          :data="categories"
          placeholder="请选择分类"
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item label="是否在菜单" prop="isInMenu">
        <el-switch v-model="drawerProps.row!.isInMenu" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="CategoryDrawer">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { getCategoryList } from '@/api/modules/content'

import { Content } from '@/api/interface'

interface DrawerProps {
  title: string
  isView: boolean
  row: Partial<Content.ResCategory>
  api?: (params: any) => Promise<any>
  getTableList?: () => void
}

const drawerVisible = ref(false)

const drawerProps = ref<DrawerProps>({
  isView: false,
  title: '',
  row: {}
})

const categories = ref([])

const rules = reactive({
  name: [{ required: true, message: '请输入分类名称' }],
  parentId: [{ required: true, message: '请选择父分类' }]
})

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}

const load = async (node, resolve) => {
  console.log('load:node', node)
  if (node.isLeaf) return resolve([])

  if (node.level === 0) {
    resolve([
      {
        name: '根节点',
        id: '-1'
      }
    ])
    return
  }

  const res = await getCategoryList({ parentId: node.data.id })

  resolve(res.data)
}

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await drawerProps.value.api!(drawerProps.value.row)
      ElMessage.success({ message: `${drawerProps.value.title}分类成功！` })
      drawerProps.value.getTableList!()
      drawerVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

onMounted(async () => {
  // categories.value = res.data.list
})

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params
  drawerVisible.value = true
}

defineExpose({
  acceptParams
})
</script>
