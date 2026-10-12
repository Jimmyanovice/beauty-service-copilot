# 美妆客服共情副驾

面向美妆电商人工客服的可运行原型，整合聊天、订单和售后工单，生成带证据的回复建议，保留人工审核和风险跟进记录。

对应赛题一“数据共情者 - 消费者的AI管家”。当前建议引擎为 `compact-v7-reviewed-4`，底层使用本地Qwen3:8b和LangGraph。应用不发送客户消息，不执行退款、补发或改址。

> 本仓库包含经过字段清理的赛题虚构MOCK数据、演示截图和PPT。赛题数据的公开再发布授权尚未核实，建议先使用Private仓库。清理数据不等于获得公开授权。

## 功能

- 在同一工作台查看聊天、关联订单、工单及服务时间线。
- 按买家消息选择分析时点，区分附件快照和历史回放，排除未来记录。
- 生成摘要、情绪、风险、证据ID、待核信息、回复草稿和下一步。
- 对金额、状态、执行承诺、来源归属及未核实原因做有限规则检查。
- 人工修改、采纳或拒绝建议，再认领任务、记录处置和查看历史。
- 风险看板跟踪举报、重复进线及情绪升级等服务事项。
- 用紧凑协议、精确缓存、严格限用的证据路径及有界队列控制调用。

## 快速开始

需要Python 3.11。生成模型建议另外需要Ollama和本地 `qwen3:8b`，模型权重不在仓库里。

Windows PowerShell：

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements_runtime.txt
Copy-Item .env.example .env
ollama pull qwen3:8b
```

如果Ollama尚未运行，先启动它。在项目文件夹双击 `start_demo.cmd`，使用启动器显示的地址。

macOS/Linux：

```bash
python3.11 -m venv .venv
.venv/bin/python -m pip install -r requirements_runtime.txt
cp .env.example .env
ollama pull qwen3:8b
.venv/bin/python scripts/run_demo.py --port 5000
```

手动启动默认入口为 `http://127.0.0.1:5000/workbench`。Windows启动器遇到已有服务会换端口，不会关闭其他服务。模型不可用时仍能浏览会话、订单/工单和任务，生成会降级为待人工核实的建议。

| 页面 | 用途 |
| --- | --- |
| `/workbench` | 会话、证据、辅助建议、审核和任务 |
| `/dashboard` | 风险及处置跟踪 |
| `/evaluation` | 空白冻结标注模板及可选配对效率记录 |

首次运行会在 `data/runtime/`创建新的数据库。原开发环境的30条人工标注、旧计时和审核记录没有打包，不会在另一台机器自动出现。

## 目录

| 文件夹 | 内容 |
| --- | --- |
| `src/` | 完整应用、模型适配、工作流、规则、知识检索及持久化代码 |
| `frontend/` | 模板、样式、页面脚本和带许可证的本地前端库 |
| `data/contest/` | 字段清理后的赛题MOCK演示数据 |
| `data/beauty_knowledge/` | 未审核的模拟知识，不能作为品牌政策或功效依据 |
| `evaluation/` | 标注管理、离线评估、基准对照及空白样本模板 |
| `tests/` | 完整自动化回归 |
| `scripts/` | 启动、导入、预热、隔离页面验收和PPT工具 |
| `presentation/` | 15页PPT、生成稿、大纲和实际视频脚本 |
| `docs/` | 运行、架构、数据边界、评估和GitHub上传指南 |

## 测试

```powershell
.\.venv\Scripts\python.exe -B -X utf8 -m pytest -q -p no:cacheprovider tests
```

测试使用隔离数据库和模型替身，不需要云密钥或实时大模型。它验证软件行为，不能当作模型准确率。

本机已验证版本见 `requirements_runtime.lock.txt`。可用它安装对应Python依赖：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements_runtime.lock.txt
```

页面自动化需要额外安装 `requirements_dev.txt`。Windows浏览器验收默认使用已安装Edge，详见 [运行指南](docs/QUICKSTART.md)。

## 展示文件

- [15页初赛PPT](presentation/submission_draft.pptx)
- [实际演示视频脚本](presentation/demo_script.md)
- [逐页大纲](presentation/ppt_outline.md)
- [评估与限制](docs/EVALUATION.md)

重新生成PPT需要Node.js：

```bash
npm install
npm run build:ppt
```

模型权重、Python环境和Node依赖需要本机安装，不应作为源码提交。PPT仍需人工确认放映效果，视频尚未录制。

## 已知边界

当前仍存在个别否定诉求的意图与处理焦点分歧，见 [已知问题](docs/KNOWN_LIMITATIONS.md)。原冻结标注情绪口径混合，高风险正例缺失，独立人工回复正确率和人工提效比例尚未建立。

原10月9日/10日测量是原本地输入的历史结果。上传版昵称和字段已清理，不能当作完全相同输入的重测。聚合摘要在 `evaluation/reference/`，没有附带原私有数据库或完整原始模型日志。

## 数据与许可

官方Excel、Word说明和PPT模板未收录。使用官方数据导入时，将自己有权使用的文件放在本地，并指定路径：

```powershell
.\.venv\Scripts\python.exe scripts\import_contest_data.py --source "你的本地业务数据.xlsx"
```

数据公开前应确认赛事授权；源码开源许可证尚未指定，本次整理没有代为选择。第三方库的许可保持原样，见 [第三方声明](THIRD_PARTY_NOTICES.md)和[数据政策](docs/DATA_POLICY.md)。

上传操作见 [GitHub上传指南](docs/GITHUB_UPLOAD.md)。不要上传 `.env`、运行数据库、账号资料或真实业务记录。
