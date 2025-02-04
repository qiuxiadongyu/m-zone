///docs/.vitepress/configs/nav.ts
// 顶部导航栏
import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    { text: '首页', link: '/' },
    { text: '前端相关', link: '/webrtc/index' },
    { text: '其他', link: '/other/index' }
]