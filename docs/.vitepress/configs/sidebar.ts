///docs/.vitepress/configs/sidebar.ts
// 侧边栏部分
import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/webrtc/': [
        {
            text: '简介',
            link: '/webrtc/index'
        },
        {
            text: '实践经验',
            collapsed: false,
            items: [
                {
                    text: 'vitepress搭建相关',
                    link: '/webrtc/front-knowledge/vitepress-text'
                },
                {
                    text: 'git相关',
                    link: '/webrtc/front-knowledge/git-text'
                },
                {
                    text: '截图相关',
                    link: '/webrtc/front-knowledge/screenshot'
                }
            ]
        },
    ],
    '/other/': [
        {
            text: '简介',
            link: '/ohter/index'
        },
        {
            text: 'ohter',
            collapsed: false,
            items: [
                {
                    text: 'index', 
                    link: '/ohter/index' 
                }
            ]
        }
    ]
}