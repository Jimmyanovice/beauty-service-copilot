// Keep the initial-round deck aligned with its five required content areas.
const pptxgen = require("pptxgenjs");
const path = require("path");
const imageSize = require("image-size");

const here = __dirname;
const deck = new pptxgen();
deck.layout = "LAYOUT_WIDE";
deck.author = "美妆客服共情副驾";
deck.subject = "作品背景与场景洞察、技术方案、核心功能演示、落地价值与未来规划";
deck.title = "美妆客服共情副驾";
deck.lang = "zh-CN";
const C = { ink: "1D292B", white: "FFFFFF", green: "238A78", mint: "DCECE7",
  gray: "64777A", light: "F5F8F7", line: "DDE5E3", coral: "C66257", gold: "D09A5C" };
const ST = deck.ShapeType;
const font = "Microsoft YaHei";
const SECTIONS = [
  { title: "作品背景与场景洞察", first: 1, last: 4 },
  { title: "技术方案", first: 5, last: 8 },
  { title: "核心功能演示", first: 9, last: 11 },
  { title: "落地价值", first: 12, last: 14 },
  { title: "未来规划", first: 15, last: 15 },
];
SECTIONS.forEach(section => deck.addSection({ title: section.title }));
function sectionFor(number) {
  return SECTIONS.find(section => number >= section.first && number <= section.last).title;
}
function text(slide, content, x, y, w, h, size = 18, extra = {}) {
  slide.addText(content, { x, y, w, h, fontFace: font, fontSize: size, color: C.ink,
    margin: 0, breakLine: false, valign: "mid", ...extra });
}
function base(title, subtitle, number) {
  const section = sectionFor(number);
  const slide = deck.addSlide({ sectionTitle: section });
  slide.background = { color: C.light };
  slide.addShape(ST.rect, { x: 0, y: 0, w: 13.333, h: .13, line: { color: C.green }, fill: { color: C.green } });
  text(slide, title, .72, .48, 11.8, .55, 27, { bold: true });
  text(slide, subtitle, .72, 1.08, 11.9, .38, 12, { color: C.gray });
  slide.addShape(ST.line, { x: .72, y: 6.94, w: 11.88, h: 0, line: { color: C.line } });
  text(slide, section, .72, 7.02, 6, .18, 10, { color: C.gray });
  text(slide, `${number} / 15`, 11.85, 7.02, .74, .18, 9, { color: C.gray, align: "right" });
  return slide;
}
function card(slide, x, y, w, h, title, body, color = C.green) {
  slide.addShape(ST.rect, { x, y, w, h, rectRadius: 0, line: { color: C.line },
    fill: { color: C.white } });
  slide.addShape(ST.rect, { x, y, w: .07, h, line: { color }, fill: { color } });
  text(slide, title, x + .25, y + .19, w - .45, .48, 19, { bold: true, color });
  text(slide, body, x + .25, y + .8, w - .5, h - 1.0, 15, { valign: "top", breakLine: false });
}
function callout(slide, label, value, x, color = C.green, note = "") {
  card(slide, x, 2.2, 3.68, 2.86, label, "", color);
  text(slide, value, x + .26, 3.04, 3.1, 1.04, 40, { bold: true, color });
  if (note) text(slide, note, x + .26, 4.18, 3.1, .66, 12, { color: C.gray, valign: "top" });
}
function band(slide, line, y = 5.6) {
  slide.addShape(ST.rect, { x: .72, y, w: 11.88, h: .8,
    line: { color: C.mint }, fill: { color: C.mint } });
  text(slide, line, .98, y + .12, 11.35, .54, 15, { color: C.ink });
}
function flow(slide, nodes, y = 2.38, color = C.green) {
  const gap = .28; const width = (11.88 - gap * (nodes.length - 1)) / nodes.length;
  nodes.forEach((node, i) => {
    const x = .72 + i * (width + gap);
    slide.addShape(ST.rect, { x, y, w: width, h: 1.22, line: { color }, fill: { color: i % 2 ? C.mint : C.white } });
    text(slide, String(i + 1).padStart(2, "0"), x + .18, y + .11,
      width - .36, .22, 10, { color: C.gray });
    text(slide, node, x + .18, y + .36,
      width - .36, .72, 17, { bold: true, color: C.ink });
  });
}
function screenshot(slide, filename, x, y, w, h) {
  const image = path.join(here, filename);
  const size = imageSize(image);
  const scale = Math.min(w / size.width, h / size.height);
  const width = size.width * scale;
  const height = size.height * scale;
  slide.addImage({ path: image, x: x + (w - width) / 2, y: y + (h - height) / 2,
    w: width, h: height });
}
function screenshotRegion(slide, filename, region, x, y, w, h) {
  const image = path.join(here, filename);
  const size = imageSize(image);
  if (region.x < 0 || region.y < 0 || region.x + region.w > size.width ||
      region.y + region.h > size.height) {
    throw new Error(`Screenshot crop outside source: ${filename}`);
  }
  const scale = Math.min(w / region.w, h / region.h);
  const cropW = region.w * scale;
  const cropH = region.h * scale;
  slide.addImage({ path: image, x: x + (w - cropW) / 2, y: y + (h - cropH) / 2,
    w: size.width * scale, h: size.height * scale,
    sizing: { type: "crop", x: region.x * scale, y: region.y * scale, w: cropW, h: cropH } });
}
let s = deck.addSlide({ sectionTitle: SECTIONS[0].title });
s.background = { color: C.ink };
s.addShape(ST.rect, { x: .75, y: .95, w: .14, h: 4.85, line: { color: C.green }, fill: { color: C.green } });
text(s, "美妆客服共情副驾", 1.23, 2.05, 10.6, .94, 39, { color: C.white, bold: true });
text(s, "辅助人工客服核对证据、回应困扰、持续跟进", 1.23, 3.18, 10.7, .65, 23, { color: "B6DCD2" });
text(s, "赛题一：数据共情者 - 消费者的AI管家", 1.23, 5.66, 11, .42, 15, { color: "B2C4C3" });
text(s, "初赛作品展示，使用赛题虚构业务数据", 1.23, 6.20, 11, .34, 12, { color: "B2C4C3" });
s.addNotes("作品定位是美妆电商的人工客服辅助工具。正文依次介绍作品背景与场景洞察、技术方案、核心功能演示、落地价值及未来规划。应用生成建议和人工任务，不执行真实退款或发送客户消息。");

