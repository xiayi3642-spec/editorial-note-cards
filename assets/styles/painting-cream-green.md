# 风格：奶油绿油画（Painting Cream Green）

- 名称：`painting-cream-green`
- 默认：否（用户指定素材后启用）
- 氛围：印象派油画笔触底（黄绿蓝白斑驳厚涂）+ 奶油白卡片浮层 + 深墨绿回文明朝体大标题 + 卡罗莱纳蓝荧光笔
- 文字明暗：浅油画底 → 外层与封面文字用深墨绿；奶油白卡内 → 森林墨绿字

## 素材
- 背景图：`bg-painting.jpg`（印象派油画笔触，黄绿蓝白柔和交织，1773×2364）

## 色板
| token | 值 | 用途 |
|---|---|---|
| 背景 | `url(bg-painting.jpg) center/cover` | 画布底（不使用渐变） |
| `--accent` | `#1D6517` | 皇家绿：kicker、序号、卡片边框、板块分隔线 |
| `--accent-bright` | `#79B425` | 亮柠檬绿：英文副题 `.sub` |
| `--ink` | `#054204` | 森林墨绿：正文与标题 |
| `--gray` | `#6B8060` | 次要灰 |
| `--cream` | `#FAF6E8` | 奶油白卡片底 |
| `--edge` | `#1D6517` | 卡片边框（同 accent） |
| `--highlight` | `#55A6C3` | 卡罗莱纳蓝荧光笔（正文重点短语） |

## 荧光笔（本风格专属）
- 颜色：`#55A6C3`（卡罗莱纳蓝）——森林绿主色的冷色对比
- 样式：沿用 chunhe 最新版（厚 .70em、top:calc(30% + 3px)、opacity:.4、微旋转 -.35deg）
- CSS 覆盖：
  ```css
  :root{--highlight:#55A6C3;}
  .hl::after{top:calc(30% + 3px);height:.70em;opacity:.4;}
  ```

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- 封面大标题：Huiwen 回文明朝体（`fonts/Huiwen-mincho.otf`）
- 全局 `font-style:normal`

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/bot`，描边用 `rgba(5,66,4,.5)`（浅底深框）
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 24 / body 16
- 封面：背景油画图铺满，居中回文明朝体大标题 + 英文副句 + 细短线 + 底部三英文词；**封面禁用 text-shadow**（PDF 矢量打印会被 iPad 阅读器误显示为矩形块）
- 内容卡：奶油白卡片浮在油画底上，foot 吸底

## PDF 导出注意
- 本风格封面必须走 `html2pdf.mjs` 的截图模式（文件名含 cover 自动识别），整页 2x 位图嵌 PDF，杜绝 text-shadow 矩形块问题
- 内容页继续走 page.pdf() 矢量打印

## 启用方式
HTML 头部：
```css
.bg{background:url('../media/bg-painting.jpg') center/cover no-repeat;}
:root{--accent:#1D6517;--accent-bright:#79B425;--ink:#054204;--gray:#6B8060;--cream:#FAF6E8;--edge:#1D6517;--highlight:#55A6C3;}
```
