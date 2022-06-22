# PKUHelper Score

这是由校友 [@xmcp](https://github.com/xmcp) 开发的成绩查询工具，深受学生喜爱。但 PKUHelper 开发者团队于 2020 年 11 月[被迫交出运营权](https://pkuhelper-web.github.io/announce_v3.html)，同时该工具的源码 https://github.com/pkuhelper-web/score 也因不明原因被删除。

根据 [Web Archive](https://web.archive.org/web/20201031234921/https://github.com/pkuhelper-web/score)，目前已知该项目的最新提交是 `e4dfc28`（2022 年 8 月），但提交内容已不可考。现存的最新提交记录为 `1b97c91`，由 [@cedric341561](https://github.com/cedric341561) 的[分支](https://github.com/cedric341561/score)可得。

> 我曾询问 [@xmcp](https://github.com/xmcp) 是否可提供代码，对方已读不回。（？？？）

出于保护性的目的，我计划重建本项目源码；但由于我不熟悉 React，我将改用 Angular 重写。获取成绩的 API 暂时仍使用 `pkuhelper.pku.edu.cn/api_xmcp`。但由于该 API 并不可靠，我有可能会添加直接从 Portal 获取成绩的方法。
