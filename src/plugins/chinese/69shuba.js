"use strict";
import { load as cheerioLoad } from "cheerio";
import { fetchText } from "@libs/fetch";
import { FilterTypes } from "@libs/filterInputs";
import { NovelStatus } from "@libs/novelStatus";

/** 站点变量管理（兼容自定义主域名、随机UA、特殊模式、cookie等） */
const defaultDomains = [
    "https://69shuba.cx",
    "https://69shu.ac",
    "https://www.69shu.cx",
    "https://www.69shuba.pro",
    "https://www.69yuedu.net",
];
let siteVariable: {
    domain?: string;
    ua?: string;
    useDefaultCover?: boolean;
    forceBase?: boolean;
} = {};

function getDomain() {
    // 支持自定义domain变量（如未设置则自动用第一个主域名）
    return siteVariable.domain || defaultDomains[0];
}
function randomUa() {
    // 生成随机UA
    let r = (a: number, b: number) => Math.floor(Math.random() * (b - a) + a),
        x = (l: number) => { let s = ""; for (let i = 0; i < l; i++) s += r(0, 10); return s },
        v = r(500, 700) + "." + x(2);
    return `Mozilla/5.0 (Linux; Android ${r(5, 15)}; wv) AppleWebKit/${v} (KHTML, like Gecko) Chrome/${r(76, 122)}.0.${x(4)}.${x(2)} Mobile Safari/${v}`;
}
function fixImg(img: string | undefined, url: string): string | undefined {
    // 自动修正封面链接，兼容全部格式（含默认封面逻辑）
    if (!img) return undefined;
    if (siteVariable.useDefaultCover || img.endsWith("nocover.jpg")) {
        // 默认封面
        return "https://static.69shuba.com/modules/article/images/nocover.jpg";
    }
    if (!img.endsWith("s.jpg") && /\/(\d+)(\.[^.]*)?$/.test(url)) {
        const m = url.match(/\/(\d+)(\.[^.]*)?$/);
        if (m)
            img = `https://static.69shuba.com/files/article/image/${Math.floor(Number(m[1]) / 1000)}/${m[1]}/${m[1]}s.jpg`;
    }
    if (!/^https?:\/\//.test(img)) img = getDomain() + img;
    return img;
}
function completeUrl(url: string, base?: string): string {
    // 兼容全部分站相对路径
    if (!/^https?:/.test(url)) {
        if (url.startsWith("/")) return getDomain() + url;
        if (base && /^https?:/.test(base)) {
            return base.replace(/\/+$/, "") + "/" + url.replace(/^\/+/, "");
        }
        return getDomain() + "/" + url.replace(/^\/+/, "");
    }
    return url;
}

class SixtyNineShu {
    fetchOptions: any;
    id: string;
    name: string;
    icon: string;
    site: string;
    version: string;
    filters: any;

    constructor() {
        // 你可以在UI设置里修改siteVariable变量，切换域名/封面/UA
        this.fetchOptions = {
            headers: {
                "User-Agent": siteVariable.ua || randomUa(),
                "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "Referer": getDomain() + "/blist/",
                "cookie": "zh_choose=s",
            },
            credentials: "include",
            timeout: 30000,
        };
        this.id = "69shuba";
        this.name = "69主站";
        this.icon = "src/cn/69shuba/icon.png";
        this.site = getDomain();
        this.version = "1.0.0";
        this.filters = {
            category: {
                label: "分类",
                value: "last",
                options: [
                    { label: "最近更新", value: "last" },
                    { label: "男生", value: "blist/male" },
                    { label: "女生", value: "blist/female" },
                    { label: "人气榜", value: "blist/monthvisit_0_0_{{page}}.htm" },
                    { label: "连载", value: "blist/monthvisit_0_2_{{page}}.htm" },
                    { label: "全本", value: "blist/monthvisit_0_1_{{page}}.htm" },
                    { label: "推荐", value: "blist/allvote_0_0_{{page}}.htm" },
                ],
                type: FilterTypes.Picker,
            },
        };
    }

    /** 分类与发现 */
    async popularNovels(pageNo: number, { showLatestNovels, filters }: any) {
        let path = filters?.category?.value || "last";
        let url = "";
        if (path === "last") {
            url = `${getDomain()}/last`;
        } else if (/{{page}}/.test(path)) {
            url = `${getDomain()}/${path.replace("{{page}}", pageNo.toString())}`;
        } else if (/^blist\//.test(path)) {
            url = `${getDomain()}/${path}`;
        } else {
            url = `${getDomain()}/blist/${path}_${pageNo}.htm`;
        }
        const body = await fetchText(url, this.fetchOptions);
        if (!body) throw Error("无法获取小说列表，请检查网络");
        const $ = cheerioLoad(body);
        const novels: any[] = [];
        $(".newbox ul li,.newlistbox ul li,.recentupdate2 ul li").each((_, el) => {
            try {
                const novelName = $(el).find("h3,a").text().trim();
                let path = $(el).find("a").first().attr("href");
                let novelCover = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
                path = path ? (path.startsWith("http") ? path.replace(getDomain(), "") : path) : "";
                novelCover = fixImg(novelCover, completeUrl(path || ""));
                if (novelName && path) {
                    novels.push({ name: novelName, cover: novelCover, path });
                }
            } catch { }
        });
        return novels;
    }

    /** 搜索 */
    async searchNovels(searchTerm: string, pageNo: number) {
        if (pageNo > 1) return [];
        const searchUrl = `${getDomain()}/modules/article/search.php`;
        const postData = new URLSearchParams();
        postData.append("searchkey", searchTerm);
        postData.append("submit", "Search");
        const body = await fetchText(searchUrl, {
            ...this.fetchOptions,
            method: "POST",
            body: postData,
        });
        if (!body) throw Error("无法获取搜索结果，请检查网络");
        const $ = cheerioLoad(body);
        const novels: any[] = [];
        $(".newbox ul li,.newlistbox ul li,.recentupdate2 ul li").each((_, el) => {
            try {
                const novelName = $(el).find("h3,a").text().trim();
                let path = $(el).find("a").first().attr("href");
                let novelCover = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
                path = path ? (path.startsWith("http") ? path.replace(getDomain(), "") : path) : "";
                novelCover = fixImg(novelCover, completeUrl(path || ""));
                if (novelName && path) {
                    novels.push({ name: novelName, cover: novelCover, path });
                }
            } catch { }
        });
        return novels;
    }

    /** 书籍详情及目录，支持排序、去重、兼容aid/items结构 */
    async parseNovel(novelPath: string) {
        const url = getDomain() + novelPath.replace(/\/$/, "");
        const body = await fetchText(url, this.fetchOptions);
        if (!body) throw Error("无法获取小说内容，请检查网络");
        const $ = cheerioLoad(body);

        // 封面优先 img[data-src]，否则img[src]
        let coverUrl = $("img[data-src],img[src]").attr("data-src") || $("img[data-src],img[src]").attr("src");
        coverUrl = fixImg(coverUrl, url);
        let summary = $(".navtxt p").last().html() || $(".content p").text().trim() || $(".bjianjie").text().trim() || "暂无简介";
        let author = $(".bauthor,.labelbox label").first().text().replace(/作者：/, "").trim() || "未知作者";
        let statusText = $(".labelbox label").eq(2).text().trim() || "";
        let genres = $(".labelbox label").eq(1).text().trim() || "";
        const status = /连载|连載/.test(statusText) ? NovelStatus.Ongoing : NovelStatus.Completed;

        // 目录页获取并净化排序，支持 aid/items/json/ul/li 结构自动
        let chapters: any[] = [];
        let tocPath = novelPath.replace(/\.html?$/, "/");
        let tocUrl = tocPath.startsWith("/") ? getDomain() + tocPath : getDomain() + "/" + tocPath;
        const tocBody = await fetchText(tocUrl, this.fetchOptions);
        if (tocBody) {
            const $$ = cheerioLoad(tocBody);
            let chapterSet = new Set<string>();
            // 目录li可能有data-num属性（排序去重），否则直接取全部
            let items = $$(".catalog:last-child>ul>li").toArray();
            if (items.length > 0) {
                // 处理乱序：有data-num用data-num排序，无则顺序，全部去重
                items = items.sort((a: any, b: any) => {
                    const numA = $$(a).attr("data-num") || "0";
                    const numB = $$(b).attr("data-num") || "0";
                    return Number(numA) - Number(numB);
                });
                items.forEach(el => {
                    let chapterName = $$(el).find("a").text().trim();
                    let chapterUrl = $$(el).find("a").attr("href");
                    if (!chapterName || !chapterUrl) return;
                    chapterName = this.cleanChapterName(chapterName);
                    chapterUrl = completeUrl(chapterUrl, tocUrl);
                    if (chapterName && !chapterSet.has(chapterUrl)) {
                        chapters.push({ name: chapterName, path: chapterUrl.replace(getDomain(), "") });
                        chapterSet.add(chapterUrl);
                    }
                });
            }
        }
        return {
            path: novelPath,
            chapters,
            name: $("h1").first().text().trim() || $("title").text().replace(/-.*$/, "") || "未知标题",
            cover: coverUrl,
            summary,
            author,
            artist: undefined,
            status,
            genres,
        };
    }

    /** 单章正文，自动分多页拼接，净化标题/广告/div/冗余内容 */
    async parseChapter(chapterPath: string) {
        let url = getDomain() + chapterPath;
        let content = "";
        let hasMoreContent = true, currentUrl = url, maxPages = 100, pageCount = 0;
        while (hasMoreContent && pageCount < maxPages) {
            const body = await fetchText(currentUrl, this.fetchOptions);
            if (!body) break;
            const $ = cheerioLoad(body);
            let pageText =
                $(".content,.contxt,.txtnav").html() ||
                $(".content").text() ||
                $(".contxt").text() || "";
            // 过滤本章完、广告、div、标题等
            pageText = pageText
                .replace(/<h1[\s\S]+?<\/h1>|^<\s*[a-z]+.*?>|<\/[a-z]+>$|(?<!^)<div[\s\S]*?<\/div>\s*/g, "")
                .replace(/\s*\(本章完\)\s*$|第.*章.*/g, "");
            content += pageText + "\n";
            // 判断有无下一页
            let nextContentLink = $('a:contains("下一页")').attr("href");
            if (nextContentLink && nextContentLink !== "javascript:void(0);") {
                currentUrl = completeUrl(nextContentLink, url);
                pageCount++;
            } else {
                hasMoreContent = false;
            }
        }
        return content || "<p>章节内容为空</p>";
    }

    /** 章节名净化（完整移植booksource所有replace规则） */
    cleanChapterName(name: string): string {
        return name
            // 清除特殊符号“••”
            .replace(/••/g, "")
            // 清除章节标题里的数字角标【15】和中英文全角书名号
            .replace(/[【〔〖［『「《]\d+[】〕〗］』」》]/g, "")
            // 标准化：处理如 "1.第十章" → "第十章"
            .replace(/^(\d+)[.．、,，]*第/, "第")
            // 清除无用前缀和投票宣传
            .replace(/^(正文|VIP章节|最新章节)?(\s+|_)?/, "")
            .replace(/[\(\{（｛【〔［].*?(求含理更谢乐发推票盟补加字Kk\/).*/, "")
            // 标准化编号样式，如 "3、第十章" → "第3章"
            .replace(/^(\d+)[、．.，,]第.+章/, "第$1章")
            .replace(/^(\d+)、\d+、/, "第$1章 ")
            .replace(/^(\d+)、\d+/, "第$1章")
            .replace(/^(第.+章)\s?\d+/, "$1")
            .replace(/^(\d+)、/, "第$1章 ")
            .replace(/^(第.+章)\s?第.+章/, "$1")
            .replace(/第\s?(.+)\s?章/, "第$1章")
            // 英文Chapter/Section/Part转中文
            .replace(/.*(?:chapter|Chapter|section|Section|part|Part)\s*(\d+)\s*/, "第$1章 ")
            // 清除所有括号及其后的内容
            .replace(/[\(\（【〔［『「《｛{].*$/, "")
            // 清除零散特殊符号及句号
            .replace(/[\[。]/g, "")
            // 章节名格式优化，如 "章副标题 · 副标题" → "章 副标题 · 副标题"
            .replace(/(章)([^\s]+)(\s·)/, "$1 $2$3")
            .trim();
    }

    /** 可选：UI设置变量（自定义域名/UA/封面/强制base） */
    setVariable(k: keyof typeof siteVariable, v: any) {
        siteVariable[k] = v;
    }
}

export default new SixtyNineShu();
