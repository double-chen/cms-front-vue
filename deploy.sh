#!/bin/bash

# 配置部分
LOCAL_FRONTEND_PATH="/Users/chenchen501/study/cms-front-vue/dist"  # 本地前端应用程序路径
REMOTE_USER="root"         # 远程服务器用户名
REMOTE_HOST="116.198.251.215"        # 远程服务器地址
REMOTE_FRONTEND_PATH="/var/www/cms/frontend/dist"          # 远程服务器路径
ARCHIVE_NAME="cms_frontend.tar.gz"        # 压缩文件名 

echo "构建前端项目..."
npm run build

# 压缩文件
echo "压缩前端文件..."
tar -czvf $ARCHIVE_NAME -C $LOCAL_FRONTEND_PATH .

# 上传文件
echo "上传前端文件..."
scp $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_FRONTEND_PATH

# 解压文件并清理
echo "解压前端文件并清理..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_FRONTEND_PATH
  tar -xzvf $ARCHIVE_NAME
  rm $ARCHIVE_NAME
EOF

# 清理本地压缩文件
echo "清理本地压缩文件..."
rm $ARCHIVE_NAME

echo "前端项目上传完成！"