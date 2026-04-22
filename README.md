# Magic Archetype Test Scoring Engine

纯 JavaScript（无依赖）评分引擎，可同时在：
- Node.js（后端/脚本）
- 浏览器（GitHub Pages）
直接使用。

## 1) Node.js 用法

```js
const { scoreMagicArchetype } = require('./src/scoringEngine');

const result = scoreMagicArchetype([
  'A', 'C', 'D', 'B',
  'C', 'D', 'B', 'A',
  'D', 'C', 'B', 'A',
  'A', 'B', 'C', 'D',
]);

console.log(JSON.stringify(result, null, 2));
```

## 2) GitHub Pages 直接调用

把仓库发布到 GitHub Pages 后，在页面中直接引入：

```html
<script src="./src/scoringEngine.js"></script>
<script>
  const answers = ['A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D'];
  const result = window.MagicArchetypeScoring.scoreMagicArchetype(answers);
  console.log(result);
</script>
```

如果你是跨仓库引用，也可以用 jsDelivr（替换为你的用户名和仓库名）：

```html
<script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@main/src/scoringEngine.js"></script>
```

## 输出结构

```json
{
  "main_role": "...",
  "secondary_role": "...",
  "mirror_role": "...",
  "scores": {
    "cognition": 0.25,
    "agency": -0.125,
    "affect": 0.5,
    "value": -0.25
  },
  "intensity": {
    "cognition": 0.25,
    "agency": 0.125,
    "affect": 0.5,
    "value": 0.25
  }
}
```

## 测试

```bash
node test/scoringEngine.test.js
```
