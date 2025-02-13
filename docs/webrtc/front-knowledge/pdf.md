# PDF相关
> 在开发过程中遇到需要将移动端WebView前端预览PDF与生成PDF需求这里记录一下实现过程

## PDF预览

## PDF生成

**jspdf**

添加字体

**pdfmake**

> 中文文档（非官方）：[PDFMake-doc-CN](https://oct1a.github.io/pdfmake-docs/#/)



添加字体

> 小坑：生成的vfs_fonts.js需要和pdfmake版本对应，否则可能出现不兼容的情况，因为`pdfmake@0.2.x` 的旧版本中，没有 `addVirtualFileSystem` 方法，而 `0.3.x+`版本中打包出来的 `vfs_fonts.js` 中pdfmake.vfs 通过`addVirtualFileSystem` 赋值
>
> - 旧版本（如 `0.2.x`）通过 `pdfMake.vfs` 直接赋值。
> - 新版本（如 `0.3.x+`）通过 `pdfMake.addVirtualFileSystem(vfs)` 动态注入。
>
> 解决方法：使用对应的pdfmake和vfs_fonts.js或者修改打包出来的vfs_fonts.js，将最后的赋值改为`if (typeof window !== 'undefined' && window.pdfMake) {window.pdfMake.vfs = vfs;}`