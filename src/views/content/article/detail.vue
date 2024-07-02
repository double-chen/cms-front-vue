<template>
  <div class="card content-box">
    <el-form :model="formData" label-width="140px">
      <el-form-item label="标题 :">
        <el-input v-model="formData.title" placeholder="请填写标题" />
      </el-form-item>
      <el-form-item label="内容 :">
        <WangEditor v-model:value="formData.content" height="400px" />
      </el-form-item>
      <el-form-item label="摘要 :">
        <el-input v-model="formData.summary" placeholder="请填写摘要" />
      </el-form-item>
      <el-form-item label="分类 :">
        <el-tree-select
          v-model="formData.categoryId"
          check-strictly
          :data="categories"
          placeholder="请选择分类"
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item label="缩略图 :">
        <el-upload
          class="thumbnail-uploader"
          accept="image/*"
          :show-file-list="false"
          :http-request="uploadThumbnail"
          :before-upload="beforeThumbnailUpload"
        >
          <img v-if="formData.thumbnail" :src="formData.thumbnail" class="thumbnail-uploader-img" />
          <el-icon v-else class="thumbnail-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"> 保存 </el-button>
        <el-button>保存并发布</el-button>
        <el-button @click="onPreview"> 内容预览 </el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" title="内容预览" width="1300px" top="50px">
      <div class="view" v-html="formData.content"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="articleForm">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import WangEditor from '@/components/WangEditor/index.vue'
import { getCategoryList, getArticleById, saveArticle } from '@/api/modules/content'
import { uploadImg } from '@/api/modules/upload'
import type { UploadProps } from 'element-plus'

const route = useRoute()

console.log('route', route.params.id)
const formData: any = reactive({
  id: '',
  title: '',
  content: '',
  summary: '',
  categoryId: '',
  tagIds: [],
  thumbnail: ''
})
const categories: any = ref([])
const dialogVisible = ref(false)
const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}

const beforeThumbnailUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片文件大小不能超过 2MB')
    return false
  }
  return true
}

const headers = {
  'Content-Type': 'multipart/form-data'
}

const uploadThumbnail = async (option: any) => {
  const uploadFormData = new FormData()
  uploadFormData.append('file', option.file)

  try {
    const res = await uploadImg(uploadFormData, {
      headers: headers,
      withCredentials: true // 如果需要携带凭证，如 cookies
    })

    formData.thumbnail = res.data
  } catch (error) {
    console.error(error)
  }
}

// ResArticle {
//     id: string
//     title: string // 标题
//     content: string // 内容
//     summary: string // 摘要
//     categoryId: string // 分类id
//     categoryName: string // 分类名称
//     tagIds: string[] // 标签id
//     tagNames: string[] // 标签名称
//     thumbnail: string // 缩略图
//     isPublish: boolean // 是否发布
//     createTime: string // 创建时间
//     updateTime: string // 更新时间
//   }

const onSubmit = async () => {
  // ElMessage.success('提交的数据为 : ' + JSON.stringify(formData))

  const params = {
    id: formData.id,
    title: formData.title,
    content: formData.content,
    summary: formData.summary,
    categoryId: formData.categoryId,
    tagIds: formData.tagIds,
    thumbnail: formData.thumbnail,
    isPublish: formData.isPublish
  }
  const res = await saveArticle(params)
  if (res.data) {
    ElMessage.success('保存成功')
  }
}

const onPreview = () => {
  dialogVisible.value = true
}

onMounted(async () => {
  const resCategory = await getCategoryList({})
  categories.value = resCategory.data.list

  if (route.params.id) {
    const params = {
      id: route.params.id
    }
    const resArticle = await getArticleById(params)

    formData.id = resArticle.data.id
    formData.title = resArticle.data.title
    formData.content = resArticle.data.content
    formData.summary = resArticle.data.summary
    formData.categoryId = resArticle.data.categoryId
    formData.tagIds = resArticle.data.tagIds
    formData.thumbnail = resArticle.data.thumbnail
  }
})
</script>

<style scoped lang="scss">
.el-form {
  width: 100%;
  .text-center {
    text-align: center;
  }
}
</style>

<style>
.thumbnail-uploader .el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}

.thumbnail-uploader .el-upload:hover {
  border-color: #409eff;
}

.thumbnail-uploader-img {
  width: 178px;
  height: 178px;
}

.thumbnail-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
