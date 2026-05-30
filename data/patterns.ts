import type { Pattern } from '@/types/pattern';
import { EXTRA_PATTERNS } from './patterns-extra';

const BASE_PATTERNS: Pattern[] = [
  /* ─── I · 集中式控制 ─── */
  {
    id: 'supervisor', group: 'centralized', num: '01', grpLabel: '集中式控制',
    title: '监管者 / 管理者', titleEn: '智能体即工具 · 集中式编排',
    aliases: '管理者 / 子智能体即工具 / 集中式编排',
    mechanism: '一个主智能体保持控制权，将专业智能体作为工具调用。子智能体的中间步骤不进入用户对话。',
    nodes: [
      { id:'user',     x:40,  y:240, w:100, label:'用户', kind:'user' },
      { id:'manager',  x:230, y:230, w:180, label:'管理者', sub:'监管者', kind:'accent' },
      { id:'research', x:580, y:50,  w:170, label:'研究', sub:'专业智能体' },
      { id:'coder',    x:580, y:230, w:170, label:'编码', sub:'专业智能体' },
      { id:'reviewer', x:580, y:410, w:170, label:'审查', sub:'专业智能体' },
      { id:'final',    x:230, y:430, w:180, label:'最终答案', kind:'dark' },
    ],
    edges: {
      'u-m':  { from:'user',     to:'manager',  label:'请求' },
      'm-r':  { from:'manager',  to:'research', label:'作为工具调用', curve:-20 },
      'm-c':  { from:'manager',  to:'coder',    label:'调用' },
      'm-rv': { from:'manager',  to:'reviewer', label:'调用', curve:20 },
      'm-f':  { from:'manager',  to:'final' },
    },
    timeline: [
      { caption:'<b>用户</b> 发送请求；<b>管理者</b> 接管对话。', fire:['u-m'], activate:['user','manager'] },
      { caption:'管理者将研究任务委派给 <b>研究专业智能体</b>（智能体即工具）。', fire:['m-r'], activate:['manager','research'] },
      { caption:'研究返回结果；对话保持在管理者处。', fire:['!m-r'], activate:['manager'] },
      { caption:'管理者调用 <b>编码</b> 来编写/编辑代码。', fire:['m-c'], activate:['manager','coder'] },
      { caption:'编码返回代码片段。', fire:['!m-c'], activate:['manager'] },
      { caption:'管理者调用 <b>审查</b> 检查质量。', fire:['m-rv'], activate:['manager','reviewer'] },
      { caption:'审查返回审查结论。', fire:['!m-rv'], activate:['manager'] },
      { caption:'管理者汇总所有结果，输出 <b>最终答案</b>。中间步骤对用户隐藏。', fire:['m-f'], activate:['manager','final'] },
    ],
    fit:'生产系统 · 客服工单分诊 · 内部 CLI 工具调用 · <b>带审查/测试/搜索子智能体的代码任务</b>。',
    risks:'路由错误会级联影响全局；监管者在复杂任务上可能成为 token 和延迟瓶颈。',
    example:{ tag:'CLAUDE CODE', body:'主对话持有上下文和用户交互；复杂操作委托给 <b>子智能体</b>：<code>reviewer</code> 检查变更，<code>tester</code> 运行测试，<code>searcher</code> 查找文档。仅最终结论暴露到主对话。' },
    code: { lang:'python', snippet:
`<span class="k">from</span> agents <span class="k">import</span> Agent, Tool

manager = Agent(
    role=<span class="s">"supervisor"</span>,
    model=<span class="s">"claude-sonnet"</span>,
    tools=[
        Tool.subagent(<span class="s">"researcher"</span>, role=<span class="s">"research"</span>),
        Tool.subagent(<span class="s">"coder"</span>,      role=<span class="s">"write code"</span>),
        Tool.subagent(<span class="s">"reviewer"</span>,   role=<span class="s">"check quality"</span>),
    ],
)

<span class="c"># 管理者自主决定何时调用每个子智能体。</span>
<span class="c"># 子智能体的 token 不进入主对话上下文。</span>
answer = <span class="f">await</span> manager.run(<span class="s">"Refactor this code"</span>)`
    },
    variants: [
      { label:'顺序执行', sub:'一次一个', timeline:null },
      { label:'并行执行', sub:'并发调用',
        timeline:[
          { caption:'<b>用户</b> 发送请求；<b>管理者</b> 接管控制。', fire:['u-m'], activate:['user','manager'] },
          { caption:'管理者<b>同时</b>向三位专业智能体派发任务。', fire:['m-r','m-c','m-rv'], activate:['manager','research','coder','reviewer'] },
          { caption:'三位专业智能体并行工作（任务必须相互独立）。', activate:['research','coder','reviewer'] },
          { caption:'结果<b>并发返回</b>给管理者。', fire:['!m-r','!m-c','!m-rv'], activate:['manager'] },
          { caption:'管理者汇总并输出 <b>最终答案</b>。', fire:['m-f'], activate:['manager','final'] },
        ],
      },
    ],
  },

  {
    id: 'router', group:'centralized', num:'02', grpLabel:'集中式控制',
    title:'路由器 / 交接', titleEn:'转移 · 专业智能体接管',
    aliases:'路由器 / 转移 / transfer_to_xxx / 专业智能体接管',
    mechanism:'当前智能体根据任务类型将控制权转移给另一个智能体；接收方完全拥有后续交互。',
    nodes: [
      { id:'user',    x:40,  y:240, w:100, label:'用户', kind:'user' },
      { id:'triage',  x:230, y:230, w:180, label:'分诊', sub:'路由器', kind:'accent' },
      { id:'billing', x:580, y:70,  w:200, label:'计费智能体' },
      { id:'eng',     x:580, y:230, w:200, label:'工程', sub:'技术支持' },
      { id:'policy',  x:580, y:400, w:200, label:'政策智能体' },
    ],
    edges: {
      'u-t':  { from:'user', to:'triage', label:'请求' },
      't-b':  { from:'triage', to:'billing', label:'计费', curve:-15 },
      't-e':  { from:'triage', to:'eng',     label:'技术' },
      't-p':  { from:'triage', to:'policy',  label:'法律', curve:15 },
      'u-e':  { from:'user', to:'eng', curve:-90, dashed:true },
    },
    timeline: [
      { caption:'用户：<b>"我的账号被锁了"</b>', fire:['u-t'], activate:['user','triage'] },
      { caption:'分诊评估意图——计费？技术？法律？', activate:['triage'] },
      { caption:'识别为技术问题——触发 <b>transfer_to(engineering)</b>。', fire:['t-e'], activate:['triage','eng'] },
      { caption:'与监管者的关键区别：<b>控制权真正转移了</b>。分诊退出。', activate:['eng'], dim:['triage','billing','policy'] },
      { caption:'后续对话直接进入工程——不再需要分诊。', fire:['u-e'], activate:['user','eng'], dim:['triage','billing','policy'] },
      { caption:'工程作为专业智能体处理整个会话，必要时可再次转移。', fire:['!u-e'], activate:['user','eng'], dim:['triage','billing','policy'] },
    ],
    fit:'多领域支持 · 企业流程路由 · 审批流程 · 需要专业智能体长期持有上下文的场景。',
    risks:'容易产生交接循环；跨智能体上下文裁剪和权限传播至关重要。',
    example:{ tag:'OPENAI AGENTS SDK', body:'<code>Triage Agent</code> 看到"我要退款"并调用 <code>transfer_to(billing_agent)</code>——计费接管整个对话直到关闭。<b>控制权迁移</b>，而非工具调用。' },
    code:{ lang:'python', snippet:`<span class="k">from</span> openai_agents <span class="k">import</span> Agent, handoff

billing = Agent(name=<span class="s">"billing"</span>,     instructions=...)
eng     = Agent(name=<span class="s">"engineering"</span>, instructions=...)
policy  = Agent(name=<span class="s">"policy"</span>,      instructions=...)

triage = Agent(
    name=<span class="s">"triage"</span>,
    handoffs=[
        handoff(billing, condition=<span class="s">"billing question"</span>),
        handoff(eng,     condition=<span class="s">"technical issue"</span>),
        handoff(policy,  condition=<span class="s">"legal / policy"</span>),
    ],
)

<span class="c"># 控制权真正转移——后续对话绕过 triage。</span>
session.run(triage, <span class="s">"I want a refund"</span>)`
    },
  },

  {
    id:'hierarchy', group:'centralized', num:'05', grpLabel:'集中式控制',
    title:'层级式管理者-工作者', titleEn:'企业式树形组织',
    aliases:'主管-管理者-工作者树 / 多层嵌套 / 企业层级',
    mechanism:'智能体分层次组织：上层规划、委派、审查；下层执行。可深度嵌套。',
    nodes: [
      { id:'dir',    x:370, y:50,  w:180, label:'主管', kind:'dark' },
      { id:'fe',     x:150, y:220, w:170, label:'前端管理者', sub:'管理者', kind:'accent' },
      { id:'be',     x:610, y:220, w:170, label:'后端管理者', sub:'管理者', kind:'accent' },
      { id:'ui',     x:30,  y:410, w:140, label:'UI 智能体' },
      { id:'ux',     x:200, y:410, w:140, label:'UX 审查' },
      { id:'api',    x:430, y:410, w:140, label:'API 智能体' },
      { id:'test',   x:600, y:410, w:140, label:'测试智能体' },
    ],
    edges:{
      'd-fe':   { from:'dir', to:'fe' },
      'd-be':   { from:'dir', to:'be' },
      'fe-ui':  { from:'fe', to:'ui' },
      'fe-ux':  { from:'fe', to:'ux' },
      'be-api': { from:'be', to:'api' },
      'be-test':{ from:'be', to:'test' },
    },
    timeline:[
      { caption:'主管收到顶层目标并拆分为两个子计划。', activate:['dir'] },
      { caption:'同时向<b>前端管理者</b>和<b>后端管理者</b>派发。', fire:['d-fe','d-be'], activate:['dir','fe','be'] },
      { caption:'每位管理者收到子计划并开始进一步分解。', activate:['fe','be'] },
      { caption:'管理者向工作者派发（并行）。', fire:['fe-ui','fe-ux','be-api','be-test'], activate:['fe','be','ui','ux','api','test'] },
      { caption:'工作者并行执行各自的任务。', activate:['ui','ux','api','test'] },
      { caption:'结果<b>向上汇总</b>：工作者 → 管理者。', fire:['!fe-ui','!fe-ux','!be-api','!be-test'], activate:['fe','be'] },
      { caption:'管理者审查并向主管汇报。', fire:['!d-fe','!d-be'], activate:['dir'] },
      { caption:'主管汇总所有交付物进行最终验收。', activate:['dir'] },
    ],
    fit:'大型工程任务 · 复杂研究 · 跨模块工作 · 需要<b>分阶段验收</b>的企业自动化。',
    risks:'深层级结构会导致延迟和 token 膨胀；顶层的规划错误会系统性传播。',
    example:{ tag:'CREWAI HIERARCHICAL', body:'主管收到"构建登录页"→ 拆分前后端 → 前端/后端管理者分配给 UI 智能体、测试智能体——各自审查并上报。两层通常足够；更深会增加返工成本。' },
    code:{ lang:'python', snippet:`<span class="k">from</span> crewai <span class="k">import</span> Crew, Agent, Process

director = Agent(role=<span class="s">"Director"</span>, goal=<span class="s">"Deliver login page"</span>)
fe_mgr   = Agent(role=<span class="s">"Frontend Mgr"</span>)
be_mgr   = Agent(role=<span class="s">"Backend Mgr"</span>)
ui, ux   = Agent(role=<span class="s">"UI"</span>),  Agent(role=<span class="s">"UX"</span>)
api, tst = Agent(role=<span class="s">"API"</span>), Agent(role=<span class="s">"Test"</span>)

crew = Crew(
    process=Process.hierarchical,
    manager=director,
    agents=[fe_mgr, be_mgr, ui, ux, api, tst],
)
result = crew.kickoff()  <span class="c"># 主管分解、委派、审查</span>`
    },
  },

  /* ─── II · 工作流 ─── */
  {
    id:'sequential', group:'flow', num:'03', grpLabel:'工作流',
    title:'顺序流水线', titleEn:'链式 · 流水线 · 线性 DAG',
    aliases:'链式 / 流水线 / 线性 DAG',
    mechanism:'多个智能体按固定顺序执行；每一步的输出成为下一步的输入。每步有明确的输入/输出约定。',
    nodes:[
      { id:'in',  x:20,  y:240, w:90,  label:'输入',   kind:'dark' },
      { id:'pl',  x:140, y:230, w:130, label:'规划者', kind:'accent' },
      { id:'re',  x:300, y:230, w:140, label:'研究者', kind:'accent' },
      { id:'wr',  x:470, y:230, w:130, label:'编写者', sub:'编码', kind:'accent' },
      { id:'rv',  x:630, y:230, w:140, label:'审查者', kind:'accent' },
      { id:'out', x:800, y:240, w:80,  label:'输出',  kind:'dark' },
    ],
    edges:{
      'in-pl': { from:'in', to:'pl' },
      'pl-re': { from:'pl', to:'re', label:'计划' },
      're-wr': { from:'re', to:'wr', label:'证据' },
      'wr-rv': { from:'wr', to:'rv', label:'草稿' },
      'rv-out':{ from:'rv', to:'out' },
    },
    timeline:[
      { caption:'输入进入流水线。', fire:['in-pl'], activate:['in','pl'] },
      { caption:'<b>规划者</b>起草大纲。', fire:['pl-re'], activate:['pl','re'] },
      { caption:'<b>研究者</b>收集证据和引用。', fire:['re-wr'], activate:['re','wr'] },
      { caption:'<b>编写者</b>产出完整草稿。', fire:['wr-rv'], activate:['wr','rv'] },
      { caption:'<b>审查者</b>输出修订列表和最终结果。', fire:['rv-out'], activate:['rv','out'] },
      { caption:'每步带有检查点落盘——任何失败可从上一检查点恢复。', activate:['in','pl','re','wr','rv','out'] },
    ],
    fit:'结构化工作流 · 文档生成 · 代码流水线 · 固定审批链 · 稳定的企业 SOP。',
    risks:'上游错误会级联传播；总延迟是各步骤之和；对变化适应能力低。',
    example:{ tag:'RFC 流水线', body:'稳定的 RFC 生成流水线：规划者起草大纲 → 研究者添加证据 → 编写者写出正文 → 审查者产出修订列表。每步带检查点——企业 SOP 自动化最常见的形式。' },
    code:{ lang:'python', snippet:`pipeline = Sequential([
    Planner(),
    Researcher(tools=[web_search, db]),
    Writer(),
    Reviewer(criteria=[<span class="s">"clarity"</span>, <span class="s">"factual"</span>]),
])

<span class="c"># 每步自动创建检查点；输出作为下一步的输入。</span>
result = pipeline.run(
    input=task,
    checkpoint_dir=<span class="s">"./runs/{task_id}"</span>,
)

<span class="c"># 任一步失败可从最后的检查点恢复。</span>
pipeline.resume_from(<span class="s">"./runs/abc/step3"</span>)`
    },
  },

  {
    id:'parallel', group:'flow', num:'04', grpLabel:'工作流',
    title:'并行扇出/扇入', titleEn:'分散-收集 · 并发 · 映射-归约',
    aliases:'分散-收集 / 并发编排 / 映射-归约',
    mechanism:'同一任务（或拆分的子任务）并行发送给多个智能体；聚合器合并、投票或综合结果。',
    nodes:[
      { id:'in',   x:30,  y:240, w:90,  label:'输入', kind:'dark' },
      { id:'disp', x:160, y:230, w:170, label:'调度器', kind:'accent' },
      { id:'sec',  x:400, y:60,  w:170, label:'安全' },
      { id:'perf', x:400, y:230, w:170, label:'性能' },
      { id:'corr', x:400, y:410, w:170, label:'正确性' },
      { id:'agg',  x:640, y:230, w:160, label:'聚合器', kind:'accent' },
    ],
    edges:{
      'in-d':   { from:'in', to:'disp' },
      'd-sec':  { from:'disp', to:'sec', curve:-20 },
      'd-perf': { from:'disp', to:'perf' },
      'd-corr': { from:'disp', to:'corr', curve:20 },
      'sec-a':  { from:'sec',  to:'agg', curve:-20 },
      'perf-a': { from:'perf', to:'agg' },
      'corr-a': { from:'corr', to:'agg', curve:20 },
    },
    timeline:[
      { caption:'输入进入调度器。', fire:['in-d'], activate:['in','disp'] },
      { caption:'调度器<b>同时</b>启动 3 个审查者。', fire:['d-sec','d-perf','d-corr'], activate:['disp','sec','perf','corr'] },
      { caption:'三个审查者并行工作（各自约 2-3 秒）。', activate:['sec','perf','corr'] },
      { caption:'全部完成 — <b>结果并发到达</b>聚合器。', fire:['sec-a','perf-a','corr-a'], activate:['sec','perf','corr','agg'] },
      { caption:'聚合器去重、按严重程度排序、输出合并后的结论。', activate:['agg'] },
    ],
    fit:'多视角审查 · 并行检索 · 模型对比 · 代码审查 · 分别进行安全/性能/正确性检查。',
    risks:'聚合器质量至关重要；并发写入可能冲突；成本可能显著上升。',
    example:{ tag:'PR 审查机器人', body:'同一 diff 同时发送给 <b>安全/性能/正确性</b> 审查者——三个在约 3 秒内完成。聚合器去重并将合并后的评论发布回 GitHub。' },
    code:{ lang:'python', snippet:`<span class="k">async def</span> review_pr(diff):
    <span class="c"># 扇出 — 三个审查者并发运行</span>
    sec, perf, corr = <span class="k">await</span> asyncio.gather(
        security_agent.review(diff),
        performance_agent.review(diff),
        correctness_agent.review(diff),
    )
    <span class="c"># 聚合器去重 + 按严重程度排序</span>
    comments = aggregator.merge([sec, perf, corr])
    <span class="k">return</span> deduped_by_severity(comments)

@app.on(<span class="s">"pull_request"</span>)
<span class="k">async def</span> on_pr(pr):
    <span class="k">await</span> pr.post_comment(review_pr(pr.diff))`
    },
    variants:[
      { label:'分散-收集', sub:'同一任务，多视角', timeline:null },
      { label:'映射-归约', sub:'拆分后并行',
        timeline:[
          { caption:'输入由调度器<b>拆分</b>为 3 个独立块。', fire:['in-d'], activate:['in','disp'] },
          { caption:'每个审查者只处理自己的块（映射阶段）。', fire:['d-sec','d-perf','d-corr'], activate:['disp','sec','perf','corr'] },
          { caption:'三个块独立处理——不是对同一输入的重复审查。', activate:['sec','perf','corr'] },
          { caption:'<b>归约</b>阶段：聚合器合并 3 个块的结果。', fire:['sec-a','perf-a','corr-a'], activate:['sec','perf','corr','agg'] },
          { caption:'聚合器输出完整合并结果。', activate:['agg'] },
        ],
      },
    ],
  },

  {
    id:'blackboard', group:'flow', num:'10', grpLabel:'工作流',
    title:'黑板 / 共享工作空间', titleEn:'共享内存 · 事件总线 · 发布-订阅',
    aliases:'黑板 / 共享内存 / 事件总线 / 发布-订阅',
    mechanism:'智能体通过读写共享空间而非直接消息传递来协作；当前共享状态决定哪个智能体下一步行动。',
    nodes:[
      { id:'ret',  x:50,  y:60,  w:170, label:'检索者' },
      { id:'rea',  x:680, y:60,  w:170, label:'推理者' },
      { id:'data', x:50,  y:410, w:170, label:'数据智能体' },
      { id:'ver',  x:680, y:410, w:170, label:'验证者' },
      { id:'bb',   x:380, y:200, w:140, h:140, label:'黑板', sub:'共享状态', kind:'store' },
    ],
    edges:{
      'ret-bb':  { from:'ret',  to:'bb' },
      'rea-bb':  { from:'rea',  to:'bb' },
      'data-bb': { from:'data', to:'bb' },
      'ver-bb':  { from:'ver',  to:'bb' },
    },
    timeline:[
      { caption:'<b>检索者</b>将页面摘要和来源 URL 写入黑板。', fire:['ret-bb'], activate:['ret','bb'] },
      { caption:'<b>推理者</b>看到新证据，从黑板读取并开始推理。', fire:['!rea-bb'], activate:['rea','bb'] },
      { caption:'推理者将结论草稿<b>写回</b>黑板。', fire:['rea-bb'], activate:['rea','bb'] },
      { caption:'<b>数据智能体</b>补充结构化数据。', fire:['data-bb'], activate:['data','bb'] },
      { caption:'<b>验证者</b>逐条检查声明——标记 ✅ 或 ❌。', fire:['!ver-bb'], activate:['ver','bb'] },
      { caption:'验证者将验证结果写回。', fire:['ver-bb'], activate:['ver','bb'] },
      { caption:'最先看到"所有声明已验证"的一方完成——完全异步。', activate:['bb'] },
    ],
    fit:'异步研究 · 长运行任务 · 数据湖检索 · 多智能体证据聚合 · 共享状态工作流。',
    risks:'需要强 schema、版本控制、锁、TTL 和来源追踪——否则会变成<b>脏上下文池</b>。',
    example:{ tag:'DEEP RESEARCH', body:'检索者将摘要和 URL 写入黑板；推理者根据新证据更新结论草稿；验证者逐条标记 ✅/❌。所有智能体<b>异步推进</b>——最先看到"全部已验证"的一方完成。' },
    code:{ lang:'python', snippet:`bb = Blackboard(
    schema=ResearchSchema,
    versioned=<span class="k">True</span>,
    ttl=<span class="n">3600</span>,           <span class="c"># 声明 1 小时后过期</span>
)

retriever.subscribe(bb, on=[<span class="s">"query"</span>])
reasoner.subscribe(bb,  on=[<span class="s">"evidence_added"</span>])
verifier.subscribe(bb,  on=[<span class="s">"claim_drafted"</span>])

<span class="c"># 智能体异步响应各自关心的事件</span>
bb.publish(<span class="s">"query"</span>, {<span class="s">"q"</span>: <span class="s">"Explore X"</span>})

<span class="k">while not</span> bb.query(<span class="s">"all_claims_verified"</span>):
    <span class="k">await</span> asyncio.sleep(<span class="n">1</span>)
finalize(bb.snapshot())`
    },
  },

  /* ─── III · 对话 ─── */
  {
    id:'groupchat', group:'dialog', num:'06', grpLabel:'对话',
    title:'群聊 / 轮询', titleEn:'共享主题 · 发言者选择 · 会议室',
    aliases:'群聊 / 轮询 / 选择器会议 / 共享主题',
    mechanism:'多个智能体共享一个消息线程或主题；由规则、LLM 选择器或人类决定谁下一个发言。',
    nodes:[
      { id:'topic',  x:380, y:230, w:160, h:90, label:'共享主题', sub:'对话', kind:'bus' },
      { id:'arch',   x:50,  y:60,  w:170, label:'架构师' },
      { id:'eng',    x:50,  y:410, w:170, label:'工程师' },
      { id:'rev',    x:680, y:60,  w:170, label:'审查者' },
      { id:'human',  x:680, y:410, w:170, label:'人类', sub:'主持人' },
      { id:'sel',    x:720, y:240, w:120, label:'选择器', kind:'dark' },
    ],
    edges:{
      'arch-t':  { from:'arch',  to:'topic' },
      'eng-t':   { from:'eng',   to:'topic' },
      'rev-t':   { from:'rev',   to:'topic' },
      'human-t': { from:'human', to:'topic' },
      'sel-t':   { from:'sel',   to:'topic', dashed:true },
    },
    timeline:[
      { caption:'<b>架构师</b>提出设计方案。', fire:['arch-t'], activate:['arch','topic'] },
      { caption:'选择器根据上一条消息决定谁下一个发言。', fire:['sel-t'], activate:['sel','topic'] },
      { caption:'<b>工程师</b>接收方案并提出实现问题。', fire:['!eng-t'], activate:['eng','topic'] },
      { caption:'工程师将问题写回主题。', fire:['eng-t'], activate:['eng','topic'] },
      { caption:'<b>审查者</b>对设计风险发表评论。', fire:['rev-t'], activate:['rev','topic'] },
      { caption:'<b>人类主持人</b>引导讨论。', fire:['human-t'], activate:['human','topic'] },
      { caption:'所有人共享一个历史——多视角透明，但容易偏离主题。', activate:['topic','arch','eng','rev','human'] },
    ],
    fit:'头脑风暴 · 架构审查 · 专家小组 · 需要明确多角色对话的场景。',
    risks:'容易跑题；消息历史膨胀；发言者选择策略影响质量。',
    example:{ tag:'AUTOGEN GROUP CHAT', body:'架构审查：方案发布到共享主题，<b>架构师/工程师/审查者</b>在同一线程中讨论；LLM 选择器根据上下文选择下一个发言者；人类主持人介入引导。' },
    code:{ lang:'python', snippet:`<span class="k">from</span> autogen <span class="k">import</span> GroupChat, LLMSelector

architect = AssistantAgent(name=<span class="s">"architect"</span>, ...)
engineer  = AssistantAgent(name=<span class="s">"engineer"</span>,  ...)
reviewer  = AssistantAgent(name=<span class="s">"reviewer"</span>,  ...)
human     = UserProxyAgent(name=<span class="s">"moderator"</span>)

chat = GroupChat(
    agents=[architect, engineer, reviewer, human],
    speaker_selection=LLMSelector(  <span class="c"># 根据上一条消息选择下一个</span>
        model=<span class="s">"claude-haiku"</span>),
    max_round=<span class="n">12</span>,
)
chat.initiate(<span class="s">"Design review: ..."</span>)`
    },
  },

  {
    id:'nested', group:'dialog', num:'07', grpLabel:'对话',
    title:'嵌套对话 / 内部循环', titleEn:'私密子对话 · 封装工作流',
    aliases:'嵌套对话 / 内部循环 / 私密子对话 / 封装工作流',
    mechanism:'外部智能体在响应前触发内部智能体对话；内部讨论被封装为一个外部响应。',
    decorations:[ { type:'rect', x:380, y:60, w:280, h:420, label:'嵌套对话' } ],
    nodes:[
      { id:'user',  x:40,  y:240, w:100, label:'用户', kind:'user' },
      { id:'outer', x:200, y:230, w:150, label:'外部智能体', kind:'accent' },
      { id:'plan',  x:410, y:90,  w:220, label:'规划者' },
      { id:'exec',  x:410, y:240, w:220, label:'工具执行者' },
      { id:'crit',  x:410, y:390, w:220, label:'评判者' },
      { id:'reply', x:710, y:240, w:140, label:'回复', kind:'dark' },
    ],
    edges:{
      'u-o':     { from:'user', to:'outer', label:'请求' },
      'o-plan':  { from:'outer', to:'plan' },
      'plan-ex': { from:'plan', to:'exec' },
      'ex-crit': { from:'exec', to:'crit' },
      'crit-pl': { from:'crit', to:'plan', curve:-60 },
      'o-reply': { from:'outer', to:'reply', curve:-100 },
    },
    timeline:[
      { caption:'用户向外部智能体发送请求。', fire:['u-o'], activate:['user','outer'] },
      { caption:'外部智能体私下启动内部对话循环。', fire:['o-plan'], activate:['outer','plan'] },
      { caption:'规划者 → 工具执行者 — 选择工具，执行调用。', fire:['plan-ex'], activate:['plan','exec'] },
      { caption:'评判者检查结果是否合理。', fire:['ex-crit'], activate:['exec','crit'] },
      { caption:'评判者反馈给规划者 — <b>再来一轮</b>修正。', fire:['crit-pl'], activate:['crit','plan'] },
      { caption:'2-3 轮后，外部智能体汇总并准备输出。', fire:['plan-ex','ex-crit'], activate:['plan','exec','crit'] },
      { caption:'外部向用户交付<b>一个</b>最终回复 — 内部对话不可见。', fire:['o-reply'], activate:['outer','reply','user'] },
    ],
    fit:'隐藏复杂工具调用 · 复用内部流程 · 将多步推理封装为单个智能体 API。',
    risks:'内部链路不透明；调试和归因需要额外的追踪；成本难以直观估算。',
    example:{ tag:'封装工作流', body:'"编写文档"智能体私下运行 <b>规划者 → 执行者 → 评判者</b> 3 轮；用户只看到一个最终回复。<b>外部看来是简单的单智能体 API</b>，内部复杂但可复用。' },
    code:{ lang:'python', snippet:`<span class="k">class</span> <span class="f">DocWriterAgent</span>(Agent):
    inner = NestedChat(
        agents=[
            Agent(role=<span class="s">"planner"</span>),
            Agent(role=<span class="s">"executor"</span>, tools=[search, edit]),
            Agent(role=<span class="s">"critic"</span>),
        ],
        max_rounds=<span class="n">3</span>,
    )

    <span class="k">async def</span> reply(self, msg):
        <span class="c"># 用户只看到返回值；内部对话被隐藏</span>
        result = <span class="k">await</span> self.inner.run(msg)
        <span class="k">return</span> result.final_answer`
    },
  },

  {
    id:'roleplay', group:'dialog', num:'09', grpLabel:'对话',
    title:'角色扮演 / 虚拟组织', titleEn:'角色人设 · 虚拟组织 · 初始提示',
    aliases:'角色扮演 / 虚拟组织 / 角色人设 / 初始提示',
    mechanism:'每个智能体被赋予明确的角色、目标、沟通风格和责任边界；通过基于角色的沟通完成任务。',
    nodes:[
      { id:'task',    x:40,  y:60,  w:120, label:'任务', kind:'user' },
      { id:'pm',      x:230, y:50,  w:170, label:'产品经理', sub:'PM', kind:'accent' },
      { id:'arch',    x:450, y:50,  w:170, label:'架构师', kind:'accent' },
      { id:'dev',     x:450, y:220, w:170, label:'开发者', kind:'accent' },
      { id:'test',    x:450, y:390, w:170, label:'测试者', sub:'QA', kind:'accent' },
      { id:'review',  x:230, y:400, w:170, label:'审查', sub:'反馈' },
      { id:'pmc',     x:40,  y:400, w:120, label:'PM 检查' },
      { id:'release', x:660, y:400, w:160, label:'发布', kind:'dark' },
    ],
    edges:{
      't-pm':     { from:'task', to:'pm' },
      'pm-arch':  { from:'pm',   to:'arch' },
      'arch-dev': { from:'arch', to:'dev' },
      'dev-test': { from:'dev',  to:'test' },
      'test-rv':  { from:'test', to:'review' },
      'rv-pmc':   { from:'review', to:'pmc' },
      'pmc-task': { from:'pmc', to:'task', dashed:true },
      'test-rel': { from:'test', to:'release' },
    },
    timeline:[
      { caption:'任务到达 <b>PM</b>。', fire:['t-pm'], activate:['task','pm'] },
      { caption:'PM 撰写 PRD，交给 <b>架构师</b>。', fire:['pm-arch'], activate:['pm','arch'] },
      { caption:'架构师产出技术规格，交给 <b>开发者</b>。', fire:['arch-dev'], activate:['arch','dev'] },
      { caption:'开发者编写代码，交给 <b>测试者</b>。', fire:['dev-test'], activate:['dev','test'] },
      { caption:'测试者产出审查报告。', fire:['test-rv'], activate:['test','review'] },
      { caption:'审查反馈流转至 <b>PM 检查</b>。', fire:['rv-pmc'], activate:['review','pmc'] },
      { caption:'如未通过 → 返回任务进入下一轮迭代（虚线）。', fire:['pmc-task'], activate:['pmc','task'] },
      { caption:'如通过 → 测试者触发 <b>发布</b>。', fire:['test-rel'], activate:['test','release'] },
    ],
    fit:'软件开发 · 产品设计 · 教学模拟 · 企业流程模拟 · 职责分解。',
    risks:'容易产生大量流程性对话而实际产出少；角色定义 ≠ 能力保证。',
    example:{ tag:'CHATDEV', body:'ChatDev 虚拟软件公司：<b>CEO</b> 接收需求 → <b>CTO</b> 选择技术栈 → <b>PM</b> 撰写 PRD → <b>程序员</b> 编码 → <b>测试者</b> 运行测试。瀑布式交付物传递。研究表明角色扮演<b>显著提升代码准确率</b>。' },
    code:{ lang:'python', snippet:`<span class="c"># 每个角色有人设 + 责任边界</span>
ceo = Agent(role=<span class="s">"CEO"</span>,
            persona=<span class="s">"Business-sharp, decisive"</span>)
cto = Agent(role=<span class="s">"CTO"</span>,
            persona=<span class="s">"Deep technical, architecture focus"</span>)
pm  = Agent(role=<span class="s">"PM"</span>,  persona=<span class="s">"User-first"</span>)
dev = Agent(role=<span class="s">"Programmer"</span>)
qa  = Agent(role=<span class="s">"Tester"</span>)

<span class="c"># 交付物沿瀑布链传递</span>
chain = ceo >> cto >> pm >> dev >> qa
release = chain.run(<span class="s">"Build a course registration system"</span>)`
    },
  },

  /* ─── IV · 决策 ─── */
  {
    id:'debate', group:'decision', num:'08', grpLabel:'决策',
    title:'辩论 / 评判者-批评者 / 投票', titleEn:'红蓝对抗 · 提议者-质疑者-评判者',
    aliases:'辩论 / 红蓝对抗 / 多数投票 / 提议者-质疑者-评判者',
    mechanism:'多个智能体提出不同的论点或答案，相互批评，然后由评判者、投票或聚合器给出最终结论。',
    nodes:[
      { id:'q',     x:40,  y:230, w:130, label:'问题', kind:'user' },
      { id:'a',     x:260, y:100, w:160, label:'智能体 A', sub:'提议者', kind:'accent' },
      { id:'b',     x:260, y:370, w:160, label:'智能体 B', sub:'质疑者', kind:'accent' },
      { id:'judge', x:520, y:230, w:170, label:'评判者', sub:'聚合器', kind:'dark' },
      { id:'final', x:730, y:240, w:130, label:'最终结果' },
    ],
    edges:{
      'q-a':  { from:'q', to:'a' },
      'q-b':  { from:'q', to:'b' },
      'a-b':  { from:'a', to:'b', curve:25 },
      'b-a':  { from:'b', to:'a', curve:25 },
      'a-j':  { from:'a', to:'judge' },
      'b-j':  { from:'b', to:'judge' },
      'j-f':  { from:'judge', to:'final' },
    },
    timeline:[
      { caption:'问题同时发送给智能体 A 和智能体 B。', fire:['q-a','q-b'], activate:['q','a','b'] },
      { caption:'<b>智能体 A</b>（提议者）给出答案和推理。', activate:['a'] },
      { caption:'<b>智能体 B</b>（质疑者）使用网络搜索寻找反例。', fire:['a-b'], activate:['a','b'] },
      { caption:'智能体 A 回应 B 的批评。', fire:['b-a'], activate:['a','b'] },
      { caption:'又一轮 — 多轮辩论暴露盲点。', fire:['a-b','b-a'], activate:['a','b'] },
      { caption:'双方提交完整论据给 <b>评判者</b>。', fire:['a-j','b-j'], activate:['a','b','judge'] },
      { caption:'评判者综合双方证据，产出 <b>最终结果</b>。', fire:['j-f'], activate:['judge','final'] },
    ],
    fit:'高不确定性推理 · 选项评估 · 事实核查 · 架构审查 · 代码审查 · 模型输出质量提升。',
    risks:'多数票 ≠ 正确；评判者偏差被放大；多轮辩论成本高。',
    example:{ tag:'EMNLP 2024 · 多智能体辩论', body:'事实核查：提议者给出答案，质疑者使用<b>网络搜索</b>寻找反例，2-3 轮交叉辩论；评判者审查完整记录并定稿。研究表明在数学推理和事实任务中<b>错误显著减少</b>，代价为 2-3 倍 token 消耗。' },
    code:{ lang:'python', snippet:`proposer = Agent(role=<span class="s">"proposer"</span>)
skeptic  = Agent(role=<span class="s">"skeptic"</span>,
                 tools=[web_search])
judge    = Agent(role=<span class="s">"judge"</span>)

answer = <span class="k">await</span> proposer.answer(question)
transcript = [answer]
<span class="k">for</span> _ <span class="k">in</span> <span class="f">range</span>(<span class="n">2</span>):
    critique = <span class="k">await</span> skeptic.critique(answer)
    answer   = <span class="k">await</span> proposer.revise(critique)
    transcript += [critique, answer]

final = <span class="k">await</span> judge.adjudicate(question, transcript)`
    },
    variants:[
      { label:'评判者-批评者辩论', sub:'多轮', timeline:null },
      { label:'多数投票', sub:'独立回答',
        timeline:[
          { caption:'问题同时发送给智能体 A 和 B（可扩展到更多）。', fire:['q-a','q-b'], activate:['q','a','b'] },
          { caption:'所有智能体<b>独立</b>回答——无交叉交互。', activate:['a','b'] },
          { caption:'答案（可选带置信度权重）提交给评判者。', fire:['a-j','b-j'], activate:['a','b','judge'] },
          { caption:'评判者汇总：<b>多数投票</b>或加权平均。', activate:['judge'] },
          { caption:'输出 <b>最终结果</b>。无辩论——延迟更低，可并行。', fire:['j-f'], activate:['judge','final'] },
        ],
      },
    ],
  },

  {
    id:'auction', group:'decision', num:'11', grpLabel:'决策',
    title:'市场 / 拍卖 / 合同网', titleEn:'市场 · 竞标 · 合同网协议',
    aliases:'市场 / 拍卖 / 竞标 / CNP (Smith 1980)',
    mechanism:'通过竞标/定价/协商分配任务或资源；智能体根据能力、成本、置信度或效用函数提交出价。',
    nodes:[
      { id:'mgr', x:40,  y:230, w:170, label:'管理者', sub:'发布任务', kind:'dark' },
      { id:'aa',  x:350, y:60,  w:160, label:'智能体 A', sub:'出价 0.6' },
      { id:'ab',  x:350, y:230, w:160, label:'智能体 B', sub:'出价 0.4' },
      { id:'ac',  x:350, y:400, w:160, label:'智能体 C', sub:'出价 0.8' },
      { id:'win', x:620, y:230, w:180, label:'选择', sub:'胜出者', kind:'accent' },
    ],
    edges:{
      'm-a': { from:'mgr', to:'aa', curve:-15 },
      'm-b': { from:'mgr', to:'ab' },
      'm-c': { from:'mgr', to:'ac', curve:15 },
      'a-w': { from:'aa', to:'win', curve:-15 },
      'b-w': { from:'ab', to:'win' },
      'c-w': { from:'ac', to:'win', curve:15 },
    },
    timeline:[
      { caption:'管理者发布任务："从 3 号货架取 1 个箱子"。', activate:['mgr'] },
      { caption:'同时向所有候选智能体广播。', fire:['m-a','m-b','m-c'], activate:['mgr','aa','ab','ac'] },
      { caption:'每个智能体基于<b>位置 + 电量 + 工作量</b>估算成本。', activate:['aa','ab','ac'] },
      { caption:'各自提交出价（越低 = 越愿意承担任务）。', fire:['a-w','b-w','c-w'], activate:['aa','ab','ac','win'] },
      { caption:'选择节点收集所有出价，选中最低 — <b>智能体 B</b>。', activate:['win'] },
      { caption:'智能体 B 胜出，开始执行；完成后向管理者汇报。', activate:['ab','win'] },
    ],
    fit:'资源调度 · 机器人任务分配 · 计算/工具预算优化 · 竞争智能体间的最优分配。',
    risks:'出价可能不可信；协商开销高；目标函数设计困难。',
    example:{ tag:'CONTRACT NET · SMITH 1980', body:'仓库多机器人拣选：管理者发布任务，每个机器人基于当前位置 + 电量 + 负载出价；管理者选择最低出价。经典的 40 年协议——最适用于资源稀缺且能力异构的场景。' },
    code:{ lang:'python', snippet:`<span class="k">class</span> <span class="f">Manager</span>:
    <span class="k">async def</span> assign(self, task):
        <span class="c"># 广播 + 收集出价</span>
        bids = <span class="k">await</span> asyncio.gather(*[
            agent.evaluate(task) <span class="k">for</span> agent <span class="k">in</span> self.fleet
        ])
        <span class="c"># 出价 = (成本, 预计时间, 置信度)</span>
        winner_idx = <span class="f">min</span>(
            <span class="f">range</span>(<span class="f">len</span>(bids)),
            key=<span class="k">lambda</span> i: bids[i].cost,
        )
        <span class="k">return</span> <span class="k">await</span> self.fleet[winner_idx].execute(task)`
    },
    variants:[
      { label:'最低成本胜出', sub:'简单拍卖', timeline:null },
      { label:'加权评分', sub:'多标准',
        timeline:[
          { caption:'管理者发布任务 + <b>评分权重</b>（成本: 0.5, 预计时间: 0.3, 置信度: 0.2）。', activate:['mgr'] },
          { caption:'向所有候选智能体广播任务。', fire:['m-a','m-b','m-c'], activate:['mgr','aa','ab','ac'] },
          { caption:'每个智能体提交（成本, 预计时间, 置信度）三元组。', activate:['aa','ab','ac'] },
          { caption:'选择节点计算加权综合分数。', fire:['a-w','b-w','c-w'], activate:['aa','ab','ac','win'] },
          { caption:'最佳综合分数胜出 — <b>智能体 A</b>（不一定成本最低）。', activate:['aa','win'] },
        ],
      },
    ],
  },

  /* ─── V · 去中心化/协议 ─── */
  {
    id:'swarm', group:'decentral', num:'12', grpLabel:'去中心化',
    title:'端到端 / 集群', titleEn:'P2P · 去中心化自治网络',
    aliases:'P2P / 集群 / 扁平架构 / 去中心化自治',
    mechanism:'没有固定的中央控制器；智能体直接通信、动态交接或基于环境状态行动。',
    nodes:[
      { id:'a', x:140, y:90,  w:160, label:'智能体 A' },
      { id:'b', x:600, y:90,  w:160, label:'智能体 B' },
      { id:'c', x:600, y:370, w:160, label:'智能体 C' },
      { id:'d', x:140, y:370, w:160, label:'智能体 D' },
    ],
    edges:{
      'a-b': { from:'a', to:'b' },
      'b-c': { from:'b', to:'c' },
      'c-d': { from:'c', to:'d' },
      'd-a': { from:'d', to:'a' },
      'a-c': { from:'a', to:'c' },
      'b-d': { from:'b', to:'d' },
    },
    timeline:[
      { caption:'智能体 A 发现新任务，<b>广播</b>给 B。', fire:['a-b'], activate:['a','b'] },
      { caption:'B 确认在其能力范围内，转发给 C 协作。', fire:['b-c'], activate:['b','c'] },
      { caption:'C 直接联系 A 确认参数——<b>无需管理者</b>。', fire:['!a-c'], activate:['c','a'] },
      { caption:'D 看到 P2P 消息，自主加入帮助。', fire:['d-a','b-d'], activate:['d','a','b'] },
      { caption:'多个智能体形成临时协作网状结构。', fire:['a-c','c-d'], activate:['a','b','c','d'] },
      { caption:'任意节点故障——其他节点继续工作。但<b>难以收敛，难以调试</b>。', activate:['a','b','c','d'] },
    ],
    fit:'开放环境 · 自治网络 · 动态任务分配 · 中心控制不可用或成本过高的场景。',
    risks:'难以收敛；重复工作；安全和治理复杂；极难调试。',
    example:{ tag:'去中心化爬虫', body:'无中心爬虫集群：每个爬虫从共享去重表中取未抓取的 URL；向 P2P 网络广播新链接。<b>任意节点故障——其他继续</b>，无管理者。取舍：所有人都知道它难以调试。' },
    code:{ lang:'python', snippet:`<span class="k">class</span> <span class="f">PeerAgent</span>:
    <span class="k">async def</span> on_message(self, msg, ctx):
        <span class="k">if</span> self.can_handle(msg):
            <span class="k">return</span> <span class="k">await</span> self.process(msg)
        <span class="c"># 无法处理 — 在 P2P 网络中选一个对端</span>
        peer = ctx.network.pick_peer(
            criteria=msg.required_capability,
        )
        <span class="k">return</span> <span class="k">await</span> peer.forward(msg)

<span class="c"># 无管理者；每个节点既是客户端也是服务端</span>
node = PeerAgent(id=<span class="s">"a"</span>).join(swarm)`
    },
  },

  {
    id:'protocol', group:'decentral', num:'13', grpLabel:'协议',
    title:'协议中介 · A2A / MCP / ANP', titleEn:'跨框架 · 跨厂商 · 生态互操作',
    aliases:'A2A · 智能体到智能体 / MCP · 模型上下文协议 / ANP · 智能体网络协议',
    mechanism:'不是单一拓扑——通过标准协议让不同框架、厂商和生态系统的智能体、工具和服务互联互通。',
    nodes:[
      { id:'local', x:50,  y:230, w:200, label:'本地智能体', kind:'accent' },
      { id:'rem',   x:410, y:60,  w:200, label:'远程智能体' },
      { id:'mcp',   x:410, y:330, w:200, label:'MCP 服务器' },
      { id:'tools', x:680, y:210, w:140, label:'工具' },
      { id:'res',   x:680, y:330, w:140, label:'资源' },
      { id:'pr',    x:680, y:450, w:140, label:'提示词' },
    ],
    edges:{
      'l-r':   { from:'local', to:'rem',  label:'A2A · ANP' },
      'l-mcp': { from:'local', to:'mcp',  label:'MCP 客户端' },
      'mcp-t': { from:'mcp',   to:'tools' },
      'mcp-r': { from:'mcp',   to:'res' },
      'mcp-p': { from:'mcp',   to:'pr' },
    },
    timeline:[
      { caption:'本地智能体准备调用外部能力。', activate:['local'] },
      { caption:'通过 <b>A2A 协议</b>调用合作公司的远程智能体。', fire:['l-r'], activate:['local','rem'] },
      { caption:'远程智能体处理并按<b>协议响应</b>。', fire:['!l-r'], activate:['local','rem'] },
      { caption:'同一本地智能体通过 <b>MCP 客户端</b>连接到 MCP 服务器。', fire:['l-mcp'], activate:['local','mcp'] },
      { caption:'MCP 服务器暴露 <b>工具</b> — GitHub <code>list_issues</code>、<code>create_pr</code>…', fire:['mcp-t'], activate:['mcp','tools'] },
      { caption:'同时暴露 <b>资源</b> — 数据集、文件、数据库表。', fire:['mcp-r'], activate:['mcp','res'] },
      { caption:'同时暴露 <b>提示词</b> — 可复用的提示词模板。', fire:['mcp-p'], activate:['mcp','pr'] },
      { caption:'协议层处理认证、能力发现、错误语义；业务代码只需关心 schema。', activate:['local','mcp','rem'] },
    ],
    fit:'跨团队/跨公司智能体协作 · 企业系统集成 · 工具生态访问 · 标准化的发现和通信。',
    risks:'安全边界扩大；认证、授权、审计、schema 版本控制成为<b>核心复杂度</b>。',
    example:{ tag:'CLAUDE · MCP · A2A', body:'Claude 通过 <code>MCP server</code> 调用 GitHub 的 <code>list_issues</code>/<code>create_pr</code>；企业内部通过 <b>A2A</b> 协议查询合作公司的销售智能体。协议层处理<b>身份、能力发现、错误语义</b>——业务代码只需关心 schema。' },
    code:{ lang:'python', snippet:`<span class="c"># MCP — 连接工具生态</span>
<span class="k">from</span> mcp <span class="k">import</span> Client
github = <span class="k">await</span> Client.connect(<span class="s">"mcp://github.com"</span>)
issues = <span class="k">await</span> github.tools.list_issues(repo=<span class="s">"acme/api"</span>)

<span class="c"># A2A — 跨智能体/跨公司调用</span>
<span class="k">from</span> a2a <span class="k">import</span> RemoteAgent
sales = <span class="k">await</span> RemoteAgent.discover(
    <span class="s">"https://partner.co/.well-known/agent.json"</span>,
)
quote = <span class="k">await</span> sales.send({
    <span class="s">"type"</span>: <span class="s">"rfq"</span>,
    <span class="s">"items"</span>: [...],
})`
    },
  },
];

export const PATTERNS: Pattern[] = [...BASE_PATTERNS, ...EXTRA_PATTERNS];