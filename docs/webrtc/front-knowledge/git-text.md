# git相关知识

> 一些git相关操作，可能对大部分有经验的人来说比较简单，但当时自己一个人摸索确实花了不少时间，简单记录下；记录的东西和记录的用语可能不大规范，只是用一些例子方便熟悉操作与理解，避免因为太注意规范不知道从哪下手

## git协作分支管理与常见操作

* **本地项目关联远程库**

以前面的vitepress项目为例，在本地做了一个项目想要放到github上管理时

1. 在github上创建repository(仓库)

2. 在本地已有项目的文件中初始化

   ```
   git init
   ```

3. 关联远程仓库

   ```
   git remote add origin https://github.com/qiuxiadongyu/m-zone.git //关联远程仓库,后面的是仓库地址，如果创建的是是空仓库的话或有对应的命令提示，也可以在code clone上看到
   ```

> PS：如果你创建的库（repository）在创建时没有取消默认的README.md，可能会出现本地分支和远程分支不一致推不了的情况，这样的话可以直接使用git clone拉取项目，然后直接修改对应分支（一般默认是master或main），将项目的内容复制过去然后提交推送

* **提交推送**

在开发过程中，修改完后需要将修改的内容提交推送到远端仓库（github里的库），这时候我们需要将修改的内容弄成一个新的commit（提交）然后push（推）到远端库，这一步目前主流的ide基本都有集成相关的可视化工具，以下以vscode为例子

1. 在使用vscode开发项目时，如果已经关联了远端仓库可以在左侧的插件列表出点击源代码管理的插件，可以看到修改的文件
2. 将鼠标移到需要提交的文件处或直接点击，可以看到有个＋号，将需要提交的文件都点击＋号，将其暂存
3. 暂存后，在上方的输入框输入这次提交的描述信息，然后点击提交
4. 提交后可以源代码管理的右上角三个点的菜单中点击推送，或在左下角分支名右侧点击同步修改即可完成推送（同步修改也会将拉去远端库的分支）

* **暂存修改**



* **分支管理**

## github项目实现自动部署

>  需要使用github上的Actions功能，可以实现很多自动化的操作，这里只从构建 VitePress 站点并将其部署到GitHub Pages的方面去说

>  工作流是通过一个名为 `workflow` 的 YAML 文件来定义的。这个文件通常存放在仓库.github/workflows 目录下。
>
> 1. workflow （工作流程）：持续集成一次运行的过程，就是一个 workflow。
> 2. job （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
> 3. step（步骤）：每个 job 由多个 step 构成，一步步完成。
> 4. action （动作）：每个 step 可以依次执行一个或多个命令（action）。

* 需要在项目的目录中新建一个.github文件夹，并在其中新建一个工作流文件，比如新建一个deployRun.yml的文件
* 在github上对应仓库settings处左侧找到Page选项点击，Build and deployment里的Source选择Delay from a branch，并选择master分支
* 编写deployRun.yml文件(以下为构建 VitePress 站点并将其部署到GitHub Pages例子)

```yaml
name: Deploy VitePress

on:
  # 每当 push 到 master 分支时触发部署
  # push: 当有提交被推送到仓库时。
  # pull_request: 当有 Pull Request 被创建或更新时。
  # schedule: 根据定时计划执行。
  # release: 当创建了一个新的 Release 时。
  # workflow_dispatch: 允许手动触发工作流程。
  push:
    # 在针对 `master` 分支的推送上运行。如果你
    # 使用 `main` 分支作为默认分支，请将其更改为 `main`
    branches: [master]
    # 只在下列路径变更时触发
    paths:
      - 'docs/**'
      - 'package.json'
      - '.github/**'
  # 手动触发部署
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      # 拉取代码
      - name: Checkout
        uses: actions/checkout@v4
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0
      # 安装 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8
      # 设置 node 版本
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: pnpm
      # 此操作有助于支持从任何静态站点生成器部署到 GitHub Pages
      - name: Setup Pages
        uses: actions/configure-pages@v4
      # 安装依赖
      - name: Install dependencies
        run: pnpm install
      # 打包静态文件
      - name: Build
        run: pnpm docs:build
      # 上传工件
      # 此操作有助于支持从任何静态站点生成器部署到 GitHub Pages
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./docs/.vitepress/dist # 打包后的文件位置
  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        # 使用了deploy-pages动作的第4版本，这是专门用于将工件部署到GitHub Pages。
```

这样每次master分支有更新时，都会自动重新将项目进行部署到github pages里。

