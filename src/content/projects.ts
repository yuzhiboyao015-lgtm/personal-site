/**
 * 作品列表 —— TODO(你)：换成自己的项目。
 * 想加一个项目就往数组里 push 一条，首页和卡片布局会自动跟着变。
 */
export type Project = {
  slug: string;
  title: string;
  /** 一句话说清"这是什么"，别写"一个基于 XX 的系统" */
  summary: string;
  year: string;
  /** 3-5 个标签，技术栈或领域 */
  tags: string[];
  /** 在线地址，没有就删掉 */
  demo?: string;
  /** 仓库地址，没有就删掉 */
  repo?: string;
  /** 首页只放大卡片给 featured 的项目（建议 3 个） */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "interactive-portfolio",
    title: "会动的个人站",
    summary: "就是你正在看的这个站：滚动触发、3D 粒子、亮暗主题，全部自己做。",
    year: "2026",
    tags: ["Next.js", "Motion", "Three.js"],
    demo: "https://example.com",
    repo: "https://github.com/yourname/personal-site",
    featured: true,
  },
  {
    slug: "study-timer",
    title: "自习计时器",
    summary: "番茄钟 + 每天学习时长可视化，数据只存在本地，不上传任何东西。",
    year: "2025",
    tags: ["React", "IndexedDB", "图表"],
    repo: "https://github.com/yourname/study-timer",
    featured: true,
  },
  {
    slug: "campus-map",
    title: "校园地图小工具",
    summary: "把教学楼、食堂、打印店标在图上，支持搜索和最短路径提示。",
    year: "2025",
    tags: ["地图 API", "TypeScript"],
    demo: "https://example.com",
    featured: true,
  },
  {
    slug: "note-flow",
    title: "笔记流转实验",
    summary: "把散落的 Markdown 笔记汇总成一棵可折叠的知识树，纯前端实现。",
    year: "2024",
    tags: ["Vite", "Markdown"],
    repo: "https://github.com/yourname/note-flow",
  },
  {
    slug: "shell-scripts",
    title: "我的脚本杂货铺",
    summary: "一堆省时间的小脚本：批量重命名、图片压缩、环境自检。",
    year: "2024",
    tags: ["Node", "CLI"],
    repo: "https://github.com/yourname/scripts",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
