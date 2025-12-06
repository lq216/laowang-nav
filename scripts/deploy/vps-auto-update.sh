#!/bin/bash

# VPS 自动更新脚本
# 用途：定时从 GitHub 拉取最新代码并重启 Docker 容器

# 配置变量
PROJECT_DIR="/path/to/your/laowang-nav"  # 修改为您的项目路径
CONTAINER_NAME="laowang-nav"              # 修改为您的容器名称
LOG_FILE="/var/log/nav-auto-update.log"

# 记录日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "====== 开始检查更新 ======"

# 进入项目目录
cd "$PROJECT_DIR" || {
    log "错误: 无法进入项目目录 $PROJECT_DIR"
    exit 1
}

# 获取当前提交哈希
BEFORE_HASH=$(git rev-parse HEAD)

# 从 GitHub 拉取最新代码
log "正在从 GitHub 拉取最新代码..."
git fetch origin main

# 获取远程提交哈希
AFTER_HASH=$(git rev-parse origin/main)

# 比较是否有更新
if [ "$BEFORE_HASH" = "$AFTER_HASH" ]; then
    log "✅ 已是最新版本，无需更新"
    exit 0
fi

log "🔄 检测到新版本，开始更新..."
log "旧版本: $BEFORE_HASH"
log "新版本: $AFTER_HASH"

# 拉取并合并
git pull origin main

# 重新构建并重启 Docker 容器
log "正在重启 Docker 容器..."

# 方法1：如果使用 docker-compose
if [ -f "docker-compose.yml" ]; then
    docker-compose down
    docker-compose up -d --build
    log "✅ Docker Compose 容器已重启"
# 方法2：如果使用单个 docker 命令
else
    docker stop "$CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"
    # 这里需要根据您的实际 docker run 命令修改
    docker build -t laowang-nav .
    docker run -d --name "$CONTAINER_NAME" -p 3000:3000 laowang-nav
    log "✅ Docker 容器已重启"
fi

log "====== 更新完成 ======"
