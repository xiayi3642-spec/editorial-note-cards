# Editorial 竖版笔记卡 · 设计规范（定稿）

画幅 **1080 × 1440（3:4 竖版）**。封面与内容页共用一套外层框，内嵌奶油卡片承载内容。**结构固定、色板可变**：色板默认绿色，用户给参考图时按「色板反推」整体替换。

## 全局
- 背景：`linear-gradient(180deg,#5E8F43 0%,#69A24D 25%,#C8D8A0 65%,#F4EED0 100%)`
- 字体（远程）：`<link rel="stylesheet" href="https://miaoda.feishu.cn/fonts/css2?family=Playfair+Display:wght@500&family=Noto+Serif+SC:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap">`
  - 中文正文/标题：Noto Serif SC（宋体衬线）
  - 英文大标题/序号：Playfair Display
  - kicker/标签/页脚：IBM Plex Mono（letter-spacing .1–.28em）
  - 顶部栏：Noto Sans SC
- **全局 `font-style:normal`（禁止斜体）**，含序号 `.no`、英文副题、pull-quote。

## 色板（默认风格 green-editorial）
> 默认风格完整定义见 `assets/styles/green-editorial.md`。风格库 `assets/styles/` 支持切换：无参考图时用默认 `green-editorial`；给参考图时按下方「色板反推」覆盖；点名风格名时用对应风格文件。

| token | 值 | 用途 |
|---|---|---|
| `--green` | `#5a8c3f` | 强调绿（kicker、序号、lead 强调） |
| `--ink` | `#292A19` | 正文墨绿黑 |
| `--gray` | `#7a7a6a` | 次要灰 |
| `--cream` | `#FAF6E8` | 奶油卡底（偏白不偏黄） |
| `--edge` | `#4a7c3a` | 卡片深绿细边 |
| 白 | `#fff` / `rgba(255,255,255,.9)` | 封面文字、外层白框 |
| `--highlight` | `#FFF200` | 正文重点短语的荧光笔底色（独立语义色，不参与一套一色的风格换色） |

## 重点荧光笔（正文语义强调）
- 仅在**非装饰性文案**里标出真正的重点关键词/短句，例如结论、核心判断、定义中的关键成分；使用 `<span class="hl">重点文字</span>`。
- 不用于 `.t1/.t2/.bot/.kicker/.sub/.foot/.src` 等页眉、页码、导航、英文副题、来源和装饰性文字；不高亮整段，每页通常 `1–3` 处。
- **荧光笔颜色选取规则**（除非用户明确指定色值）：从本风格配色中，取 **7:2:1 原则中"7"（主色/大面底色）的对比色/互补色**，饱和度要高——因为透明度只有 40%，低饱和色会透不出来。例如绿色主题选暖琥珀金 `#E9B445`，粉色主题选青绿对比色，深蓝主题选暖橙黄。自动选色时保证与奶油卡底 `#FAF6E8` 有足够对比即可。
- 全局默认参数：高度 `0.70em`（字高 70%），位置 `top:calc(30% + 3px)`，透明度 `opacity:.4`，左右各外扩 `0.04em`；允许轻微手写感，但不得遮住字形主体。
- 推荐实现（已写入内容页模板）：
  ```css
  :root{--highlight: /* 按上述规则自动选色 */;}
  .hl{position:relative;display:inline;z-index:0;isolation:isolate;font-weight:inherit;}
  .hl::after{content:"";position:absolute;z-index:-1;left:-.04em;right:-.04em;top:calc(30% + 3px);height:.70em;background:var(--highlight);opacity:.4;border-radius:.04em;transform:rotate(-.35deg);}
  ```
- `.hl` 只包裹短语，避免跨行；必须跨行时拆成多个 `.hl`，分别贴合每一行。
- 语义优先级：`.hl` 表示「本页最值得记住的结论/关键词」；普通加粗仍用 `<b>`，不要把所有粗体都自动升级为荧光笔。
- 渲染后目检：色块应从字形下沿透出而不成为整行底色；若短语换行、遮挡下一行或与卡脚相碰，先缩短高亮短语，不通过降低字号或裁剪来掩盖。

