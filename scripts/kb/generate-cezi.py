import re
import json
import os

with open('data/kb/cezi/cezimidi-extracted.md', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Parse Rules
m1_text = text.split('### 【模块一：核心断法通则（Rules，精选 35 条）】')[1].split('### 【模块二：经典实战占验案例（Cases，全量代表性萃取）】')[0]
raw_rules = m1_text.strip().split('#### Rule ')
rules = []
for r in raw_rules:
    if not r.strip():
        continue
    header_line = r.splitlines()[0]
    num = header_line.split('：')[0].strip()
    title = header_line.split('：')[1].strip()
    app = re.search(r'- \*\*【适用门类】\*\*：([^\n]+)', r).group(1).strip()
    trig = re.search(r'- \*\*【触发盘面条件】\*\*：([^\n]+)', r).group(1).strip()
    core = re.search(r'- \*\*【核心断语与易理】\*\*：([^\n]+)', r).group(1).strip()
    timing = re.search(r'- \*\*【应期推法】\*\*：([^\n]+)', r).group(1).strip()
    rules.append({
        'id': f'czmd.rule.{num}',
        'title': title,
        'topic': app,
        'condition': trig,
        'text': core,
        'timing': timing,
        'credibility': 5
    })

print('Successfully parsed rules:', len(rules))

# 2. Parse Cases
m2_text = text.split('### 【模块二：经典实战占验案例（Cases，全量代表性萃取）】')[1].split('### 【模块三：独门象意概念（Concepts）】')[0]
raw_cases = m2_text.strip().split('#### Case ')
cases = []
for c in raw_cases:
    if not c.strip():
        continue
    header_line = c.splitlines()[0]
    num = header_line.split('：')[0].strip()
    title = header_line.split('：')[1].strip()
    st = re.search(r'- \*\*【时空与盘面数据】\*\*：([^\n]+)', c).group(1).strip()
    subj = re.search(r'- \*\*【占问事项与主体】\*\*：([^\n]+)', c).group(1).strip()
    analysis_part = c.split('- **【核心用神与推演分析】**：')[1].split('- **【实际应验结果与时间】**：')[0].strip()
    res = c.split('- **【实际应验结果与时间】**：')[1].strip().split('\n\n')[0].strip()
    
    char_match = re.search(r'“([^”]+)”字', st) or re.search(r'“([^”]+)”', title) or re.search(r'^(.{1,2})字', title)
    char = char_match.group(1) if char_match else title[:1]
    
    cases.append({
        'id': f'czmd.case.{num}',
        'title': title,
        'character': char,
        'timeAndData': st,
        'query': subj,
        'analysis': analysis_part,
        'result': res,
        'credibility': 5
    })

print('Successfully parsed cases:', len(cases))

os.makedirs('src/lib/kb/cezi', exist_ok=True)

# Generate rules.ts
rules_code = """export interface CeziRuleEntry {
  id: string;
  title: string;
  topic: string;
  condition: string;
  text: string;
  timing: string;
  credibility: 5;
}

/**
 * 《测字秘牒》（清·程省 著）35 条核心断法通则（相字十法、心易六法与取格大法）
 * 涵盖：装头、接脚、穿心、包笼、破解、添笔、减笔、对关、摘字、观梅、象形、会意、假借、谐声、转注等。
 */
export const CEZI_RULES: CeziRuleEntry[] = """ + json.dumps(rules, ensure_ascii=False, indent=2) + ";\n"

with open('src/lib/kb/cezi/rules.ts', 'w', encoding='utf-8') as f:
    f.write(rules_code)

# Generate cases.ts
cases_code = """export interface CeziCaseEntry {
  id: string;
  title: string;
  character: string;
  timeAndData: string;
  query: string;
  analysis: string;
  result: string;
  credibility: 5;
}

/**
 * 《测字秘牒》（清·程省 著）35 例经典实战占验案例（《至理测法》卷七全量萃取）
 * 涵盖：问六甲、疾疫、功名、婚姻、词讼、失物、行人、南巡、风水等奇验占断。
 */
export const CEZI_CASES: CeziCaseEntry[] = """ + json.dumps(cases, ensure_ascii=False, indent=2) + ";\n"

with open('src/lib/kb/cezi/cases.ts', 'w', encoding='utf-8') as f:
    f.write(cases_code)

print("Generated src/lib/kb/cezi/rules.ts and cases.ts successfully!")