s = base("作品背景：美妆客服的多系统接待", "赛题关注高并发咨询下的信息分散、回复共情和服务风险跟踪", 2);
card(s, .72, 2.0, 3.7, 3.65, "记录分散", "聊天、订单和售后工单需要来回查。\n同一个问题可能反复询问订单信息。");
card(s, 4.8, 2.0, 3.7, 3.65, "建议缺少依据", "肤质担忧、退款焦急和产品疑虑需要不同回应。\n模板回复很难解释具体处理路径。", C.gold);
card(s, 8.9, 2.0, 3.7, 3.65, "风险跟踪断开", "举报、重复进线等异常出现后，需要保留核查事项和处理状态。", C.coral);
band(s, "设计围绕客服实际接待：把相关记录放在一起，给出可审核的回复，再持续跟进。", 5.92);
s.addNotes("背景来自用户提供的赛题要求，见docs/CONTEST_REQUIREMENTS.md。信息分散和共情不足属于赛题场景描述，没有新增市场规模、真实客诉率或人效数据。");

s = base("场景洞察：消费者诉求背后的担忧", "退款受阻与真伪疑虑，是已用真实界面彩排的两个MOCK场景", 3);
card(s, .72, 2.0, 5.66, 3.66, "退货后退款受阻", "消费者反馈仓库签收了退货，售后却关闭，钱退不出来。\n\n客服要查入库、关闭原因和退款流水，回复先回应等待中的焦急。", C.gold);
card(s, 6.95, 2.0, 5.65, 3.66, "真伪疑虑升级举报", "消费者提供批次号，并表示查不出来就去平台举报。\n\n客服要核规格、批次和渠道依据，把持续核查交给人工任务。", C.coral);
band(s, "处理建议需要同时说明当前问题、已有依据和还要查什么。", 5.92);
s.addNotes("场景来源：evaluation/results/submission_ui_20261010/rehearsal.json。退款案例S00381的分析时点为2026-05-19 15:44:33。举报案例S00076的分析时点为2026-05-08 15:53:44。页面正文为原案例的简要概述，不是新采集的真实消费者数据。");