## 色板反推（参考图驱动）
用户给了参考图时**从参考图反推色板替换默认风格**；无参考图用风格库默认 `green-editorial`。结构项（卡片位置、间距、字体栈、去斜体、外层框结构）**一律不变**。

**配色遵循 7:2:1 原则**——按参考图各色块的面积占比 / 出现频率分配角色，不做等量提取：
1. **主色（70%）**：参考图的大面底色/主色 → 卡片背景渐变（占画布最大面积）
2. **辅色（20%）**：参考图的文字/结构/大面积内容色 → 正文 ink、卡片底
3. **点缀色（10%）**：参考图最亮/最跳的小面积点缀（印章、标签、高亮）→ 强调 accent（kicker、序号、lead 强调、边框点缀）
4. **辅助灰**：辅色衍生出的次一级文字灰（gray）。
5. **外层固定白色**：外层框文字/描边/封面文字统一白色（同绿色模板），不随底色变；卡内文字随卡底色深浅（白卡 → 深色字）。
6. **渐变方向**：背景用**对角渐变 `135deg`，左下浅→右上深**（参考图 Tamaken 系风格）；参考图明确是其他方向时按参考图。
7. **替换映射**：把默认 `--green/--ink/--gray/--cream/--edge` 及背景渐变整体替换为反推值；卡内各结构相对用法（kicker 用 accent、序号用 accent、卡片底浅色、正文 ink 等）不变，只换颜色值；外层保持白色。
8. **风格可选**：参考图是特定画风（扁平插画、赛博等）时，可在背景加对应纹理/氛围，但保持 Editorial 版式骨架。

示例（粉蓝紫渐变，按 7:2:1 + 同色系延伸）：主色（70%）浅粉 `#FFCEE3` 系背景对角渐变 `linear-gradient(135deg,#FFCEE3,#D9D5F0,#9BAEDF,#678EC9,#262277)`；辅色（20%）深蓝紫 `#262277`（正文 ink）、卡片底 `#FFF7FB`；点缀（10%）蓝 `#678EC9`（accent）；gray `#8A8FB0`；edge `#678EC9`；外层白字白描边。

## 外层白框（封面 & 内容页统一）
`.frame{position:absolute;inset:24px;border:1.5px solid rgba(255,255,255,.5);border-radius:20px;}`
- `.t1` top:22px, left/right:32px，白 Noto Sans SC 15px/600：左 `SCUT · MEM`，右 `—— 章节名 · Ch.02`
- `.rule` top:54px：`1px solid rgba(255,255,255,.4)`
- `.t2` top:86px，白 IBM Plex Mono 11px letter-spacing .2em：左 `CHAPTER 02 / 主题`，右 `NN / 09`
- `.bot` bottom:18px，left/right:32px，白 mono 10px：左 `Engineering Management · CH.02`，右 `SCUT MEM`

