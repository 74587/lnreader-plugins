"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var fetch_1 = require("../../libs/fetch");
var filterInputs_1 = require("../../libs/filterInputs");
var novelStatus_1 = require("../../libs/novelStatus");
var SuduGu = /** @class */ (function () {
    function SuduGu() {
        this.fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 14; zh-cn; M2102K1AC Build/UKQ1.231207.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36 MQQBrowser/10.1.0',
            },
        };
        this.id = 'sudugu';
        this.name = '速读谷';
        this.icon = 'src/plugins/chinese/sudugu/icon.png';
        this.site = 'https://www.sudugu.com';
        this.version = '1.0.0';
        this.filters = {
            category: {
                label: '分类',
                value: 'none',
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
    SuduGu.prototype.popularNovels = function (pageNo_1, _a) {
        return __awaiter(this, arguments, void 0, function (pageNo, _b) {
            var url, body, $, novels;
            var _this = this;
            var showLatestNovels = _b.showLatestNovels, filters = _b.filters;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        url = '';
                        if (filters && filters.category.value !== 'none') {
                            url = "".concat(this.site, "/").concat(filters.category.value, "/").concat(pageNo, ".html");
                        }
                        else if (showLatestNovels) {
                            url = "".concat(this.site, "/zuixin/").concat(pageNo, ".html");
                        }
                        else {
                            url = "".concat(this.site, "/wanjie/").concat(pageNo, ".html");
                        }
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _c.sent();
                        if (!body)
                            throw Error('无法获取小说列表，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            var _a, _b;
                            var novelName = $(el).find('h3 a').text().trim();
                            var novelCover = $(el).find('a img').attr('src');
                            var path = (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '')) !== null && _b !== void 0 ? _b : '';
                            if (!novelName || !path)
                                return;
                            novels.push({
                                name: novelName,
                                cover: novelCover,
                                path: path,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    SuduGu.prototype.parseNovel = function (novelPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, $, novel, tocUrl, chapters, hasMore, nextToc, _loop_1, this_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + novelPath;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body)
                            throw Error('无法获取小说内容，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novel = {
                            path: novelPath,
                            chapters: [],
                            name: $('.itemtxt h1 a').text().trim(),
                            cover: $('.item a img').attr('src'),
                            summary: $('.des p').text().trim(),
                            author: $('.itemtxt p').eq(1).text().replace('作者：', '').trim(),
                            artist: undefined,
                            status: $('.itemtxt p').eq(0).text().includes('连载')
                                ? novelStatus_1.NovelStatus.Ongoing
                                : novelStatus_1.NovelStatus.Completed,
                            genres: $('.itemtxt p').eq(0).find('span').text().trim(),
                        };
                        tocUrl = $('.itemtxt ul li a').attr('href') || novelPath.replace('.html', '/');
                        if (!tocUrl.startsWith('http'))
                            tocUrl = this.site + tocUrl;
                        chapters = [];
                        hasMore = true;
                        nextToc = tocUrl;
                        _loop_1 = function () {
                            var tocBody, tocCheerio, nextBtn;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, fetch_1.fetchText)(nextToc, this_1.fetchOptions)];
                                    case 1:
                                        tocBody = _b.sent();
                                        tocCheerio = (0, cheerio_1.load)(tocBody);
                                        tocCheerio('#list ul li').each(function (_, el) {
                                            var chapterName = tocCheerio(el).find('a').text().trim();
                                            var chapterUrl = tocCheerio(el).find('a').attr('href');
                                            if (!chapterUrl)
                                                return;
                                            if (!chapterUrl.startsWith('http'))
                                                chapterUrl = _this.site + chapterUrl;
                                            // 章节名过滤与标准化可选（略）
                                            chapters.push({
                                                name: chapterName,
                                                path: chapterUrl.replace(_this.site, ''),
                                            });
                                        });
                                        nextBtn = tocCheerio('a:contains("下一页")').attr('href');
                                        if (nextBtn && nextBtn !== '#' && nextBtn !== nextToc) {
                                            nextToc = nextBtn.startsWith('http') ? nextBtn : this_1.site + nextBtn;
                                        }
                                        else {
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
                        return [2 /*return*/, novel];
                }
            });
        });
    };
    SuduGu.prototype.parseChapter = function (chapterPath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, $, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.site + chapterPath;
                        return [4 /*yield*/, (0, fetch_1.fetchText)(url, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body)
                            throw Error('无法获取章节内容，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        content = $('.con p')
                            .map(function (_, el) { return $(el).text().trim(); })
                            .get()
                            .filter(function (line) { return line !== ''; })
                            .map(function (line) { return "<p>".concat(line, "</p>"); })
                            .join('\n');
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
                        if (pageNo > 1)
                            return [2 /*return*/, []];
                        searchUrl = "".concat(this.site, "/i/sor.aspx?key=").concat(encodeURIComponent(searchTerm));
                        return [4 /*yield*/, (0, fetch_1.fetchText)(searchUrl, this.fetchOptions)];
                    case 1:
                        body = _a.sent();
                        if (!body)
                            throw Error('无法获取搜索结果，请检查网络');
                        $ = (0, cheerio_1.load)(body);
                        novels = [];
                        $('.item').each(function (_, el) {
                            var _a, _b;
                            var novelName = $(el).find('h3 a').text().trim();
                            var novelCover = $(el).find('a img').attr('src');
                            var path = (_b = (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.replace(_this.site, '')) !== null && _b !== void 0 ? _b : '';
                            if (!novelName || !path)
                                return;
                            novels.push({
                                name: novelName,
                                cover: novelCover,
                                path: path,
                            });
                        });
                        return [2 /*return*/, novels];
                }
            });
        });
    };
    return SuduGu;
}());
exports.default = new SuduGu();