s = base("场景洞察：本作品的设计取舍", "围绕实际接待，把多源证据、分析时点和持续核查纳入建议流程", 4);
card(s, .72, 2.0, 3.7, 3.65, "三源证据放在一起", "聊天解释消费者诉求，订单和工单提供业务依据。\n消费者自述与后台字段分别保留，已有信息直接沿用。");
card(s, 4.8, 2.0, 3.7, 3.65, "分析时点明确", "后来产生的工单不提前用于历史建议。\n不能还原的状态标为未知，不把后续处理写成当时已完成。", C.gold);
card(s, 8.9, 2.0, 3.7, 3.65, "核查持续到任务", "风险先登记，再等待建议生成。\n客服审核、认领和记录处置，未完成事项继续跟踪。", C.coral);
band(s, "产品重点是服务证据和人工处置流程，开源模型负责生成可审核的辅助建议。", 5.92);
s.addNotes("这页说明本作品在客服场景中的具体设计取舍，不声称这些机制是行业首创，也不把所有聊天机器人概括为只有单轮问答。能力依据见实际LangGraph工作流、时点隔离和两场景彩排。没有推算真实人工节省比例。");

s = base("技术方案：工作台与Agent工作流", "Flask工作台，本地Qwen3:8b生成建议，LangGraph编排，SQLite保存操作记录", 5);
flow(s, ["Evidence\n多源证据", "Safety\n风险检查", "Draft\n建议生成", "Verify\n关联复核", "Audit\n结果留存"], 2.02);
card(s, .72, 4.0, 5.66, 1.84, "风险先登记", "Safety节点先保存风险任务，再进入可选的知识检索和模型生成。", C.coral);
card(s, 6.95, 4.0, 5.65, 1.84, "人工审核另存", "客服编辑、采纳或拒绝建议。回复原稿与任务历史可查询。", C.green);
band(s, "模型输出摘要、情绪、风险、证据ID、待核项、回复草稿和下一步。", 6.02);
s.addNotes("实现路径：src/orchestration/workbench_workflow.py、src/agents/assist_agent.py、src/ops/case_store.py。Verify节点补充证据和复核任务，文本与业务声明校验发生在Draft调用的AssistAgent中。人工审核在应用接口另存，未使用LangGraph interrupt或持久化checkpoint。");

s = base("技术方案：多源融合与服务时点", "导入138个虚构会话、998条消息、113笔订单和80张工单", 6);
flow(s, ["当前买家消息", "历史对话", "订单记录", "售后工单", "关联证据"], 2.02);
card(s, .72, 4.0, 5.66, 1.88, "附件快照", "展示赛题附件提供的业务字段。快照状态还需核实是否适用于当前问题。", C.gold);
card(s, 6.95, 4.0, 5.65, 1.88, "历史回放", "排除分析时点之后的消息和工单。不能还原的历史状态明确标为未知。", C.green);
band(s, "脱敏昵称仅提供关联候选，人工填写依据后才合并跨会话轨迹。", 6.02);
s.addNotes("数量来源：data/contest/manifest.json及/api/sessions。工单数量为24+13+15+10+18=80。时点隔离实现见src/data/contest_data.py。S00381工单创建时间16:26:33晚于15:44:33，历史回放排除该记录。");

s = base("技术方案：意图、情绪与风险分析", "明确请求先识别，模糊意图由同一次模型生成补判，基础情绪与场景标签分开", 7);
card(s, .72, 2.0, 5.66, 3.64, "当前诉求", "16类业务意图及unknown。\n明确退款、物流、改址等诉求优先识别，否定表达单独检查。\n\n规则结论、模型结论和采用来源分别留存。", C.green);
card(s, 6.95, 2.0, 5.65, 3.64, "情绪与服务风险", "担忧、生气等基础情绪与场景标签分开。\n退款焦急不自动归为过敏焦虑。\n\n举报、重复进线和情绪升级进入人工复核任务。", C.coral);
band(s, "风险规则下限不会由模型降低。系统给出服务优先级，医疗和商品真伪由人工核查。", 5.92);
s.addNotes("实现见src/agents/intent_agent.py、emotion_agent.py、assist_agent.py及src/risk/beauty_risk_rules.py。分类分数为启发式分，不是校准概率。低置信意图条件字段t与回复共用一次模型请求，不新增独立分类调用。");

