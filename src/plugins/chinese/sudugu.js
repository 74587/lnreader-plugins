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
            console.error('Generator error:', e);
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

var SuduGu = /** @class */ (function () {
    function SuduGu() {
        this.fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 14; zh-cn; M2102K1AC Build/UKQ1.231207.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36 MQQBrowser/10.1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,us;q=0.5',
                'Referer': 'https://www.sudugu.com/',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1'
            },
        };
        this.id = 'sudugu';
        this.name = '速读谷';
        this.icon = 'src/cn/sudugu/icon.png';
        this.site = 'https://www.sudugu.com';
        this.version = '0.2.2';
        this.filters = {
            category: {
                label: '分类',
                value: 'wanjie',
                options: [
                    { label: '完结小说', value: 'wanjie' },
                    { label: '最新更新', value: 'zuixin' },
                    { label: '玄幻小说', value: 'xuanhuan' },
                    { label: '仙侠小说', value: 'xianxia' },
                    { label: '都市小说', value: 'dushi' },
                    { label: '历史小说', value: 'lishi' },
                    { label: '科幻小说', value: 'kehuan' },
                    { label: '轻小说', value: 'qing' },
                    { label: '悬疑小说', value: 'xuanyi' },
                    { label: '奇幻小说', value: 'qihuan' },
                    { label: '游戏小说', value: 'youxi' },
                    { label: '诸天无限', value: 'zhutianwuxian' },
                    { label: '军事小说', value: 'junshi' },
                    { label: '重生小说', value: 'chongsheng' },
                    { label: '武侠小说', value: 'wuxia' },
                    { label: '体育小说', value: 'tiyu' },
                    { label: '言情小说', value: 'yanqing' },
                ],
                type: filterInputs_1.FilterTypes.Picker,
            },
        };
    }
    SuduGu.prototype.popularNovels = function (pageNo, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, $, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = showLatestNovels
                            ? "".concat(this.site, "/zuixin/").concat(pageNo, ".html")
                            : "".concat(this.site, "/").concat(filters.category.value, "/").concat(pageNo, ".html");
                        console.log('Fetching popular novels:', url);
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _c.sent();
                        if (!body) {
                            console.error('Failed to fetch popular novels, empty response');
                            throw Error('无法获取小说列表，请检查网络');
                        }
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            try {
                                var novelName = $(el).find('h3 a').text().trim();
                                var novelCover = $(el).find('a img').attr('src');
                                var path = $(el).find('a').first().attr('href');
                                if (!novelName || !path) {
                                    console.warn('Skipping invalid novel:', { name: novelName, path: path });
                                    return;
                                }
                                path = path.replace(_this.site, '');
                                novels.push({
                                    name: novelName,
                                    cover: novelCover,
                                    path: path,
                                });
                            } catch (e) {
                                console.error('Error parsing novel item:', e);
                            }
                        });
                        console.log('Found novels:', novels.length);
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SuduGu.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, $, novel, chapters, hasMore, nextToc, _loop_1, this_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        console.log('Fetching novel:', url);
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body) {
                            console.error('Failed to fetch novel, empty response');
                            throw Error('无法获取小说内容，请检查网络');
                        }
                        $ = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            chapters: [],
                            name: $('.itemtxt h1 a').text().trim() || '未知标题',
                            cover: $('.item a img').attr('src'),
                            summary: $('.des p').text().trim(),
                            author: $('.itemtxt p').eq(1).find('a').attr('title') || $('.itemtxt p').eq(1).text().replace('作者：', '').trim() || '未知作者',
                            artist: undefined,
                            status: $('.itemtxt').text().includes('连载') ? novelStatus_1.NovelStatus.Ongoing : novelStatus_1.NovelStatus.Completed,
                            genres: $('.itemtxt p').eq(0).find('span').text().trim(),
                        };
                        chapters = [];
                        hasMore = true;
                        nextToc = url;
                        _loop_1 = function () {
                            var tocBody, tocCheerio, nextBtn;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        console.log('Fetching TOC:', nextToc);
                                        return [4 /*yield*/, (0, fetch_1.fetchText)(nextToc, this_1.fetchOptions)];
                                    case 1:
                                        tocBody = _b.sent();
                                        if (!tocBody) {
                                            console.error('Failed to fetch TOC, empty response');
                                            hasMore = false;
                                            return [2 /*return*/];
                                        }
                                        tocCheerio = (0, cheerio_1.load)(tocBody);
                                        tocCheerio('#list ul li').each(function (_, el) {
                                            try {
                                                var chapterName = tocCheerio(el).find('a').text().trim();
                                                var chapterUrl = tocCheerio(el).find('a').attr('href');
                                                if (!chapterUrl) {
                                                    console.warn('Skipping invalid chapter:', chapterName);
                                                    return;
                                                }
                                                if (!/^[ \u3000]{0,4}(序章|楔子|正文|终章|尾声|第\s{0,4}[\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\s{0,4}(章|节|集|部|篇)|[Cc]hapter\s{0,4}\d+|[Ss]ection\s{0,4}\d+|[Pp]art\s{0,4}\d+|\d+[、．.\s]|\d+[^\s\d]{2,4})/.test(chapterName)) {
                                                    console.warn('Chapter name filtered out:', chapterName);
                                                    return;
                                                }
                                                chapterName = chapterName
                                                    .replace(/••/g, '')
                                                    .replace(/[【〔〖［『「《]\d+[】〕〗］』」》]/g, '')
                                                    .replace(/^(\d+)[.．、,，]*第/, '第')
                                                    .replace(/^(正文|VIP章节|最新章节)?(\s+|_)?/, '')
                                                    .replace(/[\(\{（｛【〔［].*?(求含理更谢乐发推票盟补加字Kk\/).*/, '')
                                                    .replace(/^(\d+)[、．.，,]第.+章/, '第$1章')
                                                    .replace(/^(\d+)、\d+、/, '第$1章 ')
                                                    .replace(/^(\d+)、\d+/, '第$1章')
                                                    .replace(/^(第.+章)\s?\d+/, '$1')
                                                    .replace(/^(\d+)、/, '第$1章 ')
                                                    .replace(/^(第.+章)\s?第.+章/, '$1')
                                                    .replace(/第\s?(.+)\s?章/, '第$1章')
                                                    .replace(/.*(?:chapter|Chapter|section|Section|part|Part)\s*(\d+)\s*/, '第$1章 ')
                                                    .replace(/[\(\（【〔［『「《｛{].*$/, '')
                                                    .replace(/[\[。]/g, '')
                                                    .replace(/(章)([^\s]+)(\s·)/, '$1 $2$3')
                                                    .trim();
                                                if (!chapterUrl.startsWith('http')) chapterUrl = _this.site + chapterUrl;
                                                var relativeChapterUrl = chapterUrl.replace(_this.site, '');
                                                if (!chapters.some(function (chap) { return chap.path === relativeChapterUrl; })) {
                                                    chapters.push({
                                                        name: chapterName,
                                                        path: relativeChapterUrl,
                                                    });
                                                }
                                            } catch (e) {
                                                console.error('Error parsing chapter:', e);
                                            }
                                        });
                                        nextBtn = tocCheerio('a:contains("下一页")').attr('href');
                                        console.log('Next TOC URL:', nextBtn);
                                        if (nextBtn && nextBtn !== 'javascript:void(0);' && nextBtn !== nextToc) {
                                            try {
                                                nextToc = nextBtn.startsWith('http') ? nextBtn : _this.site + nextBtn;
                                            } catch (e) {
                                                console.warn('Invalid next page link found:', nextBtn);
                                                hasMore = false;
                                            }
                                        } else {
                                            hasMore = false;
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        if (!(hasMore && nextToc)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        novel.chapters = chapters;
                        console.log('Parsed chapters:', chapters.length);
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    SuduGu.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, content, hasMoreContent, currentUrl, _loop_2, this_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        console.log('Fetching chapter:', url);
                        content = '';
                        hasMoreContent = true;
                        currentUrl = url;
                        _loop_2 = function () {
                            var body, $, pageText, nextContentLink;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        console.log('Fetching chapter page:', currentUrl);
                                        return [4 /*yield*/, (0, fetch_1.fetchText)(currentUrl, this.fetchOptions)];
                                    case 1:
                                        body = _b.sent();
                                        if (!body) {
                                            console.error('Failed to fetch chapter, empty response');
                                            hasMoreContent = false;
                                            return [2 /*return*/];
                                        }
                                        $ = (0, cheerio_1.load)(body);
                                        pageText = $('.con p')
                                            .map(function (_, el) { return $(el).text().trim(); })
                                            .get()
                                            .filter(function (line) { return line !== ''; })
                                            .map(function (line) { return "<p>".concat(line, "</p>"); })
                                            .join('\n');
                                        content += pageText;
                                        nextContentLink = $('a:contains("下一页")').attr('href');
                                        console.log('Next content URL:', nextContentLink);
                                        if (nextContentLink && nextContentLink !== 'javascript:void(0);' && nextContentLink !== currentUrl) {
                                            try {
                                                currentUrl = nextContentLink.startsWith('http') ? nextContentLink : _this.site + nextContentLink;
                                            } catch (e) {
                                                console.warn('Invalid next content link found:', nextContentLink);
                                                hasMoreContent = false;
                                            }
                                        } else {
                                            hasMoreContent = false;
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _a.label = 1;
                    case 1:
                        if (!hasMoreContent) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_2()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        console.log('Chapter content length:', content.length);
                        return [2 /*return*/, content];
                }
            });
        });
    };
    SuduGu.prototype.searchNovels = function (searchTerm, pageNo) {
        return __awaiter(this, void 0, void 0, function () {
            var searchUrl, body, $, novels;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (pageNo > 1) {
                            console.log('Search only supports page 1');
                            return [2 /*return*/, []];
                        }
                        searchUrl = "".concat(this.site, "/i/sor.aspx?key=").concat(encodeURIComponent(searchTerm));
                        console.log('Searching novels:', searchUrl);
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body) {
                            console.error('Failed to fetch search results, empty response');
                            throw Error('无法获取搜索结果，请检查网络');
                        }
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            try {
                                var novelName = $(el).find('h3 a').text().trim();
                                var novelCover = $(el).find('a img').attr('src');
                                var path = $(el).find('a').first().attr('href');
                                if (!novelName || !path) {
                                    console.warn('Skipping invalid search result:', { name: novelName, path: path });
                                    return;
                                }
                                path = path.replace(_this.site, '');
                                novels.push({
                                    name: novelName,
                                    cover: novelCover,
                                    path: path,
                                });
                            } catch (e) {
                                console.error('Error parsing search result:', e);
                            }
                        });
                        console.log('Found search results:', novels.length);
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return SuduGu;
}());
exports.default = new SuduGu();
