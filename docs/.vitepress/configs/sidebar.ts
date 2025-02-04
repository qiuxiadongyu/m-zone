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
            text: 'webrtc',
            collapsed: false,
            items: [
                {
                    text: 'index',
                    link: '/webrtc/index'
                }
            ]
        }
    ],
    '/other/': [
        {
            text: '简介',
            link: '/webrtc/index'
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