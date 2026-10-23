# 风格：午夜幻影·蓝（可选风格）

- 名称：`gradient-midnight`
- 默认：否（用户给蓝/浅青系渐变参考图，或点名「午夜幻影」时使用）
- 来源参考色：`#4A53FF`（深蓝）、`#ACFFFF`（浅青白）—— 原图 01 Midnight Mirage
- 氛围：深邃蓝调 —— 左上深蓝 → 右下浅青白 对角渐变 + 奶油卡浮层，与绿色 Editorial 同构
- 文字明暗：**深色在左上/顶部 → 顶部外层文字与描边用白；底部浅区页脚用深色；内容卡浅底 → 正文用深色**

## 色板（按 7:2:1 + 同色系延伸）
| token | 值 | 用途 |
|---|---|---|
| 背景对角渐变 | `linear-gradient(to bottom right,#4A53FF 0%,#6F7DFF 40%,#8FBFFF 70%,#ACFFFF 100%)` | 画布底，左上深→右下浅 |
| `--accent` | `#4A53FF` | 深蓝强调（kicker、序号、lead、quote 边） |
| `--ink` | `#1F2B6E` | 正文深蓝（卡内浅底深字） |
| `--gray` | `#7A86B0` | 次要灰 |
| `--cream` | `#F3F9FF` | 卡片底（偏浅青白） |
| `--edge` | `#4A53FF` | 卡片蓝细边 |
| 外层文字/描边 | 白 `#fff` / `rgba(255,255,255,.5~.9)` | 左上/顶部深区白；左下浅区页脚用 `#1F2B6E` |

## 字体栈
- 与 `green-editorial` 相同：Noto Serif SC / Playfair Display / IBM Plex Mono / Noto Sans SC；全局去斜体

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框、卡片位置、三处间距、foot 吸底等均同 `green-editorial`
