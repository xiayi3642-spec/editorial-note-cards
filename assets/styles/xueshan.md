# 风格：雪山（可选风格）

- 名称：`xueshan`
- 默认：否（用户上传蓝底雪山纹理参考图，或点名「雪山」时使用）
- 来源参考：富春雪岭越野赛海报背景——深蓝颗粒纹理 + 青绿山体剪影 + 底部白色雪山线稿
- 氛围：冷峻山野 —— 深蓝噪点底图 `media/bg-xueshan.jpg`，上部青绿山脊渐变，底部白色雪山线稿；内容卡浮层为冷白，配深蓝墨字与嫩绿点缀
- 文字明暗：**深底白字外层**；内容卡浅底 → 深蓝墨字

## 色板（按 7:2:1 + 从参考图取色）
| token | 值 | 用途 |
|---|---|---|
| 背景垫图 | `url('../media/bg-xueshan.jpg') center/cover` | 画布底（深蓝纹理+山体+雪山线稿） |
| `--accent` | `#4B6803` | 深苔绿强调（kicker、序号、lead 强调、quote 边、卡片边） |
| `--ink` | `#1E3A6E` | 正文深蓝（卡内浅底深字） |
| `--gray` | `#6B7FA8` | 次要灰（蓝灰） |
| `--cream` | `#F3F6F3` | 卡片底（Baby Powder 灰白微绿） |
| `--edge` | `#4B6803` | 卡片深苔绿细边 |
| `--highlight` | `#C8E660` | 正文重点短语的浅绿荧光笔底色 |
| 外层文字/描边 | 白 `#fff` / `rgba(255,255,255,.4~.9)` | 深底白字 |

## 字体栈
- 与 `green-editorial` 相同：Noto Serif SC / Playfair Display / IBM Plex Mono / Noto Sans SC；全局去斜体

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框、卡片位置 top:190/bottom:136、三处间距 h1:34/sub:24/body:16、foot 吸底等均同 `green-editorial`
- 背景使用垫图 `media/bg-xueshan.jpg`（与 cover-spring 同方式：`.bg{background:url(...)}`）
