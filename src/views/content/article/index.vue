<template>
  <div class="article-container">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="handleAdd">
          新增文章
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="handleBatchDelete(scope.selectedListIds)"
        >
          批量删除文章
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="handlePreview(scope.row)">
          预览
        </el-button>
        <el-button type="primary" link :icon="EditPen" @click="handleEdit(scope.row)">
          编辑
        </el-button>
        <el-button type="primary" link :icon="Refresh" @click="handlePublish(scope.row)">
          发布
        </el-button>
        <el-button type="primary" link :icon="Delete" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </ProTable>
    <el-dialog v-model="dialogVisible" title="富文本内容预览" width="1300px" top="50px">
      <div class="view" v-html="content"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="ArticleList">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import ProTable from '@/components/ProTable/index.vue'
// import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, EditPen, View, Refresh } from '@element-plus/icons-vue'
import { getArticleList, getCategoryList } from '@/api/modules/content'
import { ProTableInstance, ColumnProps } from '@/components/ProTable/interface'
import { Content } from '@/api/interface'

const router = useRouter()

// ProTable 实例
const proTable = ref<ProTableInstance>()
// 表格配置项
const columns = reactive<ColumnProps<Content.ResArticle>[]>([
  { type: 'selection', fixed: 'left', width: 70 },
  {
    prop: 'title',
    label: '标题',
    search: { el: 'input', tooltip: '按标题模糊搜索' }
  },
  {
    prop: 'categoryId',
    label: '分类',
    enum: fetchCategoryList,
    fieldNames: { label: 'name', value: 'id' },
    search: { el: 'tree-select', props: { filterable: true } },
    render: (scope) => {
      return scope.row.categoryName
    }
  },
  {
    prop: 'tagNames',
    label: '标签',
    render: (scope) => {
      return (
        <div class="article-container-tags">
          {scope.row.tagNames.map((tag) => (
            <el-tag key={tag}>{tag}</el-tag>
          ))}
        </div>
      )
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    width: 180,
    search: {
      el: 'date-picker',
      span: 2,
      props: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
      defaultValue: [
        dayjs().subtract(1, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      ]
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
])

const dialogVisible = ref(false)
const content = ref('')

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  newParams.updateTime && (newParams.startTime = newParams.updateTime[0])
  newParams.updateTime && (newParams.endTime = newParams.updateTime[1])
  delete newParams.updateTime
  return getArticleList(newParams)
}

const handleAdd = () => {
  router.push(`/content/article/create`)
}

const handleBatchDelete = async (ids: string[]) => {
  console.log('ids', ids)
  // await useHandleData(deleteUser, { ids }, '删除所选用户信息')
  // proTable.value?.clearSelection()
  // proTable.value?.getTableList()
}

const handlePreview = (article: Content.ResArticle) => {
  dialogVisible.value = true
  content.value = article.content
}

const handleEdit = (article: Content.ResArticle) => {
  console.log(article)
}

const handlePublish = (article: Content.ResArticle) => {
  console.log(article)
}

const handleDelete = (article: Content.ResArticle) => {
  console.log(article)
}

async function fetchCategoryList(params: any) {
  const res = await getCategoryList(params)
  console.log('res', res)
  return {
    data: res.data.list
  }
}
</script>

<style>
.article-container-tags {
  display: flex;
  gap: 4px;
}
</style>
