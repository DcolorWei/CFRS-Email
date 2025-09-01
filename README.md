# 全栈项目说明

本项目为全栈应用，前端基于 [React](https://react.dev/) [HeroUI](https://heroicons.com/) ，后端基于 [Express](https://expressjs.com/)，使用[TypeScript](https://www.typescriptlang.org/) 进行开发，推荐使用 [Bun](https://bun.sh/)。

## 技术栈

- 前端：React + HeroUI
- 后端：Express
- 运行环境：Bun (nodejs)

## 快速开始

### 克隆项目

```bash
git clone https://github.com/FlowAurelia/quick-clipboard
cd quick-clipboard
```

### 安装依赖

```bash
npm install -g bun
bun install
```

### 编辑环境变量

新建.env文件，内容可参考.env.example；或执行
```bash
cp .env.example .env
```

### 启动开发环境

#### 前端

```bash
npm run dev
```

#### 后端

```bash
npm run server
```

## 目录结构

```
.
├── client/      # 前端代码（React + HeroUI + TypeScript）
├── server/      # 后端代码（Express + TypeScript）
├── shared/      # 共享代码（TypeScript）
├── README.md
```

## 构建与部署

## 许可证

MIT