# 风格：黄青蓝渐变（可选风格）

- 名称：`gradient-yellow-cyan`
- 默认：否（用户给黄/青蓝系渐变参考图，或点名「黄青蓝」时使用）
- 来源参考色：`#FFE28D`（浅黄）、`#21A7CF`（青蓝）、`#D4FEFA`（浅青）
- 氛围：明快清爽 —— 浅黄→浅青→青蓝 **对角渐变**（左下浅→右上深）+ 奶油卡浮层
- 文字明暗：**外层文字与描边固定白色**；内容卡白底 → 正文用深色

## 色板（按 7:2:1 + 同色系延伸）
| token | 值 | 用途 |
|---|---|---|
| 背景对角渐变 | `linear-gradient(to top right,#FFE28D 0%,#EFF7D8 25%,#D4FEFA 55%,#8FDBE6 78%,#21A7CF 100%)` | 画布底，左下浅→右上深（同色系延伸 5 阶） |
| `--accent` | `#21A7CF` | 青蓝强调（kicker、序号、lead、quote 边） |
| `--ink` | `#0E6C8C` | 正文深青蓝（卡内白底深字；参考色偏亮，取同系深档保证可读） |
| `--gray` | `#7FB3C7` | 次要灰 |
| `--cream` | `#FFFDF4` | 卡片底（偏黄白） |
| `--edge` | `#21A7CF` | 卡片青蓝细边 |
| 外层文字/描边 | 白 `#fff` / `rgba(255,255,255,.5~.9)` | 固定白色（frame/t1/t2/bot/rule/foot） |
| 封面文字 | 白 `#fff` | 渐变上白字 |

## 字体栈
- 与 `green-editorial` 相同：Noto Serif SC / Playfair Display / IBM Plex Mono / Noto Sans SC；全局去斜体

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框、卡片位置、三处间距、foot 吸底等均同 `green-editorial`
