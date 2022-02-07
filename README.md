![行云](https://7463-tcb-nkd87viq9wheg653bca0d-a8621b-1304207482.tcb.qcloud.la/XingYun/行云截图.png)

# 行云（XingYun）- Serverless函数工作流可视化编辑器

第二届云原生编程挑战赛获奖作品

-> [立即体验](https://xingyun.doyi.online) <-

## 简介（Introduction）

Serverless工作流在未来拥有巨大的潜力，主流云厂商都已上线了相关Serverless产品，但用户只能以DSL的方式编排函数工作流，行云（XingYun）为解决该问题而诞生。

目前，行云已经支持阿里云函数工作流可视化元素[包括pass, task, wait, parallel, choice(condition, default), foreach, succeed, fail]与FDL（工作流流程定义语言）的双向转换，即同时支持可视化拖拽方式创建和编辑FDL。

可能还存在潜在bug，欢迎前来修复或贡献新功能～

## 功能介绍（Features）

 * 可视化创建工作流： <br/>
    全程可视化操作，只需拖拽即可定义流程，连线即可定义执行顺序。
 * 可视化编辑已有的工作流： <br/>
    因为行云已经支持FDL与可视化元素间的双向转换，用户能够以与创建工作流相同的体验来编辑工作流。
 * 一键部署： <br/>
    流程定义/修改完成后可以直接一键部署至阿里云函数工作流服务。

## 未来（Todo）

* 支持每个步骤的入参和出参设置
* 支持腾讯云、华为云的函数工作流可视化编辑

## 视频演示（Video demo）

[![播放视频](https://7463-tcb-nkd87viq9wheg653bca0d-a8621b-1304207482.tcb.qcloud.la/XingYun/bilibili播放图.png)](https://www.bilibili.com/video/BV1tQ4y1B7PU)

## 说明（Directions）

1. 访问Web上线版本：(推荐) 

    行云: https://xingyun.doyi.online

    建议使用Chrome，Edge或Firefox浏览器，请不要使用IE，Safari。

2. 通过yarn本地启动项目

#### 安装依赖
```
yarn install
```

#### 启动
```
yarn serve
```


## 时间线（Time Line）

- 2022年01月11日 荣获第二届云原生大赛季军
- 2021年10月10日 行云正式版上线(https://xingyun.doyi.online)
- 2021年10月09日 支持对已有的工作流进行编辑
- 2021年10月09日 全新界面开发完毕
- 2021年09月06日 行云单页demo上线
- 2021年09月05日 工作流一键部署功能开发完毕
- 2021年09月01日 工作流图形构建功能开发完毕
- 2021年08月10日 立项

## 关于作者（About Author）

Hi，我是东南dnf，目前计科大二在读，您可以通过以下方式联系到我。

微信(Wechat): zjy2414

邮箱(E-Mail): zjy2414@outlook.com

## 致谢（Thanks）

Ant Design，Creative Tim，Antv
