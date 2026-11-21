# 图解式知识口播 · illustrated-mg

把一个知识点做成能跟着口播看懂的竖屏 MG 短片。示例里，菜单从两杯变成三杯，中杯的价格和容量都没变，变化的是顾客比较它的方式。

![两档咖啡菜单变为三档，中杯移到中间](preview/menu.gif)

## 安装技能

将仓库克隆到个人技能目录。在支持 Agent Skills 的助手中使用，例如“用 $illustrated-mg 把这段口播做成竖屏图解，按我给的录音安排动画和字幕”。

```sh
git clone https://github.com/alexkwok213/illustrated-mg.git ~/.agents/skills/illustrated-mg
```

## 跑通示例

准备 Node.js 及 npm，复制模板到单独的制作目录。首次安装依赖和启动 Remotion 可能需要联网。

```sh
cp -R ~/.agents/skills/illustrated-mg/assets/remotion ./my-explainer
cd my-explainer
npm install
npm run render
```

输出为 `out.mp4`，画幅 1080 × 1920，帧率 30 fps。运行 `npm run studio` 可逐帧预览。

在 `example.json` 里替换选项、场景、字幕和时码。公开示例使用无声演示时间线；制作口播版时，把有权使用的整段录音放进 `public/`，填写 `audio` 文件名，再以这份录音的发声位置调整时间线。镜头支持选项对比、单个案例、因果路径和总结清单。完整制作方法见 [SKILL.md](SKILL.md)。

示例的价格与容量均为演示数据。折中效应的研究来源见 [Simonson（1989）](https://doi.org/10.1086/209205)。
