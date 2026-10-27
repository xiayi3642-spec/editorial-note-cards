---
name: editorial-note-cards
description: 把课程/书本/PPT 的笔记内容排版成一整套「Editorial 竖版笔记卡片」并批量输出 PNG/PDF。当用户上传或提到上课笔记、课程章节文字并给出参考图/设计系统，要求"做成卡片""出图""按这个排版""设计系统套一下"、或要 1080×1440 竖版卡片组（封面+多张内容卡）时使用。封面自动识别课程名/章节名；**先反推参考图的设计系统（色板/风格/文字深浅），默认绿色、参考图驱动时整体换色**；内容卡内先用 html 排版的板块结构（kicker/h1/sub/sec/lead/特征网格/分类网格/pull-quote）组织，再套本 skill 的 Editorial 规范（卡片位置/间距/字体栈固定，色板可变），输出 HTML 后渲染成高清 PNG/PDF 交付。
---

# Editorial 竖版笔记卡（Editorial Note Cards）

把用户给的一份笔记/章节文字，排成一整套 3:4 竖版卡片（封面 + 若干内容页），再渲染成 PNG/PDF 交付。

## 触发
- 用户给课程/书本/PPT 的笔记文字（或要求先读 PPT/文档提炼），并配一张参考图或一句设计系统描述，要求"按这个排""做成卡片/组图/竖版笔记""出图"。
- 本 skill 管**外层规范 + 色板反推 + 渲染出图**；卡内内容排版遵循 `html` skill 的 frontend-design 方法论（板块、层次、动线），最终样式套本 skill 的 Editorial token（结构固定、色板可变）。

## 前置
- 依赖：`node` + 全局 `playwright` + 系统 chromium。渲染脚本 `scripts/html2png.mjs` 会自动探测；路径不符时改脚本里 `findChromium()` / `loadPlaywright()` 的候选列表。

## 工作流
0. **反推设计系统**（用户给了参考图时）：
   - 按 **7:2:1 配色原则**提取：主色（70%，大面底/渐变）→ 背景；辅色（20%，文字/结构）→ ink/卡片底；点缀（10%，最跳的小色块）→ accent 强调
   - 判断底色深浅（深底→白/浅字，浅底→墨/深字），归纳风格关键词
   - 得到色板后，把默认绿色 token 整体替换（见 `references/spec.md` 色板反推）；**结构项一律不动**：卡片位置、三处间距、字体栈、去斜体
   - 无参考图时用**风格库默认 `green-editorial`**
1. **识别外层元信息**（AI 从用户内容自动提取，不要求用户提供）：
   - 课程/院校标识（如 `SCUT · MEM`）、章节名、`Ch.XX`、章节英文主题
   - 按内容密度拆成 N 页，页码 `NN / 09` 与每页 `.t2`/`.foot` 主题对应
2. **写封面** `card-01-cover.html`：从**封面模板库**选版式：
   - `assets/templates/cover-template.html`（默认：渐变底+外层框+居中白字，配任意风格色板）
   - `assets/templates/cover-spring.html`（黄绿垫图+白色流线+Didot/回文明朝体，配 `media/bg-spring.jpg`；素材在 `assets/media/`、`assets/fonts/`）
   - `assets/templates/cover-painting.html`（油画垫图+深墨绿回文明朝体大标题，配 `media/bg-painting.jpg`；风格 `painting-cream-green`，深墨绿字、无流线、**禁用 text-shadow**）
   - `assets/templates/cover-izakaya.html`（暖黄螺旋垫图+深酒红罩层+宋体加粗白字大标题+Didot 英文+月黄点缀，配 `media/bg-izakaya.jpg`；风格 `osaka-neon`，罩层压暗撑对比，封面可用 text-shadow）
   - `assets/templates/cover-spiral-gold.html`（金黑螺旋垫图+深罩层+宋体加粗白字大标题+Didot 英文，配 `media/bg-spiral-gold.jpg`；风格 `spiral-gold`，封面白字+可用 text-shadow）
   - `assets/templates/cover-blend-warmcool.html`（冷暖交融圆斑垫图+深罩层+宋体加粗白字大标题+Didot 英文，配 `media/bg-blend-warmcool.jpg`；风格 `blend-warmcool`，封面白字+可用 text-shadow）
   复制所选模板，替换占位（标题/英文句/底部词）；**标题字号按字数自适应**（≤4字150px、5字132px、6–7字112/96px、8–9字86px、≥10字76px并自动换行），模板已内置该规则。**封面选了垫图版式时，内容页背景也用同一张垫图（整套背景统一）。**
