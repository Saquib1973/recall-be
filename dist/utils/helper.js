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
exports.Password = void 0;
exports.generateHash = generateHash;
exports.ContentType = ContentType;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class Password {
    static hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.hash(password, 10);
        });
    }
    static compare(password, hashPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, hashPassword);
        });
    }
}
exports.Password = Password;
function generateHash(length) {
    let options = 'qwertyuiopasdfghjklzxcvbnm1234567890';
    let len = options.length;
    let hash = '';
    for (let i = 0; i < length; i++) {
        hash += options[Math.floor(Math.random() * len)];
    }
    return hash;
}
function ContentType(item) {
    const testLink = [
        'https://youtu.be/NKO-CeS1z8c?si=t0ptVmS4XldR0TW-',
        'https://www.youtube.com/watch?v=NKO-CeS1z8c',
        'https://www.youtube.com/embed/NKO-CeS1z8c?si=WFpqEs7cpVUT_H4q',
        'https://www.youtube.com/watch?v=Mz7ktiWuY5g&list=RDMz7ktiWuY5g&start_radio=1&rv=Mz7ktiWuY5g',
        'https://www.youtube.com/watch?v=l4BSJZnEX_c&list=RDMz7ktiWuY5g&index=3',
        'https://youtu.be/l4BSJZnEX_c?si=AhFjWbyqpGXkOOym',
        'https://x.com/BDOSINT/status/1882706137830896094',
        'https://x.com/BDOSINT/status/1882706137830896094',
    ];
    if (item.includes('www.youtube.com') || item.includes('youtu.be')) {
        return 'youtube';
    }
    else if (item.includes('pinterest.com/pin/')) {
        return 'pinterest';
    }
    else if (item.includes('twitter.com') || item.includes('https://x.com')) {
        return 'twitter';
    }
    else if (item.includes('instagram.com')) {
        return 'instagram';
    }
    else {
        return 'others';
    }
}
