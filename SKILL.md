---
name: editorial-note-cards
description: 把课程/书本/PPT 的笔记内容排版成一整套「Editorial 竖版笔记卡片」并批量输出 PNG/PDF。当用户上传或提到上课笔记、课程章节文字并给出参考图/设计系统，要求"做成卡片""出图""按这个排版""设计系统套一下"、或要 1080×1440 竖版卡片组（封面+目录页+多张内容卡+末页细方格空白页）时使用。封面自动识别课程名/章节名；**先反推参考图的设计系统（色板/风格/文字深浅），默认绿色、参考图驱动时整体换色**；内容卡内先用 html 排版的板块结构（kicker/h1/sub/sec/lead/特征网格/分类网格/pull-quote）组织，再套本 skill 的 Editorial 规范（卡片位置/间距/字体栈固定，色板可变），输出 HTML 后渲染成高清 PNG/PDF 交付。**整套页序强制：封面 → 目录页（第 2 页，PDF 内可点击跳转）→ 内容页 → 末页细方格空白页**。
---

# Editorial 竖版笔记卡（Editorial Note Cards）

把用户给的一份笔记/章节文字，排成一整套 3:4 竖版卡片（封面 + 目录页 + 若干内容页 + 末页细方格空白页），再渲染成 PNG/PDF 交付。

## 触发
- 用户给课程/书本/PPT 的笔记文字（或要求先读 PPT/文档提炼），并配一张参考图或一句设计系统描述，要求"按这个排""做成卡片/组图/竖版笔记""出图"。
- 本 skill 管**外层规范 + 色板反推 + 渲染出图**；卡内内容排版遵循 `html` skill 的 frontend-design 方法论（板块、层次、动线），最终样式套本 skill 的 Editorial token（结构固定、色板可变）。

## 前置
- 依赖：`node` + 全局 `playwright` + 系统 chromium。渲染脚本 `scripts/html2png.mjs` 会自动探测；路径不符时改脚本里 `findChromium()` / `loadPlaywright()` 的候选列表。

## 工作流
> **强制页序（每一套都必须完整）：`封面 → 目录页（第 2 页）→ 内容页 1..n → 末页细方格空白页`。目录页必须紧跟在封面之后；细方格空白页必须是最后一页。这两页是强制的：用户没提也要做，不能省、不能挪位置、不能因为「只出 PNG」就不做目录页。**

0. **反推设计系统**（用户给了参考图时）：
   - 按 **7:2:1 配色原则**提取：主色（70%，大面底/渐变）→ 背景；辅色（20%，文字/结构）→ ink/卡片底；点缀（10%，最跳的小色块）→ accent 强调
   - 判断底色深浅（深底→白/浅字，浅底→墨/深字），归纳风格关键词
   - 得到色板后，把默认绿色 token 整体替换（见 `references/spec.md` 色板反推）；**结构项一律不动**：卡片位置、三处间距、字体栈、去斜体
   - 无参考图时用**风格库默认 `green-editorial`**
1. **识别外层元信息**（AI 从用户内容自动提取，不要求用户提供）：
   - 课程/院校标识（如 `SCUT · MEM`）、章节名、`Ch.XX`、章节英文主题
   - **小节清单**：按内容密度拆成 N 页，每页记下中文小标题 + 英文副题 + 文件名，供目录页逐条生成
   - **总页数** `T = 1(封面) + 1(目录) + N(内容页) + 1(方格页)`；页码契约：封面无页码、目录 `02 / T`、内容页 `03 … T-1`、方格页 `T / T`
