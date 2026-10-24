# 风格：春和景明（Chunhe Jingming）

- 名称：`chunhe-jingming`
- 默认：否（用户指定素材后启用）
- 氛围：春日绿模糊底 + 奶油卡片浮层 + 大衬线标题 + 粉色斜手写体点缀
- 文字明暗：深绿底 → 外层与封面文字用白色；奶油卡内 → 墨绿黑字

## 素材
- 背景图：`bg-chunhe.png`（绿色横向运动模糊，上浅绿下深绿带暖黄尾调）
- 手写体：`Stay-Dreaming.otf`（粉色斜向 script，用于封面英文点缀）

## 色板
| token | 值 | 用途 |
|---|---|---|
| 背景 | `url(bg-chunhe.png) center/cover` | 画布底（不使用渐变） |
| `--green` | `#5a8c3f` | 强调（kicker、序号、lead、pull-quote 边） |
| `--ink` | `#292A19` | 正文墨绿黑 |
| `--gray` | `#7a7a6a` | 次要灰 |
| `--cream` | `#FAF6E8` | 奶油卡底 |
| `--edge` | `#4a7c3a` | 卡片深绿细边 |
| `--highlight` | `#E9B445` | 正文重点荧光笔底色（琥珀金，非默认荧光黄） |
| 粉手写 | `#f4a8c0` | 封面斜向 script 英文 |
| 白 | `#fff` / `rgba(255,255,255,.9)` | 封面与外层框文字 |

## 荧光笔覆盖（本风格专属）
- 颜色：`#E9B445`（琥珀金），替换默认 `#FFF200`
- 高度：字高的 **70%**（`height:.70em`）
- top 位置：`top:calc(30% + 3px)`，色块在文字下半部分 70% 基础上再下移 3px
- 透明度：`opacity:.4`（40%），色块半透明透字
- CSS 覆盖：
  ```css
  :root{--highlight:#E9B445;}
  .hl::after{top:calc(30% + 3px);height:.70em;opacity:.4;}
  ```

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- 封面斜手写：`Stay Dreaming`（@font-face 引入本地 otf，rotate(-9deg)）
- 全局 `font-style:normal`（去斜体；手写体本身是 script 字形不算斜体）

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/.bot`
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 24 / body 16
- 封面：背景图铺满，居中大衬线中文标题 + 粉色斜手写英文叠层 + 副题字距拉开
- 内容卡：奶油卡片浮在背景图上，foot 吸底

## 启用方式
HTML 头部引入：
```html
@font-face{font-family:'Stay Dreaming';src:url('Stay-Dreaming.otf') format('opentype');}
```
`.bg` 改为 `background:url('bg-chunhe.png') center/cover no-repeat;`
