import { load as parseHTML } from 'cheerio';
import { fetchText } from '@libs/fetch';
import { FilterTypes, Filters } from '@libs/filterInputs';
import { Plugin } from '@typings/plugin';
import { NovelStatus } from '@libs/novelStatus';

class SuduGu implements Plugin.PluginBase {
  private fetchOptions = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; U; Android 14; zh-cn; M2102K1AC Build/UKQ1.231207.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/109.0.5414.118 Mobile Safari/537.36 MQQBrowser/10.1.0',
    },
  };

  id = 'sudugu';
  name = '速读谷';
  icon = 'src/plugins/chinese/sudugu/icon.png';
  site = 'https://www.sudugu.com';
  version = '1.0.0';

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    // 默认展示“完结小说”或“最新更新”，可根据 filters 选择分类
    let url = '';
    if (filters && filters.category.value !== 'none') {
      url = `${this.site}/${filters.category.value}/${pageNo}.html`;
    } else if (showLatestNovels) {
      url = `${this.site}/zuixin/${pageNo}.html`;
    } else {
      url = `${this.site}/wanjie/${pageNo}.html`;
    }

    const body = await fetchText(url, this.fetchOptions);
    if (!body) throw Error('无法获取小说列表，请检查网络');
    const $ = parseHTML(body);

    const novels: Plugin.NovelItem[] = [];
    $('.item').each((_, el) => {
      const novelName = $(el).find('h3 a').text().trim();
      const novelCover = $(el).find('a img').attr('src');
      const path = $(el).find('a').attr('href')?.replace(this.site, '') ?? '';
      if (!novelName || !path) return;
      novels.push({
        name: novelName,
        cover: novelCover,
        path,
      });
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const body = await fetchText(url, this.fetchOptions);
    if (!body) throw Error('无法获取小说内容，请检查网络');
    const $ = parseHTML(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      chapters: [],
      name: $('.itemtxt h1 a').text().trim(),
      cover: $('.item a img').attr('src'),
      summary: $('.des p').text().trim(),
      author: $('.itemtxt p').eq(1).text().replace('作者：', '').trim(),
      artist: undefined,
      status: $('.itemtxt p').eq(0).text().includes('连载')
        ? NovelStatus.Ongoing
        : NovelStatus.Completed,
      genres: $('.itemtxt p').eq(0).find('span').text().trim(),
    };

    // 目录分页
    let tocUrl = $('.itemtxt ul li a').attr('href') || novelPath.replace('.html', '/');
    if (!tocUrl.startsWith('http')) tocUrl = this.site + tocUrl;

    const chapters: Plugin.ChapterItem[] = [];
    let hasMore = true;
    let nextToc = tocUrl;
    while (hasMore && nextToc) {
      const tocBody = await fetchText(nextToc, this.fetchOptions);
      const tocCheerio = parseHTML(tocBody);

      tocCheerio('#list ul li').each((_, el) => {
        let chapterName = tocCheerio(el).find('a').text().trim();
        let chapterUrl = tocCheerio(el).find('a').attr('href');
        if (!chapterUrl) return;
        if (!chapterUrl.startsWith('http'))
          chapterUrl = this.site + chapterUrl;
        // 章节名过滤与标准化可选（略）
        chapters.push({
          name: chapterName,
          path: chapterUrl.replace(this.site, ''),
        });
      });

      // 查找下一页
      const nextBtn = tocCheerio('a:contains("下一页")').attr('href');
      if (nextBtn && nextBtn !== '#' && nextBtn !== nextToc) {
        nextToc = nextBtn.startsWith('http') ? nextBtn : this.site + nextBtn;
      } else {
        hasMore = false;
      }
    }

    novel.chapters = chapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.site + chapterPath;
    const body = await fetchText(url, this.fetchOptions);
    if (!body) throw Error('无法获取章节内容，请检查网络');
    const $ = parseHTML(body);

    const content = $('.con p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((line: string) => line !== '')
      .map((line: string) => `<p>${line}</p>`)
      .join('\n');

    return content;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];
    const searchUrl = `${this.site}/i/sor.aspx?key=${encodeURIComponent(searchTerm)}`;
    const body = await fetchText(searchUrl, this.fetchOptions);
    if (!body) throw Error('无法获取搜索结果，请检查网络');
    const $ = parseHTML(body);

    const novels: Plugin.NovelItem[] = [];
    $('.item').each((_, el) => {
      const novelName = $(el).find('h3 a').text().trim();
      const novelCover = $(el).find('a img').attr('src');
      const path = $(el).find('a').attr('href')?.replace(this.site, '') ?? '';
      if (!novelName || !path) return;
      novels.push({
        name: novelName,
        cover: novelCover,
        path,
      });
    });

    return novels;
  }

  filters = {
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
      type: FilterTypes.Picker,
    },
  } satisfies Filters;
}

export default new SuduGu();