2. **写封面** `card-01-cover.html`：从**封面模板库**选版式：
   - `assets/templates/cover-template.html`（默认：渐变底+外层框+居中白字，配任意风格色板）
   - `assets/templates/cover-spring.html`（黄绿垫图+白色流线+Didot/回文明朝体，配 `media/bg-spring.jpg`；素材在 `assets/media/`、`assets/fonts/`）
   - `assets/templates/cover-painting.html`（油画垫图+深墨绿回文明朝体大标题，配 `media/bg-painting.jpg`；风格 `painting-cream-green`，深墨绿字、无流线、**禁用 text-shadow**）
   - `assets/templates/cover-izakaya.html`（暖黄螺旋垫图+深酒红罩层+宋体加粗白字大标题+Didot 英文+月黄点缀，配 `media/bg-izakaya.jpg`；风格 `osaka-neon`，罩层压暗撑对比，封面可用 text-shadow）
   - `assets/templates/cover-spiral-gold.html`（金黑螺旋垫图+深罩层+宋体加粗白字大标题+Didot 英文，配 `media/bg-spiral-gold.jpg`；风格 `spiral-gold`，封面白字+可用 text-shadow）
   - `assets/templates/cover-blend-warmcool.html`（冷暖交融圆斑垫图+深罩层+宋体加粗白字大标题+Didot 英文，配 `media/bg-blend-warmcool.jpg`；风格 `blend-warmcool`，封面白字+可用 text-shadow）
   - `assets/templates/cover-xueshan-purple.html`（黑紫泼墨雪山垫图+回文明朝体大标题+Playfair 英文+三行板块列表，配 `media/bg-xueshan-purple.jpg`；风格 `xueshan-purple`，封面白字、无流线、无蒙层）
   复制所选模板，替换占位（标题/英文句/底部词）；**标题字号按字数自适应**（≤4字150px、5字132px、6–7字112/96px、8–9字86px、≥10字76px并自动换行），模板已内置该规则。**封面选了垫图版式时，内容页、目录页、方格页背景也用同一张垫图（整套背景统一）。**
3. **写目录页 `card-toc.html`（强制，第 2 页，紧跟封面）**：复制 `assets/templates/toc-template.html`，目录项数量 = 内容页数量，逐条替换：
   - `.no` 序号 `01/02…`、`.txt .t` 中文小标题（与内容页 `h1` 同源）、`.txt .d` 英文副题（与内容页 `.sub` 同源）、`.pg` 该内容页**真实页码**
   - **跳转绑定**：每条 `.toc-item` 的 `data-target` 写该内容页的 HTML 文件名（如 `card-02.html`），`html2pdf.mjs` 据此加 GoTo 内部链接，PDF 里点目录项可跳转
   - 外层 `.t2` 左 `CHAPTER XX / CONTENTS`、右 `02 / T`；`.foot` 同内容页；页码与内容页 `.t2` 逐条一致，不能是装饰数字
   - 目录页只承担导航：不塞正文、引文、荧光笔、背景色块；条目 2–8 条（超 8 条按章节聚合）
4. **写内容页** `card-02-…` 起（页码从 `03 / T` 起，顺延到 `T-1 / T`）：复制 `assets/templates/content-template.html`，用 html 排版思路把内容组织成 `.sec/.lead/.kv/.feat/.cls/.quote` 板块，填外层 `.t1/.t2/.foot` 与页码。**遇到一段长文里含多个「X：…」并列子项（作用/主要内容/过程/特征/分类…）时，不要塞进 `.lead` 一整段，改用 `.kv`**：每个子项独立一个 `<p>`、标签包 `<b class="k">作用</b>` 走 accent 加粗、段间 12px，原文一字不删（样式已内置到全部 `content-*.html`，用法见 `references/spec.md`「.kv 冒号子项段」）。**卡片位置、三处间距、字体栈固定不改；色板按步骤 0 的反推结果替换**（规范见 `references/spec.md`）。正文中真正需要读者停住的关键词/短句可包裹 `<span class="hl">…</span>`，在文字后层加黄色荧光笔；装饰/导航文案不加，且每页克制使用（见 `references/spec.md`「重点荧光笔」）。
5. **写末页细方格空白页 `card-{T}-blank-grid.html`（强制，必须最后一页）**：复制 `assets/templates/blank-grid-template.html`：
   - 只换外层元信息（`.t1/.t2/.bot` 与 `.foot` 的章节号、`T / T`），**保持页面空白**：不加标题正文、不加提示语、不加荧光笔
   - 细方格固定 `--grid:20px`（≈4mm）双向 1px 细线，铺满奶油卡主体、底部留 64px 给页脚条；`--grid-line` 由本风格 accent 派生（默认 `rgba(74,124,58,.22)`），**不得换成横线纸/点阵纸**
   - 换风格时同步替换 token（`--green/--ink/--gray/--cream/--edge` + 背景）；垫图风格同样铺同一张垫图
