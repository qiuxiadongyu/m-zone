

# pkg打包exe（简单脚本制作）

>  记录使用pkg打包将一个js打包成exe的过程

在一次项目开发中有些重复的部署前的修改操作比较繁琐（包括根据特定逻辑更新修改压缩包中的文件，解压压缩包替换，最后将其打成tar.gz），所以想直接用弄成一个脚本

* 全局安装pkg

```
npm install -g pkg@latest
```

* 编写项目代码

此处编写根据需求编写，这里直接新建了个空项目，然后在app.js下编写对应的逻辑（此处省略业务代码）

* 修改package.json

package.json的script中加入调试命令：

```
"start": "node app.js",
"build": "pkg app.js --targets node18-win-x64",
```

* 调试打包

调试时：`pnpm start`

打包时：`pnpm build`

> 注意：因为网络原因可能后续可能会出现拉取对应的node包无法拉取的情况，可以直接下载放入本地缓存中使用
>
> 解决办法：找到c盘用户目录下的.pkg-cache文件夹，把对应版本的node包放进去，然后重新打包即可。 node包下载地址：https://github.com/vercel/pkg-fetch/releases 例子： 下载对应的包（node-v18.5.0-win-x64）后将其改名为fetched-v18.5.0-win-x64，放于路径 `C:\Users\用户名\.pkg-cache\v3.4` (具体路径看报错提示中的tag)

打包后可以在项目目录下有一个新的app.exe文件，双击即可执行app.js中的代码

# electron项目（桌面端应用）

> 记录使用electron快速搭建一个桌面端应用

* 项目安装electron和electron build

项目中新增.npmrc文件

```
strict-ssl = false
# electron_mirror = https://npm.taobao.org/mirrors/electron/
# registry=https://registry.npmmirror.com/
electron_mirror=https://registry.npmmirror.com/-/binary/electron/
electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/
# ELECTRON_BUILDER_BINARIES_MIRROR=https://mirrors.huaweicloud.com/electron-builder-binaries/
```

安装依赖

```
pnpm install -D electron
pnpm install -D electron-builder
```

* 编写main.js（用于打开可视化窗口）

```
// src-electron/main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { join } = require('path')

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {    
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,  // 确保显示窗口边框
        autoHideMenuBar: true,  // 隐藏菜单栏
        alwaysOnTop: true,//置顶
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadURL('http://localhost:3000')
    development模式
    if(process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        // 开启调试台
        // win.webContents.openDevTools()
    }else {
        win.loadFile(join(__dirname, '../dist/index.html'))
    }
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

```

* package.json中进行相关的配置（仅作参考）

```
"main": "./src-electron/main.js",
"scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build && electron-builder",
    "preview": "vite preview",
    "electron:build": "vite build && electron-builder"
  },
"build": {
    "appId": "com.meyle.app",
    "productName": "electron-test-tool",
    "directories": {
      "output": "release"
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64"
          ]
        }
      ],
      "icon": "public/icon.ico",
      "signingHashAlgorithms": null,
      "sign": null
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  },
  "description": "Electron Desktop Tool Application",
  "author": {
    "name": "meryle",
    "email": "your.email@example.com"
  }
```



