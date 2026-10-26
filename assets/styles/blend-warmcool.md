# 风格：冷暖交融（Blend Warm &amp; Cool）

- 名称：`blend-warmcool`
- 默认：否（用户点名「冷暖交融」或给对应垫图/配色参考时启用）
- 氛围：冷暖交融圆斑垫图（暖粉/珊瑚 + 青绿/蓝紫）+ 深罩层 + 奶油卡浮层 + 居酒屋霓虹配色（酒红/中国红/萨摩橙/月黄/钴蓝）+ **封面标题宋体加粗（Didot 英文 + Noto Serif SC 中文）**
- 文字明暗：暖色垫图罩深后 → 外层与封面文字统一白；奶油白卡内 → 深酒红墨字

## 素材
- 背景图：`bg-blend-warmcool.jpg`（冷暖交融圆斑，珊瑚/暖粉 + 青绿/蓝紫，1441×1873）
- 封面字体：Didot（本地，英文显示）+ Noto Serif SC 宋体加粗（远程，中文大标题）

## 色板（居酒屋霓虹参考卡）
| token | 值 | 用途 |
|---|---|---|
| 背景 | `url(bg-blend-warmcool.jpg) center/cover` + 深罩层 `linear-gradient(180deg,rgba(22,24,16,.62),rgba(38,44,28,.38),rgba(14,16,10,.56))` | 画布底 |
| `--accent` | `#970A12` | Chinese Red 中国红：kicker、序号、卡片边框、lead 强调 |
| `--accent-bright` | `#D1601F` | Satsuma 萨摩橙：英文副题 `.sub` |
| `--ink` | `#3A0F13` | 深酒红：正文与标题 |
| `--gray` | `#8C6E67` | 次要灰 |
| `--cream` | `#FAF6E8` | 奶油白卡底 |
| `--edge` | `#70191D` | Burgundy 酒红：卡片边框 |
| `--highlight` | `#5686BB` | Cobalt 钴蓝（正文重点短语荧光笔，用户点名蓝色） |

## 荧光笔
- 颜色：`#5686BB`（钴蓝）——酒红主色的冷色对比（用户点名蓝色）
- 样式：沿用定稿（厚 .70em、top:calc(30% + 3px)、opacity:.4、微旋转 -.35deg）

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线，卡内正文）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- **封面大标题：Didot（英文显示）+ Noto Serif SC 宋体加粗（中文）**
- 全局 `font-style:normal`

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/bot`，罩层上白框白字
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 8 / body 16（标题→英文副题 8px）
- 封面：垫图铺满 + 深罩层，Didot 英文句 + 宋体加粗中文大标题 + 底部三英文词；封面可用 text-shadow
- 内容卡：模块标题为**下划线式表头**（无罗马序号、无浅黄标签、无竖线），奶油卡浮在垫图上，foot 吸底
- 内容页默认无罗马序号（`.sec .lbl` 仅 `.t` 标题 + `.an` 注解）

## PDF 导出注意
- 封面文件名含 `cover`，`html2pdf.mjs` 自动走整页 2x 截图位图路径，text-shadow 无矩形块风险

## 启用方式
封面（`cover-blend-warmcool.html`）：
```css
.bg{background:url('../media/bg-blend-warmcool.jpg') center/cover no-repeat;}
.veil{background:linear-gradient(180deg,rgba(22,24,16,.62),rgba(38,44,28,.38),rgba(14,16,10,.56));}
```
内容页：
```css
.bg{background:url('../media/bg-blend-warmcool.jpg') center/cover no-repeat;}
:root{--accent:#970A12;--accent-bright:#D1601F;--ink:#3A0F13;--gray:#8C6E67;--cream:#FAF6E8;--edge:#70191D;--highlight:#5686BB;}
```
