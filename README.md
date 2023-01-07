# PKUHelper Score

这是由校友 [@xmcp](https://github.com/xmcp) 开发的成绩查询工具，深受学生喜爱。但 PKUHelper 开发者团队于 2020 年 11 月[被迫交出运营权](https://pkuhelper-web.github.io/announce_v3.html)，同时该工具的源码 https://github.com/pkuhelper-web/score 也因不明原因被删除。

根据 [Web Archive](https://web.archive.org/web/20201031234921/https://github.com/pkuhelper-web/score)，目前已知该项目的最新提交是 `e4dfc28`（2022 年 8 月），但提交内容已不可考。现存的最新提交记录为 `1b97c91`，由 [@cedric341561](https://github.com/cedric341561) 的[分支](https://github.com/cedric341561/score)可得。

> 我曾询问 [@xmcp](https://github.com/xmcp) 是否可提供代码，对方已读不回。（？？？）

出于保护性的目的，我计划重建本项目源码；但由于我不熟悉 React，便改用 Angular 重写。获取成绩~~的 API 仍保留为 `pkuhelper.pku.edu.cn/api_xmcp`。但由于该 API 并不可靠，我同时添加~~直接从北大门户获取成绩的方法。

**2023.1.7 更新** PKUHelper 改版为“北大树洞”，原有 User Token 机制及相关 API 被破坏。仅保留北大门户获取成绩的方法。

## 与现在运行的 PKUHelper 成绩查询的不同点

- 由于改用 Angular 重写，某些细节可能不同。比如：
  - GPA 计算器的显示方式不同；
  - 刷新时间的显示文字不同；
  - 在第一次打开网页时就询问通知权限；
  - 允许通过修改分数来查看“彩虹”效果，但没有动态效果；
  - ……
- 移除了指向[“课程测评”](https://courses.pinzhixiaoyuan.com/)的链接。与 PKUHelper 不同，本项目与“课程测评”不存在合作关系；因此本项目不能冒用 PKUHelper 的身份与“课程测评”通信。
- 为强调项目的严肃性，移除了“八十四”彩蛋。
- 改用 IAAA 登录（通过 Vercel Serverless Function 部署）。
