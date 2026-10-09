/**
 * 文章 —— 现在是数据驱动（不用 MDX、不用数据库，改起来最快）。
 *
 * 写法约定（够用了，别搞复杂）：
 *   "## 小标题"  → 二级标题
 *   "- 列表项"   → 无序列表
 *   "> 引用"     → 引用块
 *   其他         → 普通段落
 *
 * 以后文章多了想换成 MDX / 数据库，替换 post-renderer.tsx 那一个文件就行。
 */
export type Post = {
  slug: string;
  title: string;
  /** ISO 日期，例如 2026-03-08 */
  date: string;
  excerpt: string;
  tags: string[];
  body: string;
};

export const posts: Post[] = [
  {
    slug: "why-i-built-this",
    title: "为什么我要自己写一个站",
    date: "2026-03-08",
    excerpt:
      "模板站三分钟就能套一个，但模板不会告诉你：你想让别人记住你哪一点。这个站是我给出的答案。",
    tags: ["随笔", "建站"],
    body: `
用模板搭站是真的快。选个主题，填上名字和头像，十分钟就能上线一个看起来挺像样的页面。

问题是，做完之后我自己都不想打开第二次。因为它长得和一百个别人的站一模一样，而且它答不出那个最关键的问题：

## 你想让别人记住你哪一点

模板能给你排版，给不了你这个。所以我决定手写：从配色、动效到那些"没什么用但很好玩"的小交互，全部自己定。

- 首页第一屏必须三秒内说清我是谁
- 滚动的时候要有东西在动，但不能晃到看不下去
- 移动端不能崩，字体不能糊

## 过程比结果重要

写这个站最大的收获不是站本身，是我终于搞明白了滚动动画、WebGL 渲染循环这些东西到底怎么跑起来的。

> 工具会替你干活，但不会替你长本事。想长本事，就得自己动手拆一遍。

如果你也在犹豫要不要自己写一个，我的建议是：先写一个只有一页的版本，把名字、一句话介绍、三个作品放上去。剩下的慢慢加。
`,
  },
  {
    slug: "scroll-animation-notes",
    title: "滚动动效踩坑记录",
    date: "2026-02-21",
    excerpt:
      "入场动画写了三版才不晕：阈值、缓动、还有那个最重要的——什么时候该什么都不做。",
    tags: ["前端", "动效"],
    body: `
第一版我把所有元素都加上了入场动画，结果整页像在抽搐。

## 三个教训

- **阈值别太敏感**：\`margin: "-80px"\` 这类提前量能避免元素贴着底边才动，观感自然很多
- **错开而不是同时**：列表用 stagger 让子项依次出现，比齐刷刷弹出来高级
- **尊重系统设置**：\`prefers-reduced-motion\` 一定要处理，有人真的会晕

## 缓动曲线

默认的 \`ease\` 用在入场动画上会显得软。我用的是：

\`\`\`
cubic-bezier(0.22, 1, 0.36, 1)
\`\`\`

起步快、尾巴长，收得干净。

> 动效的目的是让人看懂"什么变了"，不是证明你会写动效。想清楚这句话，一半的花哨需求会自动消失。
`,
  },
  {
    slug: "webgl-first-scene",
    title: "我的第一个 WebGL 场景",
    date: "2026-01-14",
    excerpt:
      "从一堆看不懂的矩阵，到屏幕上终于浮起一片会跟着鼠标转的粒子——中间隔了四个晚上。",
    tags: ["WebGL", "Three.js"],
    body: `
真正让我卡住的不是 API，是坐标系：为什么我的相机在原点什么都看不到？

## 最小可跑的路径

- 先让一个立方体转起来，别一上来就想做场景
- 相机放远点（\`z = 5\` 是个好起点）
- 动画循环里只改你真正需要改的东西

## 粒子怎么做出"呼吸感"

给每个点一个随机相位，用 \`sin(time + phase)\` 驱动偏移。同一个公式，相位不同，整片粒子就活了。

> 3D 页面最容易翻车的地方不是技术，是性能：手机上跑不动的时候，再酷也等于零。
`,
  },
];

export const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 粗略估算阅读时间（中文按字数，英文按词数） */
export function readingTime(body: string) {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[A-Za-z]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 200));
}
