"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const surah_route_1 = require("../modules/surah.route");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: '/surahs',
        route: surah_route_1.SurahRoutes,
    },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
