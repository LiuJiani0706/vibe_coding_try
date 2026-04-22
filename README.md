# 暗潮人格测试（GitHub Pages）

这是一个纯静态站点（HTML/CSS/JS），可直接部署到 GitHub Pages。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173`。

## 部署到 GitHub Pages

1. 把仓库推送到 GitHub（默认分支 `main` 或 `master`）。
2. 在仓库 `Settings -> Pages` 中，将 `Source` 设为 **GitHub Actions**。
3. 推送代码后，`.github/workflows/deploy-pages.yml` 会自动部署。
4. 部署成功后，访问：
   - `https://<你的GitHub用户名>.github.io/<仓库名>/`

> 注意：首次部署通常需要 1~5 分钟。

## 功能

- 16 题人格测试，支持上一题返回修改。
- 按 4 维度评分并映射到 10 个原型。
- 使用随机扰动 + 欧式距离 + softmax 概率输出。
- 强制规则优先（极端情况）。
- 结果页支持系统分享、复制文案、二维码微信扫码分享。
