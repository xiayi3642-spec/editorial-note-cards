# Editorial Note Cards（Editorial 竖版笔记卡）

把课程 / 书本 / PPT 的笔记内容，排成一整套 **3:4 竖版笔记卡片**（封面 + 若干内容页），再渲染成高清 **PNG / PDF** 交付。结构固定、色板可变，支持封面模板库与多风格切换。

## 这是什么

一个自包含的 AI Skill（供 Agent 按 `SKILL.md` 工作流执行），不是独立程序。核心资产：

```
editorial-note-cards/
├── SKILL.md                  # 工作流 + 硬规则（Agent 入口）
├── references/spec.md        # 设计规范：7:2:1 色板、结构常量、槽位契约
├── scripts/
│   ├── html2png.mjs          # HTML → 高清 PNG（支持 --check 审计）
│   └── html2pdf.mjs          # 多卡合并 → PDF
└── assets/
    ├── templates/            # 封面/内容页版式模板
    │   ├── cover-template.html   # 渐变底封面（默认）
    │   ├── cover-spring.html     # 黄绿垫图封面（春日系列）
    │   └── content-template.html # 内容页
    ├── styles/               # 风格库（色板）
    ├── media/                # 背景垫图、装饰（bg-spring / ribbon / bg-xueshan…）
    └── fonts/                # Didot、回文明朝体等
```

## 怎么用（给 Agent）

1. 用户给笔记文字 + 参考图/设计系统 → 反推色板（7:2:1）或从风格库选风格
2. 从封面模板库选版式 → 写封面 + 内容页（替换占位）
3. 渲染：`node scripts/html2png.mjs <cards...> --width 1080 --height 1440 --scale 1`（分批 2–3 张；`--check` 审计）
4. 交付 PNG（RichMediaCard）/ PDF（present_files）

## 风格库

`green-editorial`、`gradient-pink-blue`、`gradient-pink-green`、`gradient-yellow-cyan`、`gradient-pink-blue-deep`、`gradient-pink-green-deep`、`gradient-midnight`、`gradient-serene`、`starry-night-warm`、`nebula-violet`、`chunhe-jingming`、`xueshan`（默认随机抽一个；可点名风格，也可按参考图反推整体换色）

## 维护：推送更新到 GitHub

本目录即 git 仓库，`origin` 指向本仓库。推送更新：

```bash
git status -sb                                   # 看改动
git add -A && git commit -m "说明"
git push origin main                             # 凭证自动从本机 ~/.git-credentials 读取
git fetch origin -q && git status -sb            # 确认同步
```

**安全规则（不可违反）**：GitHub 凭证只存本机 `~/.git-credentials`（权限 600），**严禁把 token / 密码 / 凭证写入仓库、assets、references、scripts 或任何被 git 跟踪的文件**——本仓库是公开的，写入即泄露。换会话后在同一环境按上述流程即可推送，无需重新索要 token。
