"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
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
    __clearMsgQueue() {
        this.msgQueue = [];
        return this;
    }
}
exports.default = GroupBot;
