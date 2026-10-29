# 风格：红布面笔记本（Red Notebook）

- 名称：`red-notebook`
- 默认：否（从「小红书市集·买手打榜赛」海报反推）
- 氛围：红色竖纹布面笔记本封面 + 白色纹理信纸内容页 + 银色回形针别签条装饰，文字直接排在纸面上，无浮层卡片
- 文字明暗：红封面 → 白字；白纸面 → 深棕黑字 + 红色强调

## 色板
| token | 值 | 用途 |
|---|---|---|
| 封面背景 | `url('media/bg-notebook-cover.jpg')` | 红色竖纹布面笔记本 |
| 内容页背景 | `url('media/bg-notebook-inner.jpg')` | 白色纹理信纸（带红色别签条） |
| `--accent` | `#B8281C` | 红色：kicker、序号、板块标题、分隔线 |
| `--ink` | `#2A2520` | 深棕黑：正文 |
| `--gray` | `#9A8E82` | 次要灰 |
| `--highlight` | `#E9B445` | 金色荧光笔（红底/白纸都搭） |

## 字体
- 封面大标题：京華老宋体 `assets/fonts/jinghua-songti.ttf`（@font-face）
- 中文正文/副标题：Noto Serif SC
- 英文/序号：Playfair Display
- kicker/标签/页脚：IBM Plex Mono
- 全局 `font-style:normal`

## 结构
- 画幅 1080×1440
- 封面：红布面背景，居中白字，kicker + 细线 + 京華老宋大标题 + 英文 + 副题
- 内容页：白纸背景，无浮层卡片，文字直接排在纸面上；`top:290px`（避开红色别签条）、`left/right:75px`、`bottom:70px`
- 板块标签用红色下划线分隔（无背景色块、无左条）
- 目录页（第二页）同内容页背景，TOC 条目用 `data-target` 关联内容页文件名

## 启用方式
```css
@font-face{font-family:'JinghuaSongti';src:url('assets/fonts/jinghua-songti.ttf') format('truetype');font-weight:400;}
.bg{position:absolute;inset:0;background:url('assets/media/bg-notebook-cover.jpg') center/cover no-repeat;}
/* 内容页 .bg 换 bg-notebook-inner.jpg */
:root{--accent:#B8281C;--ink:#2A2520;--gray:#9A8E82;--highlight:#E9B445;}
```
