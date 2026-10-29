# 风格：小红书浅蓝便签（XHS Potato / Light Blue Note）

- 名称：`xhs-patato`
- 默认：否（从「未来薯地计划」邀约书视觉反推）
- 氛围：浅蓝竖条纹信纸底 + 白色便签卡片浮层 + 深棕红宋体大标题 + 亮蓝/kicker + 暖棕描边徽章，整体像小红书未成年人模式的邀请便签
- 文字明暗：浅蓝底 → 外层与封面文字用亮蓝 `#1D6FB8`；白卡内 → 深灰蓝正文 `#2C3E50`、深棕红标题 `#5C2A1E`

## 色板
| token | 值 | 用途 |
|---|---|---|
| 背景 | `repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 2px, transparent 2px 16px), linear-gradient(180deg,#EAF4FB 0%,#D6EAF8 100%)` | 浅蓝竖条纹信纸 |
| `--accent` | `#1D6FB8` | 亮蓝：kicker、序号、外框、quote 细边框、外层页眉 |
| `--accent2` | `#9A5320` | 暖棕：英文副题、数据数字、徽章描边、强调 b |
| `--ink` | `#2C3E50` | 深灰蓝：正文 |
| `--title` | `#5C2A1E` | 深棕红：h1 / 板块标题 |
| `--gray` | `#60707E` | 次要灰 |
| `--cream` | `#FBFEFF` | 白便签卡底 |
| `--edge` | `#7EC3F5` | 卡片浅蓝细边 |
| `--highlight` | `#FFE066` | 暖黄荧光笔（与浅蓝冷底互补，opacity .55） |

## 荧光笔
- 颜色：`#FFE066` 暖黄——浅蓝主色的对比色，opacity 提到 .55（因浅底偏冷，.4 会透不出来）
- 样式：沿用全局（厚 .70em、top:calc(30% + 3px)、微旋转 -.35deg）

## 字体栈
- 中文正文/标题：Noto Serif SC（宋体衬线）
- 英文大标题/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 顶部栏：Noto Sans SC
- 全局 `font-style:normal`

## 结构（与所有风格共用，勿改）
- 画幅 1080×1440；外层框 `inset:24px` + `.t1/rule/.t2/bot`，描边用 `rgba(29,111,184,.45)`（浅底蓝框，不用默认白框）
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 8 / body 16
- 封面（复刻原版邀约书版式）：底图 `media/bg-patato.jpg`（去文字手绘花纹）；顶部红色胶囊 logo（#FF2442）→ 黄色月牙括号 + 暖棕小行文案 → 深棕红超粗大字分两行（l1 200px / l2 240px）→ 蓝色方括号「」与星号 * 作为装饰 → 邮戳式蓝框（四角小方块）内暖棕「共建邀约书」→ Playfair 暖棕 INVITATION 英文。不使用默认 Editorial 居中 kicker/短线结构。
- 内容卡：白便签浮在浅蓝竖条纹上，板块标签用蓝色下划线分隔（无背景色块、无左条）；数据块可用暖黄虚线框；分类网格最后一项跨两列用暖黄底强调

## 启用方式
HTML 头部：
```css
.bg{background:repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 2px, transparent 2px 16px), linear-gradient(180deg,#EAF4FB 0%,#D6EAF8 100%);}
:root{--accent:#1D6FB8;--accent2:#9A5320;--ink:#2C3E50;--title:#5C2A1E;--gray:#60707E;--cream:#FBFEFF;--edge:#7EC3F5;--highlight:#FFE066;}
.frame{border-color:rgba(29,111,184,.45);}
.t1,.t2{color:#1D6FB8;}
```
