"use strict";
var __assign = (this && this.__assign) || function () {
    return Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];
            y = 0;
        } finally { f = t = 0; }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("@libs/fetch");
var filterInputs_1 = require("@libs/filterInputs");
var novelStatus_1 = require("@libs/novelStatus");

var SixtyNineShu = /** @class */ (function () {
    function SixtyNineShu() {
        this.fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; M2102K1AC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.118 Mobile Safari/537.36',
                'Referer': 'https://69shuba.cx/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9'
            },
            credentials: 'include',
            timeout: 30000
        };
        this.id = '69shuba';
        this.name = '69主站';
        this.icon = 'src/cn/69shuba/icon.png';
        this.site = 'https://69shuba.cx';
        this.version = '0.0.1';
        this.filters = {
            category: {
                label: '分类',
                value: 'last',
                options: [
                    { label: '最近更新', value: 'last' },
                    { label: '男生', value: 'blist/male' },
                    { label: '女生', value: 'blist/female' },
                    { label: '人气榜', value: 'blist/monthvisit_0_0_{{page}}.htm' },
                    { label: '连载', value: 'blist/monthvisit_0_2_{{page}}.htm' },
                    { label: '全本', value: 'blist/monthvisit_0_1_{{page}}.htm' },
                    { label: '推荐', value: 'blist/allvote_0_0_{{page}}.htm' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }

    SixtyNineShu.prototype.popularNovels = function (pageNo, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, $, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        var path = filters && filters.category && filters.category.value || "last";
                        if (path === "last") {
                            url = this.site + "/last";
                        } else if (/{{page}}/.test(path)) {
                            url = this.site + "/" + path.replace("{{page}}", pageNo.toString());
                        } else if (/^blist\//.test(path)) {
                            url = this.site + "/" + path;
                        } else {
                            url = this.site + "/blist/" + path + "_" + pageNo + ".htm";
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _c.sent();
                        if (!body) throw Error('无法获取小说列表，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $(".newbox ul li,.newlistbox ul li,.recentupdate2 ul li").each(function (_, el) {
                            try {
                                var novelName = $(el).find("h3,a").text().trim();
                                var path = $(el).find("a").first().attr("href");
                                var novelCover = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
                                path = path ? (path.startsWith("http") ? path.replace(_this.site, "") : path) : "";
                                novelCover = novelCover && !novelCover.startsWith('http') ? _this.site + novelCover : novelCover;
                                if (novelName && path) {
                                    novels.push({ name: novelName, cover: novelCover, path: path });
                                }
                            } catch (e) { }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };

    SixtyNineShu.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, postData, body, $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1) return [2 /*return*/, []];
                        searchUrl = this.site + "/modules/article/search.php";
                        postData = new URLSearchParams();
                        postData.append("searchkey", searchTerm);
                        postData.append("submit", "Search");
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, __assign(__assign({}, this.fetchOptions), { method: "POST", body: postData }))];
                    case 1:
                        body = _a.sent();
                        if (!body) throw Error('无法获取搜索结果，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $(".newbox ul li,.newlistbox ul li,.recentupdate2 ul li").each(function (_, el) {
                            try {
                                var novelName = $(el).find("h3,a").text().trim();
                                var path = $(el).find("a").first().attr("href");
                                var novelCover = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
                                path = path ? (path.startsWith("http") ? path.replace(_this.site, "") : path) : "";
                                novelCover = novelCover && !novelCover.startsWith('http') ? _this.site + novelCover : novelCover;
                                if (novelName && path) {
                                    novels.push({ name: novelName, cover: novelCover, path: path });
                                }
                            } catch (e) { }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };

    SixtyNineShu.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, $, coverUrl, summary, author, statusText, genres, status, chapters, tocPath, tocUrl, tocBody, $$, chapterSet, items;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath.replace(/\/$/, "");
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body) throw Error('无法获取小说内容，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        coverUrl = $("img[data-src],img[src]").attr("data-src") || $("img[data-src],img[src]").attr("src");
                        coverUrl = coverUrl && !coverUrl.startsWith('http') ? this.site + coverUrl : coverUrl;
                        summary = $(".navtxt p").last().html() || $(".content p").text().trim() || $(".bjianjie").text().trim() || "暂无简介";
                        author = $(".bauthor,.labelbox label").first().text().replace(/作者：/, "").trim() || "未知作者";
                        statusText = $(".labelbox label").eq(2).text().trim() || "";
                        genres = $(".labelbox label").eq(1).text().trim() || "";
                        status = /连载|连載/.test(statusText) ? novelStatus_1.NovelStatus.Ongoing : novelStatus_1.NovelStatus.Completed;
                        chapters = [];
                        tocPath = novelPath.replace(/\.html?$/, "/");
                        tocUrl = tocPath.startsWith("/") ? this.site + tocPath : this.site + "/" + tocPath;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(tocUrl, this.fetchOptions)];
                    case 2:
                        tocBody = _a.sent();
                        if (tocBody) {
                            $$ = (0, cheerio_1.load)(tocBody);
                            chapterSet = new Set();
                            items = $$(".catalog:last-child>ul>li").toArray();
                            items.forEach(function (el) {
                                var chapterName = $$(el).find("a").text().trim();
                                var chapterUrl = $$(el).find("a").attr("href");
                                if (!chapterName || !chapterUrl) return;
                                chapterName = _this.cleanChapterName(chapterName);
                                chapterUrl = chapterUrl.startsWith("http") ? chapterUrl : _this.site + chapterUrl;
                                if (chapterName && !chapterSet.has(chapterUrl)) {
                                    chapters.push({ name: chapterName, path: chapterUrl.replace(_this.site, "") });
                                    chapterSet.add(chapterUrl);
                                }
                            });
                        }
                        return [2 /*return*/, {
                                path: novelPath,
                                chapters: chapters,
                                name: $("h1").first().text().trim() || $("title").text().replace(/-.*$/, "") || "未知标题",
                                cover: coverUrl,
                                summary: summary,
                                author: author,
                                artist: undefined,
                                status: status,
                                genres: genres,
                            }];
                }
            });
        });
    };

    SixtyNineShu.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, content, hasMoreContent, currentUrl, maxPages, pageCount, body, $, pageText, nextContentLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        content = "";
                        hasMoreContent = true, currentUrl = url, maxPages = 100, pageCount = 0;
                        _a.label = 1;
                    case 1:
                        if (!(hasMoreContent && pageCount < maxPages)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, fetch_1.fetchText)(currentUrl, this.fetchOptions)];
                    case 2:
                        body = _a.sent();
                        if (!body) return [3 /*break*/, 3];
                        $ = (0, cheerio_1.load)(body);
                        pageText =
                            $(".content,.contxt,.txtnav").html() ||
                                $(".content").text() ||
                                $(".contxt").text() || "";
                        pageText = pageText
                            .replace(/<h1[\s\S]+?<\/h1>|^<\s*[a-z]+.*?>|<\/[a-z]+>$|(?<!^)<div[\s\S]*?<\/div>\s*/g, "")
                            .replace(/\s*\(本章完\)\s*$|第.*章.*/g, "");
                        content += pageText + "\n";
                        nextContentLink = $('a:contains("下一页")').attr("href");
                        if (nextContentLink && nextContentLink !== "javascript:void(0);") {
                            currentUrl = nextContentLink.startsWith("http") ? nextContentLink : this.site + nextContentLink;
                            pageCount++;
                        } else {
                            hasMoreContent = false;
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        return [2 /*return*/, content || "<p>章节内容为空</p>"];
                }
            });
        });
    };

    SixtyNineShu.prototype.cleanChapterName = function (name) {
        return name
            .replace(/••/g, "")
            .replace(/[【〔〖［『「《]\d+[】〔〖［『「《]/g, "")
            .replace(/^(\d+)[.．、,，]*第/, "第")
            .replace(/^(正文|VIP章节|最新章节)?(\s+|_)?/, "")
            .replace(/[\(\{（｛【〔［].*?(求含理更谢乐发推票盟补加字Kk\/).*/, "")
            .replace(/^(\d+)[、．.，,]第.+章/, "第$1章")
            .replace(/^(\d+)、\d+、/, "第$1章 ")
            .replace(/^(\d+)、\d+/, "第$1章")
            .replace(/^(第.+章)\s?\d+/, "$1")
            .replace(/^(\d+)、/, "第$1章 ")
            .replace(/^(第.+章)\s?第.+章/, "$1")
            .replace(/第\s?(.+)\s?章/, "第$1章")
            .replace(/.*(?:chapter|Chapter|section|Section|part|Part)\s*(\d+)\s*/, "第$1章 ")
            .replace(/[\(\（【〔［『「《｛{].*$/, "")
            .replace(/[\[。]/g, "")
            .replace(/(章)([^\s]+)(\s·)/, "$1 $2$3")
            .trim();
    };

    return SixtyNineShu;
}());
exports.default = new SixtyNineShu();
