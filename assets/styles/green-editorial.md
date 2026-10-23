# 风格：Editorial 绿色（默认风格）

- 名称：`green-editorial`
- **默认**：是（用户不给参考图时自动使用）
- 氛围：Editorial 杂志风 —— 深绿渐变底 + 外层白框 + 奶油白卡片浮层 + 衬线字体
- 文字明暗：**深底 → 封面与外层文字用白色**

## 色板
| token | 值 | 用途 |
|---|---|---|
| 背景渐变 | `linear-gradient(180deg,#5E8F43 0%,#69A24D 25%,#C8D8A0 65%,#F4EED0 100%)` | 画布底 |
| `--green` | `#5a8c3f` | 强调（kicker、序号、lead、pull-quote 边） |
| `--ink` | `#292A19` | 正文墨绿黑 |
| `--gray` | `#7a7a6a` | 次要灰 |
| `--cream` | `#FAF6E8` | 奶油卡底（偏白不偏黄） |
| `--edge` | `#4a7c3a` | 卡片深绿细边 |
| 白 | `#fff` / `rgba(255,255,255,.9)` | 封面文字、外层框文字与边框（`rgba(255,255,255,.5)`） |

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono（letter-spacing .1–.28em）
- 顶部栏：Noto Sans SC
- 全局 `font-style:normal`（去斜体）

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/.bot`
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 24 / body 16
- 封面无卡片浮层、无圆圈装饰、居中；内容卡 foot 吸底
