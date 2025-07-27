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

var SuduGu = /** @class */ (function () {
    function SuduGu() {
        this.fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; M2102K1AC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5414.118 Mobile Safari/537.36',
                'Referer': 'https://www.sudugu.com/',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9'
            },
            credentials: 'include',
            timeout: 30000
        };
        this.id = 'sudugu';
        this.name = '速读谷';
        this.icon = 'src/cn/sudugu/icon.png';
        this.site = 'https://www.sudugu.com';
        this.version = '0.3.1';
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
                            : "".concat(this.site, "/").concat(filters.category.value || 'wanjie', "/").concat(pageNo, ".html");
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _c.sent();
                        if (!body) throw Error('无法获取小说列表，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            try {
                                var novelName = $(el).find('h3 a').text().trim();
                                var novelCover = $(el).find('a img').attr('src');
                                novelCover = novelCover && !novelCover.startsWith('http') ? _this.site + novelCover : novelCover;
                                var path = $(el).find('a').first().attr('href');
                                if (!novelName || !path) return;
                                path = path.startsWith('http') ? path.replace(_this.site, '') : path;
                                novels.push({
                                    name: novelName,
                                    cover: novelCover,
                                    path: path,
                                });
                            } catch (e) { }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SuduGu.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [2 /*return*/, (async function () {
                            var baseUrl = _this.site + novelPath.split('#')[0].replace(/\/$/, '');
                            var url = baseUrl;
                            var body = await (0, fetch_1.fetchText)(url, _this.fetchOptions);
                            if (!body) throw Error('无法获取小说内容，请检查网络');
                            var $ = (0, cheerio_1.load)(body);
    
                            // 通用书籍元信息
                            var coverUrl = $('.item a img').attr('src') || $('.item img').attr('src');
                            coverUrl = coverUrl ? (coverUrl.startsWith('http') ? coverUrl : _this.site + coverUrl) : undefined;
                            var summary = $('.des.bb').first().find('p').map((_, el) => $(el).text().trim()).get().join('\n') ||
                                          $('.des.bb').first().text().trim() || '暂无简介';
                            var author = $('.itemtxt p').eq(1).find('a').text().trim() ||
                                $('.itemtxt p').eq(1).text().replace('作者：', '').trim() ||
                                $('.itemtxt p').filter(function(_, el){ return $(el).text().indexOf('作者') > -1; }).text().replace('作者：', '').trim() ||
                                '未知作者';
                            var statusText = $('.itemtxt p').eq(0).text();
                            var genres = $('.itemtxt p').eq(0).find('span').eq(1).text().trim() ||
                                $('.itemtxt p').eq(0).find('span').last().text().trim() || '未知分类';
                            var status = /连载/.test(statusText) ? novelStatus_1.NovelStatus.Ongoing : novelStatus_1.NovelStatus.Completed;
    
                            // ---------------- 目录抓取 begin -----------------
                            var chapters = [];
                            var visitedUrls = {};
                            var getPageChapters = async function(listUrl){
                                if (visitedUrls[listUrl]) return;
                                visitedUrls[listUrl] = true;
                                var html = (listUrl === url) ? body : await (0, fetch_1.fetchText)(listUrl, _this.fetchOptions);
                                var $$ = (0, cheerio_1.load)(html);
                                $$('#list ul li').each(function(_, el){
                                    try {
                                        var li = $$(el);
                                        var chapterName = li.find('a').text().trim();
                                        var chapterUrl = li.find('a').attr('href');
                                        if (!chapterUrl || !chapterName) return;
                                        chapterName = chapterName
                                            .replace(/••/g, '')
                                            .replace(/[【〔〖［『「《]\d+[】〕〗］』」》]/g, '')
                                            .replace(/[\(\{（｛【〔［].*?(求含理更谢乐发推票盟补加字Kk\/).*/, '')
                                            .replace(/[\[\(\（【〔［『「《｛{].*$/, '')
                                            .replace(/[。]/g, '')
                                            .trim();
                                        if (!chapterUrl.startsWith('http')) chapterUrl = chapterUrl.startsWith('/') ? _this.site + chapterUrl : baseUrl + '/' + chapterUrl;
                                        var relativeChapterUrl = chapterUrl.replace(_this.site, '');
                                        if (!chapters.some(function (chap) { return chap.path === relativeChapterUrl; })) {
                                            chapters.push({
                                                name: chapterName,
                                                path: relativeChapterUrl,
                                            });
                                        }
                                    } catch (e) {}
                                });
                                // 目录下一页
                                var nextHref = $$('#pages a:contains("下一页")').attr('href') || $$('#pages .gr').filter((i, el) => $$(el).text().includes('下一页')).attr('href');
                                if (nextHref && !visitedUrls[nextHref]) {
                                    if (!/^http/.test(nextHref)) nextHref = nextHref.startsWith('/') ? _this.site + nextHref : baseUrl + '/' + nextHref;
                                    await getPageChapters(nextHref);
                                }
                            };
                            await getPageChapters(url);
                            // ---------------- 目录抓取 end -----------------
    
                            return {
                                path: novelPath,
                                chapters: chapters,
                                name: $('.itemtxt h1 a').text().trim() ||
                                    $('.itemtxt h1').text().trim() ||
                                    $('title').text().trim().replace(/-.*$/, '') || '未知标题',
                                cover: coverUrl,
                                summary: summary,
                                author: author,
                                artist: undefined,
                                status: status,
                                genres: genres,
                            };
                        })()];
                }
            });
        });
    };

    SuduGu.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, content, hasMoreContent, currentUrl, maxPages, pageCount, _loop_1, this_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        content = '';
                        hasMoreContent = true;
                        currentUrl = url;
                        maxPages = 100;
                        pageCount = 0;
                        _loop_1 = function () {
                            var body, $, pageText, nextContentLink;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (pageCount >= maxPages) {
                                            hasMoreContent = false;
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, (0, fetch_1.fetchText)(currentUrl, this.fetchOptions)];
                                    case 1:
                                        body = _b.sent();
                                        if (!body) {
                                            hasMoreContent = false;
                                            return [2 /*return*/];
                                        }
                                        $ = (0, cheerio_1.load)(body);
                                        pageText = $('.con p').length ? $('.con p') : $('.content p');
                                        pageText = pageText
                                            .map(function (_, el) { return $(el).text().trim(); })
                                            .get()
                                            .filter(function (line) { return line !== ''; })
                                            // 【重点】加上中文缩进
                                            .map(function (line) { return "<p>&emsp;&emsp;" + line + "</p>"; })
                                            .join('\n');
                                        content += pageText ? pageText + '\n' : '';
                                        nextContentLink = $('a:contains("下一页")').attr('href');
                                        if (nextContentLink && nextContentLink !== 'javascript:void(0);' && nextContentLink !== currentUrl) {
                                            try {
                                                currentUrl = nextContentLink.startsWith('http') ? nextContentLink : _this.site + nextContentLink;
                                                pageCount++;
                                            } catch (e) {
                                                hasMoreContent = false;
                                            }
                                        } else {
                                            hasMoreContent = false;
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!hasMoreContent) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        // 这里默认每段以<p>开头，已经自动加缩进。若部分客户端不识别&emsp;，也可改为全角空格"\u3000\u3000"
                        return [2 /*return*/, content || '<p>章节内容为空</p>'];
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
                        if (pageNo > 1) return [2 /*return*/, []];
                        searchUrl = "".concat(this.site, "/i/sor.aspx?key=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body) throw Error('无法获取搜索结果，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            try {
                                var novelName = $(el).find('h3 a').text().trim();
                                var novelCover = $(el).find('a img').attr('src');
                                novelCover = novelCover && !novelCover.startsWith('http') ? _this.site + novelCover : novelCover;
                                var path = $(el).find('a').first().attr('href');
                                if (!novelName || !path) return;
                                path = path.startsWith('http') ? path.replace(_this.site, '') : path;
                                novels.push({
                                    name: novelName,
                                    cover: novelCover,
                                    path: path,
                                });
                            } catch (e) { }
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };

    return SuduGu;
}());
exports.default = new SuduGu();
