# Scripts 目录说明

本目录包含 laowang-nav 项目的所有脚本文件,按功能组织。

## 📁 目录结构

```
scripts/
├── sync/          # 数据同步相关脚本
├── deploy/        # 部署相关脚本
├── utils/         # 工具脚本
└── temp/          # 临时脚本(被 git 忽略)
```

---

## 🔄 同步脚本 (sync/)

### sync_nav.js
**用途**: 从 nav.eooce.com 增量同步导航数据

**功能**:
- 从远程 API 获取菜单和卡片数据
- 智能合并本地和远程数据(保留本地自定义分类)
- 将合并后的数据写入 `user-data/conf.yml`
- 保存菜单数据到 `data/menus.json`

**使用方法**:
```bash
npm run sync
# 或者
node scripts/sync/sync_nav.js
```

**输出**:
- `data/menus.json` - 菜单数据
- `user-data/conf.yml` - 更新后的配置文件

---

### fetch_nav_data.js
**用途**: 批量获取导航数据

**功能**:
- 从指定的 endpoints 批量获取数据
- 将结果保存为 JSON 文件

**使用方法**:
```bash
node scripts/sync/fetch_nav_data.js
```

**输出**:
- `data/nav_data.json` - 获取的导航数据

---

### merge_keji8.js
**用途**: 合并 keji8 配置到主配置

**功能**:
- 读取 `data/keji8_conf.yml`
- 合并到 `user-data/conf.yml`

**使用方法**:
```bash
node scripts/sync/merge_keji8.js
```

---

### merge_conf.js
**用途**: 合并 sections 配置

**功能**:
- 读取 `data/sections.yml`
- 合并到主配置文件

**使用方法**:
```bash
node scripts/sync/merge_conf.js
```

---

## 🚀 部署脚本 (deploy/)

### deploy-vps.sh
**用途**: VPS 部署脚本

**功能**:
- 自动化 VPS 部署流程
- 配置 Docker 容器
- 设置环境变量

**使用方法**:
```bash
bash scripts/deploy/deploy-vps.sh
```

**前置要求**:
- 已安装 Docker
- 已配置 SSH 访问

---

### vps-auto-update.sh
**用途**: VPS 自动更新脚本

**功能**:
- 自动拉取最新代码
- 重启 Docker 容器
- 可配置为 cron 任务

**使用方法**:
```bash
bash scripts/deploy/vps-auto-update.sh
```

**Cron 配置示例**:
```bash
# 每天凌晨 2 点自动更新
0 2 * * * /path/to/scripts/deploy/vps-auto-update.sh
```

---

### webhook-deploy.js
**用途**: Webhook 部署服务

**功能**:
- 启动 webhook 服务器监听 GitHub 推送
- 接收到推送后自动部署

**使用方法**:
```bash
node scripts/deploy/webhook-deploy.js
```

**配置**:
- 端口: 可在脚本中配置
- 需要在 GitHub 仓库中配置 webhook URL

---

## 🔧 工具脚本 (utils/)

### convert_data.js
**用途**: 数据格式转换

**功能**:
- 将 `data/nav_data.json` 转换为 `data/sections.yml`
- 格式化数据结构

**使用方法**:
```bash
node scripts/utils/convert_data.js
```

---

### verify_api.js
**用途**: API 验证工具

**功能**:
- 验证 API 端点是否可访问
- 检查 API 响应格式

**使用方法**:
```bash
node scripts/utils/verify_api.js
```

---

## 🗂️ 临时脚本 (temp/)

> ⚠️ **注意**: 此目录被 `.gitignore` 忽略,不会提交到仓库

### check-json.js
**用途**: 验证 locale JSON 文件

**功能**:
- 检查所有 locale 文件的 JSON 语法
- 快速定位损坏的文件

**使用方法**:
```bash
node scripts/temp/check-json.js
```

---

### fix-json.js
**用途**: 修复损坏的 JSON 文件

**功能**:
- 尝试修复 JSON 文件中的编码问题
- 移除 BOM 和控制字符

**使用方法**:
```bash
node scripts/temp/fix-json.js
```

---

### fetch-locales.js
**用途**: 从上游获取 locale 文件

**功能**:
- 从 Dashy 上游仓库下载 locale 文件
- 用于修复损坏的翻译文件

**使用方法**:
```bash
node scripts/temp/fetch-locales.js
```

---

## 📝 数据文件路径说明

所有脚本现在使用统一的数据目录结构:

- **数据文件位置**: `data/`
  - `nav_data.json` - 原始导航数据
  - `synced_sections.json` - 同步的 sections
  - `menus.json` - 菜单数据
  - `sections.yml` - sections 配置
  - `keji8_conf.yml` - keji8 配置
  
- **用户配置**: `user-data/`
  - `conf.yml` - 主配置文件

---

## 💡 最佳实践

1. **定期同步**: 使用 `npm run sync` 保持数据更新
2. **备份配置**: 在运行合并脚本前备份 `user-data/conf.yml`
3. **测试部署**: 本地测试通过后再运行部署脚本
4. **查看日志**: 脚本运行时注意输出信息,及时发现问题

---

## 🔗 相关文档

- [项目 README](../README.md)
- [VPS 部署指南](../docs/直接在VPS上同步.md)
