# 方案三：直接在 VPS 上运行同步脚本（最推荐）

这是最简单且最可靠的方案！

## 为什么这个方案最好？

**问题分析**：
- GitHub Actions → 推送到仓库 → VPS 拉取 → 重启 Docker（步骤太多）
- 每一步都可能出问题（网络、权限、时序等）

**更好的方案**：
- VPS 直接运行 `sync_nav.js` → 更新本地文件 → Docker 自动检测变化（更简单）

## 实现步骤

### 1. 在 VPS 上设置定时任务

SSH 登录到您的 VPS，然后：

```bash
# 进入项目目录
cd /path/to/laowang-nav

# 编辑 crontab
crontab -e

# 添加以下行（每6小时同步一次）
0 */6 * * * cd /path/to/laowang-nav && npm run sync >> /var/log/nav-sync.log 2>&1

# 或者每天凌晨2点同步
0 2 * * * cd /path/to/laowang-nav && npm run sync >> /var/log/nav-sync.log 2>&1
```

### 2. 配置 Docker 自动重载

**选项 A：使用 Volume 挂载（推荐）**

修改您的 `docker-compose.yml` 或 `docker run` 命令：

```yaml
# docker-compose.yml
version: '3'
services:
  laowang-nav:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./nav_data.json:/app/nav_data.json:ro    # 只读挂载
      - ./menus.json:/app/menus.json:ro          # 只读挂载
    restart: unless-stopped
```

或者使用 docker run：

```bash
docker run -d \
  --name laowang-nav \
  -p 3000:3000 \
  -v /path/to/nav_data.json:/app/nav_data.json:ro \
  -v /path/to/menus.json:/app/menus.json:ro \
  --restart unless-stopped \
  laowang-nav
```

**优点**：
- ✅ 文件更新后，容器内立即可见
- ✅ 无需重启容器
- ✅ 前端会自动重新获取数据

**选项 B：使用文件监听 + 自动重启**

创建一个监听脚本 `watch-and-restart.sh`：

```bash
#!/bin/bash

inotifywait -m -e modify nav_data.json menus.json |
while read path action file; do
    echo "检测到 $file 更新，重启容器..."
    docker restart laowang-nav
done
```

## 完整流程对比

### ❌ 复杂方案（您担心的问题）
```
VPS 本地 → GitHub Actions → 推送到 GitHub → VPS 拉取 → 重启 Docker
        ↑                                        ↓
        └────────────── 绕了一大圈 ────────────────┘
```

### ✅ 简单方案（推荐）
```
VPS 定时任务 → sync_nav.js → 更新 JSON 文件 → Docker Volume 自动同步
```

## 测试验证

SSH 到 VPS，手动运行一次：

```bash
cd /path/to/laowang-nav
npm run sync
```

检查文件是否更新：
```bash
ls -lh nav_data.json menus.json
```

访问您的网站，看是否显示最新数据：
```bash
curl https://nav.199060.xyz
```

## 优势总结

| 对比项 | GitHub Actions 方案 | VPS 直接同步方案 |
|--------|---------------------|------------------|
| 复杂度 | ⭐⭐⭐⭐ | ⭐ |
| 可靠性 | 依赖 GitHub + 网络 | 只依赖 VPS |
| 速度 | 慢（需要 git 操作） | 快（直接更新） |
| 调试 | 困难（查看 Actions 日志） | 简单（查看 VPS 日志） |
| 成本 | GitHub Actions 额度 | 无额外成本 |

## 推荐配置

```bash
# VPS 上的完整配置流程

# 1. 确保 Node.js 已安装
node -v

# 2. 进入项目目录
cd /path/to/laowang-nav

# 3. 测试同步脚本
npm run sync

# 4. 设置定时任务（每6小时）
(crontab -l 2>/dev/null; echo "0 */6 * * * cd $(pwd) && npm run sync >> /var/log/nav-sync.log 2>&1") | crontab -

# 5. 验证 crontab 已设置
crontab -l

# 6. 查看同步日志（首次需要等待）
tail -f /var/log/nav-sync.log
```

**这样就完成了！VPS 会每6小时自动同步，无需 GitHub Actions，也无需担心 Docker 更新问题。**
