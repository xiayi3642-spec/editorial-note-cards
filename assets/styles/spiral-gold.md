# 风格：鎏金漩涡（Spiral Gold）

- 名称：`spiral-gold`
- 默认：否（用户点名「鎏金漩涡」或给对应垫图/配色参考时启用）
- 氛围：金黑螺旋光学纹理垫图 + 深色罩层 + 奶油卡浮层 + 东京夜配色（朱红/蜜橙/浅褐/蓝灰/沥青墨）+ **封面标题宋体加粗（Didot 英文 + Noto Serif SC 中文）**
- 文字明暗：深金黑底罩深后 → 外层与封面文字统一白；奶油白卡内 → 沥青墨字

## 素材
- 背景图：`bg-spiral-gold.jpg`（金黑螺旋光学纹理，金/黑/红/蓝弧线，1456×1892）
- 封面字体：Didot（本地，英文显示）+ Noto Serif SC 宋体加粗（远程，中文大标题）

## 色板（取自东京夜参考卡）
| token | 值 | 用途 |
|---|---|---|
| 背景 | `url(bg-spiral-gold.jpg) center/cover` + 深罩层 `linear-gradient(180deg,rgba(18,12,8,.60),rgba(44,28,16,.35),rgba(16,12,8,.55))` | 画布底 |
| `--accent` | `#F1444E` | Vermillion 朱红：kicker、序号、卡片边框、lead 强调 |
| `--accent-bright` | `#FFAE81` | Honeydew 蜜橙：英文副题 `.sub` |
| `--ink` | `#212934` | Asphalt 沥青墨：正文与标题 |
| `--gray` | `#8A8E98` | 次要灰 |
| `--cream` | `#F7EEE6` | 奶油白卡底 |
| `--edge` | `#C43A43` | 朱红深调：卡片边框 |
| `--highlight` | `#FFF200` | 荧光黄（正文重点短语荧光笔） |

## 荧光笔
- 颜色：`#FFF200`（荧光黄）——用户统一偏好，经典高亮黄
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
- 卡片 `top:190px / bottom:136px`；卡内顶部三处间距 h1 34 / sub 8 / body 16
- 封面：垫图铺满 + 深罩层，Didot 英文句 + 宋体加粗中文大标题 + 底部三英文词；封面可用 text-shadow
- 内容卡：奶油卡浮在垫图上，foot 吸底

## PDF 导出注意
- 封面文件名含 `cover`，`html2pdf.mjs` 自动走整页 2x 截图位图路径，text-shadow 无矩形块风险

## 启用方式
封面（`cover-spiral-gold.html`）：
```css
.bg{background:url('../media/bg-spiral-gold.jpg') center/cover no-repeat;}
.veil{background:linear-gradient(180deg,rgba(18,12,8,.60),rgba(44,28,16,.35),rgba(16,12,8,.55));}
```
内容页：
```css
.bg{background:url('../media/bg-spiral-gold.jpg') center/cover no-repeat;}
:root{--accent:#F1444E;--accent-bright:#FFAE81;--ink:#212934;--gray:#8A8E98;--cream:#F7EEE6;--edge:#C43A43;--highlight:#FFF200;}
```
