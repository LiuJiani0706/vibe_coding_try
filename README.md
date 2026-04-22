# Magic Archetype Test Scoring Engine

纯 JavaScript（无依赖）评分引擎，可同时在：
- Node.js（后端/脚本）
- 浏览器（GitHub Pages）
直接使用。

## 为什么你打开 GitHub Pages 看到 README 文本？

因为仓库之前没有 `index.html` 页面入口。
现在已新增根目录 `index.html`，GitHub Pages 会优先展示它，而不是 README 文本。

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

### 页面入口

仓库根目录的 `index.html` 已内置示例 UI，可直接选择 16 个答案并计算结果。

### 手工引入脚本

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