3. **写内容页** `card-02..card-NN.html`：复制 `assets/templates/content-template.html`，用 html 排版思路把内容组织成 `.sec/.lead/.feat/.cls/.quote` 板块，填外层 `.t1/.t2/.foot` 与页码。**卡片位置、三处间距、字体栈固定不改；色板按步骤 0 的反推结果替换**（规范见 `references/spec.md`）。正文中真正需要读者停住的关键词/短句可包裹 `<span class="hl">…</span>`，在文字后层加黄色荧光笔；装饰/导航文案不加，且每页克制使用（见 `references/spec.md`「重点荧光笔」）。
4. **渲染 PNG**（高清单卡）：
   ```bash
   node scripts/html2png.mjs card-01-cover.html card-02-x.html ... --width 1080 --height 1440 --scale 1
   ```
   **分批渲染**（每批 2–3 张，避免超时）。
5. **渲染 PDF**（合并整套，每卡一页，可选）：
   ```bash
   node scripts/html2pdf.mjs card-01-cover.html card-02-x.html ... --out notes-ch02.pdf --width 1080 --height 1440
   ```
   依赖 `pdf-lib`；输出每页 810×1080pt（1080×1440 CSS px 等比，无缩放）。
6. **自查**：Read PNG/PDF 预览，核对外层元信息正确、卡内无文字溢出/重叠、`.foot` 吸底、无斜体；同时检查 `.hl` 只落在正文重点短语、没有跨行、黄色色块位于文字后层且未遮住字形主体。
7. **交付**：PNG 用 RichMediaCard 整组交付（本地绝对路径）；PDF 用 present_files 交付；HTML 仅作源文件不单独交付。用户要求时两种都给。

## 硬规则
- 封面：渐变底 + 外层框，**无卡片浮层、无圆圈装饰、全部文字居中、去斜体**。文字颜色随底色：深底白字、浅底深字（参考图驱动时按反推 token 走）。
- 内容页：卡片 `top:190px / bottom:136px` 已定稿勿改；卡内顶部三处间距（h1 34 / sub 8 / body 16）定稿勿改。
- 全局 `font-style:normal`。
- **一套一色**：整套笔记卡全程只用**一个**配色风格，不中途切换（风格由参考图反推 / 点名 / 随机决定后，全套不变）。
- **重点荧光笔**：仅用于非装饰性正文里的重点关键词/短句；默认荧光黄 `#FFF200`，色块位于文字后层、向下偏移，高度约为字高 `30%`。页眉、页码、kicker、英文副题、脚注、纯装饰字不加；禁止整段高亮或把它当普通配色使用。
- **渲染后必须审计**：交付前用 `node scripts/html2png.mjs <cards...> --check` 审计；带溢出/裁剪/单行槽换行的卡必须修复后再交付，**禁用 `overflow:hidden` 掩盖故障**（会隐藏文字而非修复）。
- **结构固定、色板可变**：色板默认绿色，用户给参考图时按反推结果替换（背景/文字/强调/辅助色 + 深浅规则）；字体栈、卡片位置、间距、外层框结构见 `references/spec.md`。

