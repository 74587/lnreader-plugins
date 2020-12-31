const express = require("express");
const cheerio = require("cheerio");
const request = require("request");

const router = express.Router();

const baseUrl = "https://boxnovel.com/novel";

const searchUrl = "https://boxnovel.com/";

// Top novels

router.get("/novels/:pageNo/", (req, res) => {
    orderBy = req.query.o;
    pageNo = req.params.pageNo;

    url = `${baseUrl}/page/${pageNo}/?m_orderby=${orderBy}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        let novels = [];

        $ = cheerio.load(body);

        $(".page-item-detail").each(function (result) {
            novelName = $(this).find("h5 > a").text();
            novelCover = $(this).find("img").attr("src");
            novelUrl = $(this)
                .find("h5 > a")
                .attr("href")
                .replace(`${baseUrl}/`, "");
            novel = {
                extensionId: 1,
                novelName: novelName,
                novelCover: novelCover,
                novelUrl: novelUrl,
            };

            novels.push(novel);
        });
        res.json(novels);
    });
});

// Novel

router.get("/novel/:novelUrl", (req, res) => {
    novelUrl = req.params.novelUrl;
    url = `${baseUrl}/${novelUrl}/`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let novel = {};

        $(".post-title > h3 > span").remove();

        novel.extensionId = 1;

        novel.sourceUrl = url;

        novel.novelUrl = `${novelUrl}/`;

        novel.novelName = $(".post-title > h3")
            .text()
            .replace(/[\t\n]/g, "")
            .trim();

        novel.novelCover = $(".summary_image > a > img").attr("src");

        $(".post-content_item").each(function (result) {
            detailName = $(this)
                .find(".summary-heading > h5")
                .text()
                .replace(/[\t\n]/g, "")
                .trim();
            detail = $(this)
                .find(".summary-content")
                .text()
                .replace(/[\t\n]/g, "")
                .trim();

            novel[detailName] = detail;
        });

        novel.novelSummary = $(".c_000").text();

        let novelChapters = [];

        $(".wp-manga-chapter").each(function (result) {
            chapterName = $(this)
                .find("a")
                .text()
                .replace(/[\t\n]/g, "")
                .trim();

            releaseDate = $(this)
                .find("span")
                .text()
                .replace(/[\t\n]/g, "")
                .trim();

            chapterUrl = $(this).find("a").attr("href").replace(url, "");

            novelChapters.push({ chapterName, releaseDate, chapterUrl });
        });

        novel.novelChapters = novelChapters.reverse();

        res.json(novel);
    });
});

// Chapter

router.get("/novel/:novelUrl/:chapterUrl", (req, res) => {
    url = `${baseUrl}/${req.params.novelUrl}/${req.params.chapterUrl}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        chapterNameLower = req.params.chapterUrl.replace("-", " ");

        chapterName =
            chapterNameLower.charAt(0).toUpperCase() +
            chapterNameLower.slice(1);

        chapterText = $(".reading-content").text();

        let nextChapter = null;

        if ($(".nav-next").length) {
            nextChapter = $(".nav-next")
                .find("a")
                .attr("href")
                .replace(baseUrl, "");
        }

        let prevChapter = null;

        if ($(".nav-previous").length) {
            prevChapter = $(".nav-previous")
                .find("a")
                .attr("href")
                .replace(baseUrl, "");
        }

        chapter = {
            extensionId: 1,
            novelUrl: `${req.params.novelUrl}/`,
            chapterUrl: `${req.params.chapterUrl}/`,
            chapterName,
            chapterText,
            nextChapter,
            prevChapter,
        };

        res.json(chapter);
    });
});

// Search

router.get("/search/", (req, res) => {
    searchTerm = req.query.s;
    orderBy = req.query.o;

    url = `${searchUrl}?s=${searchTerm}&post_type=wp-manga&m_orderby=${orderBy}`;

    request(url, (err, response, body) => {
        if (err) throw err;

        $ = cheerio.load(body);

        let novels = [];

        $(".c-tabs-item__content").each(function (result) {
            novelName = $(this).find("h4 > a").text();

            // let novelDetails = {};

            // $(this)
            //     .find(".post-content_item")
            //     .each(function (result) {
            //         detailName = $(this)
            //             .find(".summary-heading > h5")
            //             .text()
            //             .replace(/[\t\n]/g, "")
            //             .trim();
            //         detail = $(this)
            //             .find(".summary-content")
            //             .text()
            //             .replace(/[\t\n]/g, "")
            //             .trim();

            //         novelDetails[detailName] = detail;
            //     });

            novelCover = $(this).find("img").attr("src");

            novelUrl = $(this)
                .find("h4 > a")
                .attr("href")
                .replace(`${baseUrl}`, "");

            novels.push({
                extensionId: 1,
                novelName,
                novelCover,
                novelUrl,
            });
        });

        res.json(novels);
    });
});

module.exports = router;