s = base("技术方案：证据保护与成本控制", "结构化生成后核对业务声明，精确重复请求使用按版本隔离的缓存", 8);
card(s, .72, 1.96, 5.66, 1.92, "结构与事实校验", "JSON Schema约束字段，Pydantic检查结构。\n金额、状态、来源和未执行承诺再做业务核对。");
card(s, 6.95, 1.96, 5.65, 1.92, "原稿与修正留证", "未核实的批次、包装和运输原因需修正。\n未知证据移除时记录原因，客服可查看前后文本。", C.coral);
card(s, .72, 4.1, 5.66, 1.92, "短协议与精确缓存", "紧凑字段和360 Token单次输出上限。\n缓存按提示版本、模型和运行配置隔离。", C.gold);
card(s, 6.95, 4.1, 5.65, 1.92, "限用证据路径", "明确问候、无争议单订单发货查询可不用模型。\n风险、负面情绪、历史争议和混合问题继续完整分析。", C.green);
s.addNotes("实现见src/models/qwen_wrapper.py、src/knowledge/business_claims.py、service_guidance.py、src/optimization/smart_cache.py及evidence_routing.py。限用证据路径需满足严格条件，缓存命中仍执行本次风险检查。字段结构有效或规则无检出都不能代表完整语义正确。");

s = base("功能演示：退货后退款受阻", "S00381，2026-05-19 15:44:33，先展示三源记录，再切换历史回放", 9);
screenshot(s, "../evaluation/results/submission_ui_20261010/02_refund_draft.png", .72, 1.87, 8.15, 4.83);
text(s, "辅助区局部放大", 9.18, 1.79, 3.35, .42, 18, { bold: true, color: C.green });
screenshotRegion(s, "../evaluation/results/submission_ui_20261010/02_refund_draft.png",
  { x: 1230, y: 130, w: 370, h: 420 }, 9.18, 2.48, 3.35, 3.81);
text(s, "同一原图裁切，内容未改写", 9.18, 6.46, 3.35, .26, 11, { color: C.gray });
s.addNotes("截图来源：evaluation/results/submission_ui_20261010/02_refund_draft.png。左侧保留完整原图，右侧放大原截图的辅助区局部，未重绘或改写文字。录制操作：选择指定消息，先看附件快照，再切历史回放并生成建议。未来工单HV1005604873被排除。回复核入库、售后关闭原因和退款流水，仍需人工核实，不表明退款已经完成。");

s = base("功能演示：人工审核与跟进任务", "在回复编辑区保存采纳决定，再认领待核事项，处置备注和状态历史持续留存", 10);
screenshot(s, "../evaluation/results/submission_ui_20261010/03_review_and_followup.png", .72, 1.65, 8.15, 4.96);
text(s, "审核回复", 9.18, 2.1, 3.35, .42, 20, { bold: true, color: C.green });
text(s, "编辑草稿\n采纳或拒绝\n保存修改内容", 9.18, 2.73, 3.35, 1.26, 17, { valign: "top" });
text(s, "任务跟进", 9.18, 4.27, 3.35, .42, 20, { bold: true, color: C.gold });
text(s, "认领待核事项\n记录备注及状态\n保留操作历史", 9.18, 4.91, 3.35, 1.30, 17, { valign: "top" });
s.addNotes("截图来源：evaluation/results/submission_ui_20261010/03_review_and_followup.png。rehearsal.json记录编辑采纳、任务认领和生命周期的操作通过。应用未向买家发送消息，演示任务完成也不修改商家退款状态。");

s = base("功能演示：举报预警与风险看板", "S00076的举报表达触发人工跟进，看板显示已认领和处理中状态", 11);
screenshot(s, "../evaluation/results/submission_ui_20261010/06_risk_owned.png", .7, 1.65, 9.27, 4.96);
text(s, "定位与处置", 10.18, 2.18, 2.42, .5, 20, { bold: true, color: C.coral });
text(s, "预警定位会话\n返回证据与记录\n人工认领核查\n保持处理中", 10.18, 2.94, 2.42, 2.1, 17, { valign: "top" });
text(s, "商品真假尚未核实", 10.18, 5.57, 2.42, .5, 13, { color: C.gray });
s.addNotes("截图来源：evaluation/results/submission_ui_20261010/06_risk_owned.png。场景S00076，消息92900836378476.PNM，2026-05-08 15:53:44。原句是条件式举报表达。系统预警并认领人工任务，不把消费者认定为违规，不判定假货，不提前关闭未核实事项。");

