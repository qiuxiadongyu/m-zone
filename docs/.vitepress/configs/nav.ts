///docs/.vitepress/configs/nav.ts
// 导航栏
import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    { text: '首页', link: '/' },
    { text: 'webRTC', link: '/webrtc/index' },
    { text: 'vscode插件', link: '/vscode-plugin/index' }
]