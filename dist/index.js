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
const axios_1 = __importDefault(require("axios"));
const url_1 = __importDefault(require("url"));
const upload_1 = require("./upload");
class GroupBot {
    constructor(hooks) {
        this.msgQueue = [];
        if (typeof hooks === 'string') {
            hooks = [hooks];
        }
        this.hooks = hooks;
    }
    text(content, at = {}) {
        if (typeof at === 'string') {
            at = {
                mentioned: [at],
            };
        }
        if (Array.isArray(at)) {
            at = {
                mentioned: at,
            };
        }
        const params = {
            msgtype: 'text',
            text: {
                content,
                mentioned_list: at.mentioned || [],
                mentioned_mobile_list: at.mentionedMobile || [],
            },
        };
        this.msgQueue.push({
            params,
        });
        return this;
    }
    at(at = {}) {
        this.text('', at);
        return this;
    }
    image(base64, md5) {
        const params = {
            msgtype: 'image',
            image: {
                base64,
                md5,
            },
        };
        this.msgQueue.push({
            params,
        });
        return this;
    }
    news(options) {
        if (!Array.isArray(options)) {
            options = [options];
        }
        const params = {
            msgtype: 'news',
            news: {
                articles: options.map((item) => {
                    return {
                        title: item.title,
                        description: item.desc,
                        url: item.url,
                        picurl: item.cover,
                    };
                }),
            },
        };
        this.msgQueue.push({
            params,
        });
        return this;
    }
    markdown(content) {
        const params = {
            msgtype: 'markdown',
            markdown: {
                content,
            },
        };
        this.msgQueue.push({
            params,
        });
        return this;
    }
    send(options = {}) {
        const { clearMsgQueue = true } = options;
        this.hooks.forEach((hook) => {
            this.msgQueue.forEach(({ params }) => {
                axios_1.default.post(hook, params);
            });
        });
        if (clearMsgQueue)
            this.msgQueue = [];
        return this;
    }
    parallelSend(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clearMsgQueue = true } = options;
            const tasks = [];
            this.hooks.forEach((hook) => {
                this.msgQueue.forEach(({ params }) => {
                    tasks.push(axios_1.default.post(hook, params));
                });
            });
            yield Promise.all(tasks);
            if (clearMsgQueue)
                this.msgQueue = [];
            return this;
        });
    }
    seriesSend(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clearMsgQueue = true } = options;
            const hooks = this.hooks;
            const msgQueue = this.msgQueue;
            for (let i = 0, hookLen = hooks.length; i < hookLen; i++) {
                const hook = hooks[i];
                for (let j = 0, queueLen = msgQueue.length; j < queueLen; j++) {
                    const { params } = msgQueue[j];
                    yield axios_1.default.post(hook, params);
                }
            }
            if (clearMsgQueue)
                this.msgQueue = [];
            return this;
        });
    }
    file(mediaId) {
        const params = {
            msgtype: 'file',
            file: {
                media_id: mediaId,
            },
        };
        this.msgQueue.push({
            params,
        });
        return this;
    }
    uploadFile(file, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = [];
            this.hooks.forEach((hook) => {
                const key = (new url_1.default.URL(hook)).searchParams.get('key') || '';
                tasks.push(new Promise((resolve, reject) => {
                    upload_1.upload({
                        file,
                        key,
                        filename,
                    }).then((data) => {
                        data.hook = hook;
                        data.bot = hook;
                        resolve(data);
                    }).catch((e) => {
                        reject(e);
                    });
                }));
            });
            const resolves = yield Promise.all(tasks);
            return resolves.length === 1 ? resolves[0] : resolves;
        });
    }
    __clearMsgQueue() {
        this.msgQueue = [];
        return this;
    }
}
exports.default = GroupBot;
