#!/usr/bin/env python3
import os
import re
import shutil
import sys

# Comprehensive dictionary mapping Chinese UI phrases to idiomatic English
UI_TRANSLATIONS = {
    # DSH Market & Plugins
    "插件市场": "Plugin Marketplace",
    "插件市场设置": "Marketplace Settings",
    "全部插件": "All Plugins",
    "已安装插件": "Installed Plugins",
    "已安装": "Installed",
    "未安装": "Not Installed",
    "推荐": "Featured",
    "热门": "Popular",
    "最新": "Recent",
    "主题": "Themes",
    "收藏": "Favorites",
    "发现": "Discover",
    "搜索插件": "Search plugins...",
    "搜索插件...": "Search plugins...",
    "搜索插件名称或作者": "Search by plugin name or author...",
    "逛一逛，点一下，装好。": "Browse, click, and install.",
    "下载区域": "Download Region",
    "全球": "Global",
    "中国大陆": "China Mainland",
    "从 npm 和 GitHub 官方源下载。": "Download from official npm and GitHub sources.",
    "中国大陆访问更快。仅改变下载线路，插件来源不变。": "Faster in China. Only changes CDN routing; source is identical.",
    "GitHub 加速": "GitHub Mirror",
    "自动选择可用线路，失败时才切换。": "Automatically selects available mirror, falls back on failure.",
    "自定义": "Custom",
    "优先使用自定义线路，失败后仍会尝试直连。": "Uses custom mirror first, falls back to direct connection.",
    "由环境变量 DSHM_GITHUB_PROXY 管理，界面中不可修改。": "Managed by DSHM_GITHUB_PROXY environment variable.",
    "构建环境变量": "Build Environment Variables",
    "保存并重启": "Save & Restart",
    "保存当前状态": "Save Current State",
    "保存环境变量": "Save Environment Variables",
    "保持现在的版本": "Keep Current Version",
    "查看插件市场版本与设置。": "View marketplace version and settings.",
    "更新会下载新版本，重启后生效。": "Update will download the new version; takes effect upon restart.",
    "这份市场由桌面端安装，新版本请在桌面端更新。": "Installed via desktop app; please update from the desktop client.",
    "已下载完成。重启 DeepSeek Harness 后新版本才会生效——页面会先显示新版本号。": "Download complete. Restart DeepSeek Harness to activate the update.",
    "一键安装": "Install",
    "一键更新": "Update",
    "正在安装": "Installing...",
    "正在下载": "Downloading...",
    "安装中": "Installing...",
    "更新中": "Updating...",
    "下载中": "Downloading...",
    "卸载中": "Uninstalling...",
    "安装": "Install",
    "卸载": "Uninstall",
    "更新": "Update",
    "重试": "Retry",
    "已是最新版本": "Up to date",
    "有新版本": "Update Available",
    "发现新版本": "New version available",
    "最新版本": "Latest Version",
    "当前版本": "Current Version",
    "版本": "Version",
    "作者": "Author",
    "下载量": "Downloads",
    "评分": "Rating",
    "大小": "Size",
    "依赖": "Dependencies",
    "依赖信息": "Dependency Info",
    "依赖警告": "Dependency Warnings",
    "依赖风险": "Dependency Risks",
    "依赖版本不匹配": "Dependency version mismatch",
    "仍然安装": "Install Anyway",
    "仍然更新": "Update Anyway",
    "全选": "Select All",
    "全不选": "Deselect All",
    "全部更新": "Update All",
    "上一页": "Previous Page",
    "下一页": "Next Page",
    "上一张": "Previous",
    "下一张": "Next",
    "查看详情": "View Details",
    "查看仓库": "View Repository",
    "查看说明": "View Documentation",
    "问题反馈": "Issues",
    "使用说明": "Instructions",
    "全屏浏览": "Fullscreen",
    "恢复自动": "Restore Auto",
    "HTTPS 加速前缀": "HTTPS Mirror Prefix",
    "上传备份": "Upload Backup",
    "备份": "Backup",
    "恢复": "Restore",
    "清除": "Clear",

    # Actions & Buttons
    "创建技能": "Create Skill",
    "创建新技能": "Create Skill",
    "新建技能": "New Skill",
    "立即创建": "Create Now",
    "导入技能": "Import Skill",
    "导出技能": "Export Skill",
    "导入": "Import",
    "导出": "Export",
    "刷新": "Refresh",
    "检查更新": "Check Updates",
    "正在检查更新…": "Checking for updates...",
    "正在检查更新...": "Checking for updates...",
    "检查并更新": "Check & Update",
    "管理更新": "Manage Updates",
    "立即更新": "Update Now",
    "确认更新": "Confirm Update",
    "回滚": "Rollback",
    "确认回滚": "Confirm Rollback",
    "移到回收站": "Move to Trash",
    "移入回收站": "Move to Trash",
    "永久删除": "Delete Forever",
    "清空回收站": "Empty Trash",
    "删除": "Delete",
    "启用": "Enable",
    "停用": "Disable",
    "已启用": "Enabled",
    "已停用": "Disabled",
    "全部启用": "Enable All",
    "全部停用": "Disable All",
    "启停来源": "Toggle Source",
    "启停技能": "Toggle Skill",
    "更多": "More",
    "取消": "Cancel",
    "保存": "Save",
    "关闭": "Close",
    "确定": "OK",
    "复制": "Copy",
    "已复制": "Copied",
    "复制成功": "Copied",
    "搜索": "Search",
    "选择文件": "Choose File",
    "选择文件夹": "Choose Folder",
    "设置": "Settings",

    # Skills Manager Concepts
    "技能管理": "Skills Manager",
    "技能管理器": "Skills Manager",
    "技能": "Skills",
    "技能列表": "Skills List",
    "已安装技能": "Installed Skills",
    "可用技能": "Available Skills",
    "发现技能": "Discover Skills",
    "仓库订阅": "Repositories",
    "仓库管理": "Repositories",
    "技能来源": "Skill Sources",
    "全局技能": "Global Skills",
    "项目技能": "Project Skills",
    "公共 Agent": "Shared Agent",
    "项目 Agent": "Project Agent",
    "项目 Skills": "Project Skills",
    "会话技能": "Session Skills",
    "回收站": "Trash",
    "诊断异常": "Diagnostics",
    "异常诊断": "Diagnostics",
    "源文件只读": "Read-only",
    "只读": "Read-only",
    "创建位置": "Location",
    "全局 DSH": "Global DSH",
    "项目 DSH": "Project DSH",
    "DSH 技能": "DSH Skills",
    "全部来源": "All Sources",
    "全部状态": "All Statuses",
    "全部": "All",
    "调用状态": "Invocation Status",
    "状态": "Status",
    "来源": "Source",
    "被覆盖": "Shadowed",
    "名称": "Name",
    "类型": "Type",
    "操作": "Actions",
    "详情": "Details",
    "描述": "Description",
    "简介": "Description",
    "正文": "Body",
    "源文件": "Source File",
    "更新时间": "Updated",
    "创建时间": "Created",
    "删除于": "Deleted at",
    "来源：": "Source: ",
    "正在加载技能…": "Loading skills...",
    "正在加载…": "Loading...",
    "加载中…": "Loading...",
    "没有匹配的技能。": "No matching skills.",
    "没有匹配的技能": "No matching skills",
    "该来源目录不存在或暂时没有技能。": "This source directory does not exist or has no skills.",
    "回收站为空。": "Trash is empty.",
    "回收站为空": "Trash is empty",
    "暂无技能": "No skills available",
    "暂无数据": "No data available",
    "未提供简介": "No description provided",
    "未发现诊断问题。": "No diagnostic issues found.",
    "拖拽技能到此处": "Drop skill here",
    "支持 .zip、技能文件夹或单个 SKILL.md": "Supports .zip, a skill folder, or single SKILL.md",
    "文件要求": "File Requirements",
    "压缩包或文件夹需包含 SKILL.md": "Archives and folders must contain SKILL.md",
    "SKILL.md 需包含 YAML 格式的技能名称和描述": "SKILL.md must include YAML name and description",
    "导入时复制完整内容，不修改原始来源": "Import copies full content and never modifies original source",
    "导入到全局 DSH": "Import to global DSH",
    "移除所选内容": "Remove selection",
    "请选择 .zip 或单个 SKILL.md。": "Please choose a .zip archive or single SKILL.md.",
    "所选文件夹中没有找到 SKILL.md。": "No SKILL.md found in the selected folder.",
    "例如 code-review-helper": "e.g. code-review-helper",
    "一句话说明什么时候使用": "One sentence describing when to use it",
    "正文（Markdown）": "Body (Markdown)",
    "写下技能要遵循的指令、步骤和边界…": "Write the instructions, steps, and boundaries...",
    "创建和导入均保存到全局 DSH，跨项目可用。": "Created and imported skills are saved to global DSH and available across projects.",

    # Models & Codex UI
    "专家": "Experts",
    "专家管理": "Expert Manager",
    "个人": "Personal",
    "主菜单": "Main Menu",
    "代码审查": "Code Review",
    "任务": "Tasks",
    "任务总览": "Tasks Overview",
    "任务设置": "Task Settings",
    "了解项目结构": "Inspect Project Structure",
    "模型": "Models",
    "模型设置": "Model Settings",
    "通用设置": "General Settings",
    "外观设置": "Appearance",
    "语言设置": "Language",
    "快捷键": "Shortcuts",
    "关于": "About",
    "语言": "Language",
    "简体中文": "Simplified Chinese",
    "英文": "English",
    "深色模式": "Dark Mode",
    "浅色模式": "Light Mode",
    "跟随系统": "Follow System",
    "会话": "Sessions",
    "新会话": "New Session",
    "历史会话": "History",
    "工作区": "Workspace",
    "暂无会话": "No sessions",
    "发送": "Send",
    "停止生成": "Stop generating",
    "重新生成": "Regenerate",
    "耗时": "Duration",
    "步骤": "Steps",
    "轮次": "Turns",
    "退出": "Exit",
    "重启": "Restart",

    # Usage & Billing
    "今日": "Today",
    "估算成本": "Estimated Cost",
    "上下文": "Context",
    "上下文缓存命中率": "Context Cache Hit Rate",
    "不可用": "Unavailable",
    "不支持": "Not Supported",
    "中文": "Chinese",
    "从公开日历载入": "Load from Public Calendar",
    "工作区用量": "Workspace Usage",
    "模型用量": "Model Usage",
    "供应商用量": "Provider Usage",
    "供应商 / 模型": "Provider / Model",
    "工作区别名": "Workspace Aliases",
    "暂无工作区": "No workspaces yet",
    "项目别名": "Project Alias",
    "回车保存单个；清空别名还原文件夹名": "Press Enter to save; clear alias to restore folder name",
    "全部保存": "Save All",
    "一键领取": "Claim with 1-Click",
    "上次检查": "Last Checked",
    "上游请求": "Upstream Requests",
    "上移": "Move Up",
    "下移": "Move Down",
    "不可驱动": "Cannot Drive",
    "中继密钥": "Relay API Key",
    "中国版端点与模型池": "China Endpoints & Model Pool",
}

