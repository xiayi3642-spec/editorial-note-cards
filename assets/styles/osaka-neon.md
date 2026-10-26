# 风格：大阪霓虹（Osaka Neon）

- 名称：`osaka-neon`
- 默认：否（用户点名「大阪霓虹」或给对应垫图/配色参考时启用）
- 氛围：暖黄螺旋光学纹理垫图 + 深酒红罩层 + 奶油卡浮层 + 居酒屋霓虹配色（酒红/中国红/萨摩橙/月黄/钴蓝）+ **封面标题宋体加粗（Didot 英文 + Noto Serif SC 中文）**
- 文字明暗：暖黄底罩深后 → 外层与封面文字白 / 月黄；奶油白卡内 → 深酒红墨字

## 素材
- 背景图：`bg-izakaya.jpg`（暖黄螺旋光学纹理，黄/红/蓝/黑颗粒，1410×1833）
- 封面字体：Didot（本地，英文显示）+ Noto Sans SC 黑体（远程，中文大标题）——**明确不用 Huiwen 明朝体 / Noto Serif SC 宋体**

## 色板
| token | 值 | 用途 |
|---|---|---|
| 背景 | `url(bg-izakaya.jpg) center/cover` + 深酒红罩层 `linear-gradient(180deg,rgba(16,5,7,.60),rgba(54,12,15,.30),rgba(20,6,8,.55))` | 画布底（不使用纯渐变） |
| `--accent` | `#970A12` | Chinese Red 中国红：kicker、序号、卡片边框、板块分隔线、lead 强调 |
| `--accent-bright` | `#D1601F` | Satsuma 萨摩橙：英文副题 `.sub` |
| `--ink` | `#3A0F13` | 深酒红：正文与标题 |
| `--gray` | `#8C6E67` | 次要灰 |
| `--cream` | `#FBF1E3` | 暖奶油卡底 |
| `--edge` | `#70191D` | Burgundy 酒红：卡片边框 |
| `--highlight` | `#FFF200` | 荧光黄（正文重点短语荧光笔） |
| 封面霓虹 | `#FECD6D` | Lunar Yellow 月黄：封面英文句、byline、顶部/底部词 |

## 荧光笔（本风格专属）
- 颜色：`#FFF200`（荧光黄）——用户点名，经典高亮黄，与暖奶油卡底对比充足
- 样式：沿用定稿（厚 .70em、top:calc(30% + 3px)、opacity:.4、微旋转 -.35deg）
- CSS 覆盖：
  ```css
  :root{--highlight:#FFF200;}
  .hl::after{top:calc(30% + 3px);height:.70em;opacity:.4;}
  ```

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线，卡内正文）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- **封面大标题：Didot（英文显示）+ Noto Serif SC 宋体加粗（中文）——封面用宋体**
- 全局 `font-style:normal`

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/bot`，罩层上白框白字
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 8 / body 16
- 封面：垫图铺满 + 深酒红罩层，Didot 英文句 + 黑体中文大标题 + 底部三英文词；封面可用 text-shadow（渲染走截图路径，PDF 无矩形块问题）
- 内容卡：暖奶油卡浮在垫图上，foot 吸底

## PDF 导出注意
- 封面文件名含 `cover`，`html2pdf.mjs` 自动走整页 2x 截图位图路径，text-shadow 无矩形块风险

## 启用方式
封面（`cover-izakaya.html`）：
```css
.bg{background:url('../media/bg-izakaya.jpg') center/cover no-repeat;}
.veil{background:linear-gradient(180deg,rgba(16,5,7,.60),rgba(54,12,15,.30),rgba(20,6,8,.55));}
```
内容页：
```css
.bg{background:url('../media/bg-izakaya.jpg') center/cover no-repeat;}
:root{--accent:#970A12;--accent-bright:#D1601F;--ink:#3A0F13;--gray:#8C6E67;--cream:#FBF1E3;--edge:#70191D;--highlight:#FFF200;}
```