## 风格库（styles）
- 位置：`assets/styles/*.md`，每个文件定义一种完整风格（色板、背景渐变、文字明暗、氛围）
- **默认随机**：用户不给参考图、也没点名风格时，从风格库**随机抽一个**使用（不再固定默认）；`green-editorial` 仍是库中一员
- 切换：用户给了对应风格的参考图，或点名风格名（如「午夜幻影」「星夜暖暮」「奶油绿油画」「大阪霓虹」「鎏金漩涡」「冷暖交融」「小红书浅蓝便签」）→ 用该风格；已有：`green-editorial`（绿色）、`gradient-pink-blue`（粉蓝紫）、`gradient-pink-green`（粉绿）、`gradient-yellow-cyan`（黄青蓝）、`gradient-pink-blue-deep`（粉蓝紫深调）、`gradient-pink-green-deep`（粉绿深调）、`gradient-midnight`（午夜幻影·蓝）、`gradient-serene`（赤霞绯梦·红粉）、`starry-night-warm`（星夜暖暮）、`nebula-violet`（星云紫夜）、`chunhe-jingming`（春和景明）、`xueshan`（雪山）、`painting-cream-green`（奶油绿油画）、`osaka-neon`（大阪霓虹）、`spiral-gold`（鎏金漩涡）、`blend-warmcool`（冷暖交融）、`xhs-patato`（小红书浅蓝便签）
- **新增风格**：把用户确认/沉淀的风格写成 `assets/styles/<风格名>.md`，沿用同格式（名称、默认否、氛围、色板、字体、结构引用），即成为可切换选项

## 维护
- 模板：`assets/templates/cover-template.html`、`cover-spring.html`、`cover-painting.html`、`cover-izakaya.html`、`cover-spiral-gold.html`、`cover-blend-warmcool.html`、`cover-xhs-patato.html`、`content-template.html`、`content-izakaya.html`、`content-spiral-gold.html`、`content-blend-warmcool.html`、`content-xhs-patato.html`（定稿示例）
- 封面素材：`assets/media/bg-spring.jpg`（黄绿垫图）、`bg-painting.jpg`（印象派油画垫图）、`bg-izakaya.jpg`（暖黄螺旋垫图）、`bg-spiral-gold.jpg`（金黑螺旋垫图）、`bg-blend-warmcool.jpg`（冷暖交融圆斑垫图）、`ribbon.svg`（白色流线）；字体 `assets/fonts/`（Didot + 回文明朝体）
- 风格库：`assets/styles/*.md`
- 规范：`references/spec.md`
- 渲染：`scripts/html2png.mjs`、`scripts/html2pdf.mjs`（封面文件名含 cover 自动走整页 2x 截图位图路径，杜绝 iPad PDF 阅读器把 text-shadow 显示成矩形块；内容页继续矢量打印）

## 推送更新到 GitHub（仓库 editorial-note-cards）
本 skill 目录已是 git 仓库，`origin` 指向公开仓库 `https://github.com/xiayi3642-spec/editorial-note-cards`。需要"推送/更新/上传/发布这套卡片"时，按此流程（换会话照做即可推送）：

1. 查状态：`git -C <本目录> status -sb`（看未提交/未推送改动）；`git -C <本目录> log origin/main..HEAD --oneline`（看待推送提交）
2. 提交：`git -C <本目录> add -A && git -C <本目录> commit -m "说明"`
3. 推送：`git -C <本目录> push origin main`（**凭证自动从本机 `~/.git-credentials` 读取，无需手动认证**）
4. 确认：`git -C <本目录> fetch origin -q && git -C <本目录> status -sb` 应显示 `up to date`；可 curl `https://raw.githubusercontent.com/xiayi3642-spec/editorial-note-cards/main/<文件>` 抽查公开可访问

**安全规则（不可违反）**：GitHub 凭证存本机 `~/.git-credentials`（权限 600），**严禁把 token / 密码 / 凭证写入本 skill 的仓库、assets、references、scripts 或任何被 git 跟踪的文件**——仓库是公开的，写入即泄露。换会话后在同一环境执行上述流程即可（共享该本机凭证），无需也不得重新索要 token。