# Merge dynamically generated dshmarket dictionary if present
dict_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dshmarket_dict.json")
if os.path.exists(dict_path):
    import json
    with open(dict_path, "r", encoding="utf-8") as f:
        extra_dict = json.load(f)
        UI_TRANSLATIONS.update(extra_dict)

# Sort translations by descending string length so compound sentences replace first
SORTED_KEYS = sorted(UI_TRANSLATIONS.keys(), key=lambda k: -len(k))

TARGET_FILES = [
    "/home/oiupoyt/.dsh/profiles/web/node_modules/dshmarket/client/client.js",
    "/home/oiupoyt/.dsh/profiles/web/node_modules/dshmarket/lib/routes.js",
    "/home/oiupoyt/.dsh/profiles/web/node_modules/@michengai/dsh-skills-manager/lib/client.js",
    "/home/oiupoyt/.dsh/profiles/web/node_modules/@michengai/dsh-skills-manager/lib/core.js",
    "/home/oiupoyt/.dsh/profiles/web/node_modules/@michengai/dsh-codex-ui/lib/client.js",
    "/home/oiupoyt/.dsh/profiles/web/node_modules/dsh-all-usage/lib/client.js",
    "/home/oiupoyt/Downloads/dsh-our-free-model/client.js",
    "/home/oiupoyt/Downloads/dsh-our-free-model/index.js",
]