6. **渲染 PNG**（整套含目录页与方格页）：
   ```bash
   node scripts/html2png.mjs card-01-cover.html card-toc.html card-02-x.html ... card-{T}-blank-grid.html --width 1080 --height 1440 --scale 1
   ```
   **分批渲染**（每批 2–3 张，避免超时）。目录页的 PNG 必须一起出（PDF 的 --toc 只影响 PDF，PNG 交付同样需要目录页）。
7. **渲染 PDF**（合并整套，每卡一页，可选）：
   ```bash
   node scripts/html2pdf.mjs card-01-cover.html card-02-x.html card-03-y.html ... card-{T}-blank-grid.html --out notes-ch02.pdf --width 1080 --height 1440 --toc card-toc.html
   ```
   依赖 `pdf-lib`；输出每页 810×1080pt（1080×1440 CSS px 等比，无缩放）。`--toc` 指定目录页 HTML，脚本把目录页**插入到封面之后**（PDF 第 2 页），并按 `.toc-item` 的 `data-target` 生成 GoTo 内部链接。**files 只列封面＋各内容页＋方格页，不含目录页**（目录页仅由 `--toc` 指定）；合并后总页数必须等于 `T`。
8. **自查**：Read PNG/PDF 预览，核对外层元信息正确、卡内无文字溢出/重叠、`.foot` 吸底、无斜体；`.hl` 只落在正文重点短语、没有跨行、黄色色块位于文字后层且未遮住字形主体。**页序校验**：文件数 = `T`；目录页是第 2 页、方格页是最后一页；目录 `.pg` 与内容页页码逐条对齐；方格页除元信息外确实全空；PDF 点目录项能跳到对应页。
9. **交付**：PNG 用 RichMediaCard 整组交付（本地绝对路径，**按页序排列**：封面→目录→内容→方格）；PDF 用 present_files 交付；HTML 仅作源文件不单独交付。用户要求时两种都给。

## 硬规则
- 封面：渐变底 + 外层框，**无卡片浮层、无圆圈装饰、全部文字居中、去斜体**。文字颜色随底色：深底白字、浅底深字（参考图驱动时按反推 token 走）。
- 内容页：卡片 `top:190px / bottom:136px` 已定稿勿改；卡内顶部三处间距（h1 34 / sub 8 / body 16）定稿勿改。
- 全局 `font-style:normal`。
- **页序强制（不可省）**：`封面 → 目录页(card-toc) → 内容页 → 细方格空白页(最后一页)`。目录页必须紧邻封面、方格页必须在最末；缺任一页视为整套不合格，不得交付——用户没要求也要加，也不因「只出 PNG」「页数不够」而省略。
- **目录页规则**：只放导航信息（序号/中文标题/英文副题/真实页码/`data-target` 跳转绑定），页码与内容页 `.t2` 逐条一致；禁止正文、引文、荧光笔、背景色块。
- **方格空白页规则**：除 `.t1/.t2/.bot/.foot` 与一枚 `NOTES · FREE SPACE` kicker 外**保持全空**；固定 20px（≈4mm）细方格、双向 1px 线，不得改成横线纸/点阵纸，也不加任何提示文案。
- **冒号子项必须分段**：一段正文里有 2 个以上「X：…」并列子项时，用 `.kv`（每项一个 `<p>`），不得压进 `.lead` 一整段——塞成一段会失去分段落行、读不出层级。
- **一套一色**：整套笔记卡全程只用**一个**配色风格，不中途切换（风格由参考图反推 / 点名 / 随机决定后，全套不变）。
- **重点荧光笔**：仅用于非装饰性正文里的重点关键词/短句；默认荧光黄 `#FFF200`，色块位于文字后层、向下偏移，高度约为字高 `30%`。页眉、页码、kicker、英文副题、脚注、纯装饰字不加；禁止整段高亮或把它当普通配色使用。
- **渲染后必须审计**：交付前用 `node scripts/html2png.mjs <cards...> --check` 审计；带溢出/裁剪/单行槽换行的卡必须修复后再交付，**禁用 `overflow:hidden` 掩盖故障**（会隐藏文字而非修复）。
- **结构固定、色板可变**：色板默认绿色，用户给参考图时按反推结果替换（背景/文字/强调/辅助色 + 深浅规则）；字体栈、卡片位置、间距、外层框结构见 `references/spec.md`。