s = base("落地价值：改善接待与风险跟进方式", "面向消费者、一线客服和服务管理，价值对应已实现的工作台操作", 12);
card(s, .72, 2.0, 3.7, 3.65, "消费者", "客服沿用已提供的信息，回应当前困扰。\n核查对象和下一步说明更具体，减少反复解释。", C.gold);
card(s, 4.8, 2.0, 3.7, 3.65, "一线客服", "集中查看订单与工单。\n从空白回复转为审核草稿，按待核项继续处理。", C.green);
card(s, 8.9, 2.0, 3.7, 3.65, "服务管理", "风险能回到会话和证据。\n处理人、备注与历史状态可查，未完成事项持续跟踪。", C.coral);
band(s, "当前证据为MOCK流程验证，真实客服人效和用户满意度仍需业务试点测量。", 5.92);
s.addNotes("这页陈述预期落地价值及支持它的已实现机制，不声称已测得真实线上收益。H的20条任务级效率计时记录不完整，不能报告人工节省比例。适合先在人工审核模式开展小范围业务试点。");

s = base("落地价值：成本与响应耗时实测", "10月9日同机同模型，11个共同案例交替两轮，两版各22次请求", 13);
callout(s, "模型请求总Token", "-6.13%", .72, C.green, "16368 → 15364；排除规则路径");
callout(s, "模型中位耗时", "-19.60%", 4.83, C.gold, "3.030 → 2.436秒；固定请求小样本");
callout(s, "样本P95耗时", "-22.32%", 8.94, C.coral, "3.375 → 2.622秒；非生产SLA");
band(s, "另测10月10日补丁12例：总Token7684，系统中位2.69秒，没有新的降本或提速结论。", 5.55);
s.addNotes("数据来源：evaluation/results/accuracy_cost_paired_20261009.json和submission_release_20261010_v2/quality_summary_v2.json。三项主要数字均来自10月9日44次交替模型请求的协议对照，排除确定性证据路径。下方另列10月10日12个系统请求，含1个证据路径。不同实验不能合并，小样本顺序运行不代表生产并发SLA、云账单或硬件运营成本。");

s = base("落地价值：效果证据与适用边界", "软件回归、人工标注和回复检查分别报告，先确认可用范围再扩大试点", 14);
card(s, .72, 2.0, 5.66, 3.85, "已有验证", "228 项软件回归通过。\n30 条人工冻结标注，12 条回复复测。\n\n最终声明与服务检查均0检出。\n原稿、10条21处调整及证据ID保存。", C.green);
card(s, 6.95, 2.0, 5.65, 3.85, "仍需补证据", "原30条规则意图21/30。\nMacro-F1约0.4629，较改前下降。\n混合情绪10/30，风险29/30。\n\n高风险正例缺失，人工提效未测得。", C.coral);
band(s, "规则无检出仍需要人工语义审核。当前证据支持工程原型，尚不能代表线上效果。", 6.02);
s.addNotes("软件回归来源：evaluation/results/submission_release_20261010_v2/regression_20261011.xml。30条人工标注来源及用户确认保留，误点建议按钮不自动认定采用候选。事后规则回归来源：accuracy_cost_frozen_retest_20261009.json，意图Macro-F1从约0.5548降至0.4629。混合情绪词表和场景口径不同，高风险正例为0，不能报告召回。回复检查来源为当前12例质量汇总，0检出不等于100%人工正确率。");

s = base("未来规划：验证效果后再扩大接入", "近期先补口径和效果证据，通过复核后再增加图片与平台接口", 15);
flow(s, ["独立回复复核", "补高风险样本", "图片与品牌资料", "鉴权及平台接入"], 2.02);
text(s, "近期验证", .98, 4.12, 5.10, .45, 20, { bold: true, color: C.green });
text(s, "统一意图、情绪口径，复核回复漏项和错误承诺。\n补高风险正例，保存完整人工效率计时。", .98, 4.86, 5.10, 1.12, 17, { valign: "top" });
text(s, "后续接入", 7.23, 4.12, 5.10, .45, 20, { bold: true, color: C.gold });
text(s, "审核品牌资料，确认字段和访问权限再接接口。\n每次扩展后重跑质量回归和成本测量。", 7.23, 4.86, 5.10, 1.12, 17, { valign: "top" });
s.addNotes("未来安排没有确定截止时间或量化收益承诺。当前使用本地Qwen3:8b文本模型，图片理解、真实品牌知识库、生产鉴权和平台接口还未完成。先在人工审核模式开展试点，再根据效果决定接入范围。");
deck.writeFile({ fileName: path.join(here, "submission_draft.pptx") });