def patch_file(path):
    if not os.path.exists(path):
        print(f"Skipping absent: {path}")
        return 0

    backup_path = path + ".bak-c2e"
    if not os.path.exists(backup_path):
        shutil.copy2(path, backup_path)
        print(f"Backed up: {path} -> {backup_path}")

    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    original_len = len(content)
    replacements = 0

    # 1. Structural runtime patches
    if "dshmarket" in path and "client.js" in path:
        # Force dshmarket lang to "en"
        pattern = r'const lang = String\(localeSnap\.active\)\.toLowerCase\(\)\.startsWith\("zh"\) \? "zh" : "en";'
        if re.search(pattern, content):
            content = re.sub(pattern, 'const lang = "en";', content)
            replacements += 1

    if "dsh-skills-manager" in path and "client.js" in path:
        # Force skills-manager to use en dictionary
        if "Object.assign(yg.zh,Sg.zh)" in content:
            content = content.replace("Object.assign(yg.zh,Sg.zh)", "Object.assign(yg.zh,Sg.en);yg.zh=yg.en")
            replacements += 1
        if "s=i.toLowerCase().startsWith(\"zh\")?e.zhName:e.enName" in content:
            content = content.replace("s=i.toLowerCase().startsWith(\"zh\")?e.zhName:e.enName", "s=e.enName")
            replacements += 1

    # 2. String literal replacements
    for zh in SORTED_KEYS:
        en = UI_TRANSLATIONS[zh]
        # Replace double quoted
        target_dq = f'"{zh}"'
        if target_dq in content:
            count = content.count(target_dq)
            en_clean_dq = en.replace('\\', '\\\\').replace('"', '\\"')
            content = content.replace(target_dq, f'"{en_clean_dq}"')
            replacements += count

        # Replace single quoted
        target_sq = f"'{zh}'"
        if target_sq in content:
            count = content.count(target_sq)
            en_clean_sq = en.replace('\\', '\\\\').replace("'", "\\'")
            content = content.replace(target_sq, f"'{en_clean_sq}'")
            replacements += count

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Patched {os.path.basename(path)}: {replacements} strings replaced ({len(content)} bytes)")
    return replacements

def main():
    print("=" * 60)
    print("Direct Plugin Patching: Converting Chinese UI into English")
    print("=" * 60)

    total_patches = 0
    for path in TARGET_FILES:
        total_patches += patch_file(path)

    print("=" * 60)
    print(f"Total string replacements applied across plugins: {total_patches}")
    print("=" * 60)

if __name__ == "__main__":
    main()