## 风格库（styles）
- 位置：`assets/styles/*.md`，每个文件定义一种完整风格（色板、背景渐变、文字明暗、氛围）
- **默认随机**：用户不给参考图、也没点名风格时，从风格库**随机抽一个**使用（不再固定默认）；`green-editorial` 仍是库中一员
- 切换：用户给了对应风格的参考图，或点名风格名（如「午夜幻影」「星夜暖暮」「奶油绿油画」「大阪霓虹」「鎏金漩涡」「冷暖交融」「小红书浅蓝便签」「紫色雪山」「紫雪山」）→ 用该风格；已有：`green-editorial`（绿色）、`gradient-pink-blue`（粉蓝紫）、`gradient-pink-green`（粉绿）、`gradient-yellow-cyan`（黄青蓝）、`gradient-pink-blue-deep`（粉蓝紫深调）、`gradient-pink-green-deep`（粉绿深调）、`gradient-midnight`（午夜幻影·蓝）、`gradient-serene`（赤霞绯梦·红粉）、`starry-night-warm`（星夜暖暮）、`nebula-violet`（星云紫夜）、`chunhe-jingming`（春和景明）、`xueshan`（雪山·深蓝）、`xueshan-purple`（紫色雪山·黑紫泼墨）、`painting-cream-green`（奶油绿油画）、`osaka-neon`（大阪霓虹）、`spiral-gold`（鎏金漩涡）、`blend-warmcool`（冷暖交融）、`xhs-patato`（小红书浅蓝便签）、`red-notebook`（红布面笔记本）
- **新增风格**：把用户确认/沉淀的风格写成 `assets/styles/<风格名>.md`，沿用同格式（名称、默认否、氛围、色板、字体、结构引用），即成为可切换选项

## 维护
- 模板：`assets/templates/cover-template.html`、`cover-spring.html`、`cover-painting.html`、`cover-izakaya.html`、`cover-spiral-gold.html`、`cover-blend-warmcool.html`、`cover-xhs-patato.html`、`cover-xueshan-purple.html`、**`toc-template.html`（目录页）**、`content-template.html`、**`blank-grid-template.html`（末页细方格空白页）**、`content-izakaya.html`、`content-spiral-gold.html`、`content-blend-warmcool.html`、`content-xhs-patato.html`、`content-xueshan-purple.html`、`cover-notebook.html`、`content-notebook.html`（定稿示例；全部内容模板均已内置 `.kv` 冒号子项段样式）
- 封面素材：`assets/media/bg-spring.jpg`、`bg-painting.jpg`、`bg-izakaya.jpg`、`bg-spiral-gold.jpg`、`bg-blend-warmcool.jpg`、`bg-patato.jpg`、`bg-xueshan-purple.jpg`（黑紫泼墨+雪山封面）、`bg-xueshan-purple-inner.jpg`（同系深紫内容页垫图）、`bg-notebook-cover.jpg`（红布面笔记本封面）、`bg-notebook-inner.jpg`（白纸别签内容页）；字体 `assets/fonts/`（Didot + 回文明朝体 + 京華老宋体 jinghua-songti.ttf）
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
