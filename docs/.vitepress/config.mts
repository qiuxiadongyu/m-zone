//.vitepress/config.mts
import { defineConfig } from 'vitepress'
import { sidebar, nav } from './configs'
export default defineConfig({
    title: 'M-ZONE', //标题
    description: '开发日常使用中所用到的日常提效工具、插件等', //描述
    lang: 'zh-CN', //语言类型
    lastUpdated: true, //最近更新时间
    cleanUrls: true, //VitePress 将从 URL 中删除尾随.html
    base: '/m-zone/',
    /* markdown 配置 */
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        logo: '/logo.png', //显示在导航栏中网站标题之前的徽标文件。接受路径字符串或对象来为亮/暗模式设置不同的徽标。
        nav,
        sidebar,
        /* 右侧大纲配置 */
        outline: {
            level: 'deep',
            label: '本页目录'
        },
        docFooter: {
            //文档页脚
            prev: '上一篇',
            next: '下一篇'
        },
        socialLinks: [
            //显示带有图标的社交帐户链接
            { icon: 'github', link: 'https://github.com/qiuxiadongyu' },
            { icon: 'facebook', link: 'https://github.com/qiuxiadongyu' },
            { icon: 'twitter', link: 'https://github.com/qiuxiadongyu' },
            { icon: 'youtube', link: 'https://github.com/qiuxiadongyu' },
        ],
        darkModeSwitchLabel: '模式', //可用于自定义深色模式开关标签。该标签仅显示在移动视图中。
        lastUpdatedText: '上次更新', //上次更新文案
        // 本地搜索
        search: {
            provider: 'local'
        },
        footer: { //页脚
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2019-present yx'
        },
    }
    //.vitepress/config.mts
})