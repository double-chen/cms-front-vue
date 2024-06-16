<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}标签`"
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
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入标签名称" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="TagDrawer">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

interface DrawerProps {
  title: string
  isView: boolean
  row: Partial<User.ResUserList>
  api?: (params: any) => Promise<any>
  getTableList?: () => void
}

const drawerVisible = ref(false)

const drawerProps = ref<DrawerProps>({
  isView: false,
  title: '',
  row: {}
})

const rules = reactive({
  name: [{ required: true, message: '请输入标签名称' }]
})

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await drawerProps.value.api!(drawerProps.value.row)
      ElMessage.success({ message: `${drawerProps.value.title}标签成功！` })
      drawerProps.value.getTableList!()
      drawerVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params
  drawerVisible.value = true
}

defineExpose({
  acceptParams
})
</script>
