# 风格：紫色雪山（Purple Snow Mountain）

- 名称：`xueshan-purple`
- 默认：否（用户点名「紫色雪山」「紫雪山」时使用）
- 来源：由用户上传的野雪赛事海报背景试排沉淀而来（`trial-snow` 示例）；黑紫渐变泼墨 + 雪山插画
- 氛围：冷峻夜雪 —— 黑紫泼墨纹理底图 `media/bg-xueshan-purple.jpg`（封面）/ `media/bg-xueshan-purple-inner.jpg`（内容页），底部带积雪雪山插画；内容卡浮层为奶油白，配深紫墨字与淡紫点缀
- 文字明暗：**深底白字外层**；内容卡浅底 → 深紫黑字

## 素材
- 封面垫图：`media/bg-xueshan-purple.jpg`（黑紫泼墨 + 雪山插画，深色）
- 内容页垫图：`media/bg-xueshan-purple-inner.jpg`（同系深紫渐变，深色）
- 封面字体：`fonts/Huiwen-mincho.otf`（回文明朝体大标题）+ `fonts/Didot.ttf`（英文衬线）

## 色板（按 7:2:1 + 从参考图取色）
| token | 值 | 用途 |
|---|---|---|
| 背景垫图 | `url('../media/bg-xueshan-purple.jpg') center/cover` | 画布底（黑紫泼墨+雪山） |
| `--acc` | `#B9A6FF` | 淡紫强调（kicker、序号、lead 强调、quote 边） |
| `--ink` | `#2A2438` | 正文深紫黑（卡内浅底深字） |
| `--gray` | `#8A8399` | 次要灰（紫灰） |
| `--cream` | `#FAF6E8` | 卡片底（奶油白，定稿沿用） |
| `--edge` | `#8B7BD8` | 卡片紫细边 |
| `--highlight` | `#FFD84D` | 正文重点荧光笔底色（暖黄，非默认荧光黄） |
| 强调深紫 | `#6B5BD0` | lead 中 b 加粗、cl 缩写的深紫 |
| 封面序号 | `#C9B8FF` | 封面板块序号（Playfair Display） |
| 外层文字/描边 | 白 `#fff` / `rgba(255,255,255,.3~.94)` | 深底白字 |

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- 封面大标题：`Huiwen`（回文明朝体，@font-face 引入本地 otf）
- 全局 `font-style:normal`（去斜体）

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/.bot`
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 8 / body 16
- 封面：黑紫垫图铺满 + 外层框 + 居中白字大标题 + 板块列表（`.views`）
- 内容卡：奶油卡片浮在深紫垫图上，foot 吸底

## 封面版式要点（区别于默认 cover-template）
- 封面不使用白色流线 ribbon，改用「top 英文小字 + 分隔线 + 居中大标题 + 三行板块列表」结构
- 大标题字号按字数自适应（≤4字 112px、5–6字 96px、7字 84px、8–9字 76px、≥10字 68px 并自动换行），模板已内置规则

## 启用方式
HTML 头部引入：
```html
@font-face{font-family:'Huiwen';src:url('../fonts/Huiwen-mincho.otf') format('opentype');}
@font-face{font-family:'Didot';src:url('../fonts/Didot.ttf') format('truetype');}
```
`.bg` 改为 `background:url('../media/bg-xueshan-purple.jpg') center/cover no-repeat;`（封面）/ `url('../media/bg-xueshan-purple-inner.jpg')`（内容页）
