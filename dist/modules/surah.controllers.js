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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahController = void 0;
const catchAsync_1 = __importDefault(require("../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../share/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const quranAyahMap_1 = require("../utils/quranAyahMap");
const DATA_DIR = path_1.default.join(process.cwd(), "src", "data");
const getFullChapters = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(DATA_DIR, "chapters", `${id}.json`);
    const fileData = yield fs_1.default.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileData);
});
const getAllChapters = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(DATA_DIR, 'chapters-list.json');
    const readFile = yield fs_1.default.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(readFile);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Chapter created successfully',
        data: parsedData,
    });
}));
const attachAudioToVerses = (surahId, verses) => {
    return verses.map((verse) => (Object.assign(Object.assign({}, verse), { audio: (0, quranAyahMap_1.getAudioUrl)(surahId, verse.id) })));
};
const getSingleChapter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const chapterData = yield getFullChapters(Number(id));
    // ✅ Sync, fast, no external dependency
    const versesWithAudio = attachAudioToVerses(Number(id), chapterData.verses);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Chapter fetched successfully",
        data: Object.assign(Object.assign({}, chapterData), { verses: versesWithAudio }),
    });
}));
const searchFromChapter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const query = ((_b = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.q) === null || _b === void 0 ? void 0 : _b.toString().toLowerCase()) || "";
    if (!query || query.length < 2) {
        return res.status(400).json({ success: false, message: "Search query must be at least 2 characters" });
    }
    const results = [];
    for (let i = 1; i <= 114; i++) {
        const chapterData = yield getFullChapters(i);
        const matchedVerses = chapterData.verses.filter((verse) => { var _a, _b; return (_b = (_a = verse === null || verse === void 0 ? void 0 : verse.translation) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(query); });
        if (matchedVerses.length > 0) {
            results.push({
                surahEngName: chapterData === null || chapterData === void 0 ? void 0 : chapterData.transliteration,
                totalVerses: chapterData === null || chapterData === void 0 ? void 0 : chapterData.total_verses,
                SurahNameArabic: chapterData === null || chapterData === void 0 ? void 0 : chapterData.name,
                verses: attachAudioToVerses(i, matchedVerses), // ✅ i = surahId
            });
        }
    }
    return res.json(results);
}));
exports.SurahController = {
    getAllChapters,
    getSingleChapter,
    searchFromChapter
};
