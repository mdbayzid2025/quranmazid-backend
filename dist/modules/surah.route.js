"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahRoutes = void 0;
const express_1 = __importDefault(require("express"));
const surah_controllers_1 = require("./surah.controllers");
const router = express_1.default.Router();
router.get('/all-chapters', surah_controllers_1.SurahController.getAllChapters);
router.get('/search', surah_controllers_1.SurahController.searchFromChapter);
router.get('/:id', surah_controllers_1.SurahController.getSingleChapter);
exports.SurahRoutes = router;