## 封面模板库（两种版式可选）
| 模板 | 版式 | 素材/字体 | 适用 |
|---|---|---|---|
| `cover-template.html` | 渐变底+外层白框+全部文字居中（默认） | 任意风格色板（styles/*.md） | 常规课程封面，配风格色板 |
| `cover-spring.html` | 黄绿垫图背景+白色流线装饰（文字下层）+Didot/回文明朝体 | `media/bg-spring.jpg`、`media/ribbon.svg`、`fonts/{Didot.ttf,Didot-Bold.ttf,Huiwen-mincho.otf}` | 春日/清新系封面；**选它时内容页背景也用同一张垫图** |
| `cover-izakaya.html` | 暖黄螺旋垫图+深酒红罩层+宋体加粗白字大标题+Didot 英文句+月黄点缀 | `media/bg-izakaya.jpg`、`fonts/Didot*`（封面中文用 Noto Serif SC 宋体加粗） | 大阪霓虹/居酒屋系封面（风格 `osaka-neon`）；**内容页背景用同一张垫图+罩层**；封面可用 text-shadow |
| `cover-spiral-gold.html` | 金黑螺旋垫图+深罩层+宋体加粗白字大标题+Didot 英文句 | `media/bg-spiral-gold.jpg`、`fonts/Didot*`（封面中文用 Noto Serif SC 宋体加粗） | 鎏金漩涡/东京夜系封面（风格 `spiral-gold`）；**内容页背景用同一张垫图+罩层**；封面白字+可用 text-shadow |
| `cover-blend-warmcool.html` | 冷暖交融圆斑垫图+深罩层+宋体加粗白字大标题+Didot 英文句 | `media/bg-blend-warmcool.jpg`、`fonts/Didot*`（封面中文用 Noto Serif SC 宋体加粗） | 冷暖交融系封面（风格 `blend-warmcool`）；**内容页背景用同一张垫图+罩层**；封面白字+可用 text-shadow |

### 标题字号自适应（封面模板已内置）
按标题字符数（含·号）自动定字号，字少大、字多小并自动换行居中（`.zh` max-width:820px）：
| 字符数 | 字号 |
|---|---|
| ≤4 | 150px |
| 5 | 132px（如「春绿·新生」） |
| 6 | 112px |
| 7 | 96px |
| 8–9 | 86px |
| ≥10 | 76px（自动换行） |

## 封面（cover-template.html）
- 渐变底 + 外层白框，**无卡片浮层、无圆圈装饰，全部文字白色、居中**
- `.center` inset:0，flex column 垂直/水平居中：
  - `.top` mono 14px .28em 白标签（如 `ENGINEERING MANAGEMENT · MEM`）
  - `.tsep` 白分隔线（56×2px，rgba(255,255,255,.55)）
  - `h1` 74px/500 Noto Serif SC 白大标题
  - `.en` Playfair 25px 白英文
  - `.sub` 19px 白副题（line-height 1.9）
  - `.views` 三行视角：`.row` 20px/500 白（序号 Playfair + 标题 + `——`），`.d` 14px rgba(255,255,255,.82)

## 内容页（content-template.html）
### 奶油卡片
`.card{position:absolute;top:190px;left:105px;right:105px;bottom:136px;background:var(--cream);border:1.5px solid var(--edge);border-radius:12px;box-shadow:0 16px 44px rgba(22,60,20,.22);padding:42px 52px;display:flex;flex-direction:column;overflow:hidden;}`
- **top:190px、bottom:136px 已定稿（上边对齐红线、下边留白），勿改**
- 卡内 flex column：`.kicker` → `h1` → `.sub` → `.body`(flex:1) → `.foot`

### 卡内顶部（三处间距已定稿）
| 元素 | 规格 | 间距 |
|---|---|---|
| `.kicker` | mono 14px .2em 绿，英文标签 | 从卡顶 padding 起 |
| `h1` | 34–42px/500 ink | **margin-top:34px** |
| `.sub` | 15–17px 绿副题英文 | **margin-top:8px** |
| `.body` | flex:1 | **margin-top:16px**（首模块与副题间距） |

### 卡内结构（`.body`，padding-bottom:86px，gap 22–30px）
- `.sec` 板块：`.lbl{border-bottom:1px solid rgba(74,124,58,.35);padding-bottom:10px;margin-bottom:16px;display:flex;baseline}`，含 `.no`（Playfair 22px 绿序号）、`.t`（22px/500 标题）、`.an`（14px 灰右对齐注解）
- `.lead` 正文：16px line-height 1.85 ink，`b` 绿强调
- `.feat/.f` 特征网格：`grid repeat(4,1fr) gap:14`，`.f` 圆角8 细边框，`.t` 17px/500，`.d` 12.5px 灰
- `.cls/.cl` 分类网格：`grid 1fr 1fr gap:14`，`.cl` padding 16 18，`.abbr` mono 绿，`.t` 18px/500，`.d` 13px 灰
- `.quote` pull-quote：`border-left:3px solid var(--green);background:rgba(115,174,82,.08);padding:18px 24px;`，内文 16px 不斜体
- `.hl` 重点荧光笔：正文短语级强调，固定荧光黄 `#FFF200`，y 下移、色块高约字高 30%；与普通 `<b>` 的层级分开

### 卡脚
`.foot{position:absolute;left:52px;right:52px;bottom:16px;border-top:1px solid rgba(74,124,58,.3);padding-top:13px;display:flex;justify-content:space-between;mono 10px 灰}`（左 `Chapter 02`，右主题英文）

## 内容槽位契约（防内容塞错）
> 借鉴 lieflat-cards：每个板块里各标签承载固定角色，把句子塞进短值槽会换行撑破卡面，脚本会自动检测。

| 板块 | 短值槽（只放短值，≤ 一行） | 允许多行的长槽 |
|---|---|---|
| `.sec .lbl` | `.no` 序号（Ⅰ/Ⅱ/Ⅲ）、`.t` 板块标题、`.an` 注解 | — |
| `.lead` | — | 正文（16px 段） |
| `.feat .f` | `.t` 特征标题（≤8字） | `.d` 特征说明（≤16字） |
| `.cls .cl` | `.abbr` 缩写（≤6字）、`.t` 分类标题（≤10字） | `.d` 分类说明（≤20字） |
| `.quote p` | — | 引文（16px） |
| `.kicker` / `.foot` | 英文标签/页脚，单行 | — |

- 规则：标题/序号/缩写类短值槽绝不塞长句；正文段落到 `.lead`/`.quote p`/`.d`。放不下 → **删字/换行到长槽，不改字号越界**。

## 高发故障清单（历史踩坑，定稿勿改）
1. **卡位置** `.card` top:190px / bottom:136px（已对齐红线），勿改。
2. **卡内顶部三处间距** h1 margin-top:34 / sub 8 / body 16，勿改。
3. **`.foot` 吸底**：`position:absolute;bottom:16px` + `.body` padding-bottom:86px；改 `margin-top:auto` 会不吸底。
4. **渐变方向**：跟随参考图原色块的深色位置（左下浅→右上深为默认；原图其他方向按原图），深色区文字用白、浅色区用深。
5. **外层白框** `.frame` inset:24px + 白描边；顶部栏/封面文字统一白。
6. **渲染分批**：9 张一次同批会超时（exit 143），每批 2–3 张。
7. **交付前必须审计**：见下方 `--check`；带溢出/裁剪/单行槽换行的卡不得交付，**禁用 `overflow:hidden` 掩盖**（会隐藏文字而非修复）。

## 渲染（scripts/html2png.mjs）
```bash
node scripts/html2png.mjs <card-01.html> <card-02.html> ... --width 1080 --height 1440 --scale 1
```
- 每个 HTML 同目录生成同名 PNG（整页 1080×1440）
- 依赖：全局 playwright（脚本自动探测系统 chromium；路径不符时改 `findChromium()` / `loadPlaywright()` 的候选列表）
- **9 张一次性渲染会超时，按每批 2–3 张分批**
- **自动审计**：渲染每张前先对 `.card`（或 body）做 DOM 实测，报告三类问题并在有任一问题时最终退出码 1（禁止交付带布局问题的卡）：
  - 溢出（文本元素超出卡边缘，给出 px/边/selector/文本）、被 overflow 裁剪、短值槽换行（见「内容槽位契约」）
  - 只审计不出图：加 `--check`（如 `node scripts/html2png.mjs card-02.html --check`）

## 合并 PDF（scripts/html2pdf.mjs）
```bash
node scripts/html2pdf.mjs <card-01.html> <card-02.html> ... --out 输出.pdf --width 1080 --height 1440
```
- 把整套卡片合并成一份 PDF，每张卡一页；每页 810×1080pt（= 1080×1440 CSS px，等比无缩放），渐变背景保留
- 依赖：全局 playwright + `pdf-lib`；改 `loadModule('playwright'/'pdf-lib', [...])` 候选列表适配路径

## 封面 → 内容页页码约定
内容页 `NN / 09` 与每页 `.t2` 主题、`.foot` 英文主题按章节内容拆分页数对应。
