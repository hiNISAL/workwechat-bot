import axios, { AxiosResponse } from 'axios';
import url from 'url';
import { upload } from './upload';

interface AtOptions {
  mentioned?: string[];
  mentionedMobile?: string[] | number[];
}

interface SendOptions {
  clearMsgQueue?: boolean;
}

interface NewOptions {
  title: string;
  url: string;
  desc?: string;
  cover?: string;
}

interface UploadFileOptions {
  use
}

class GroupBot {
  public hooks: string[];

  public msgQueue: any[] = [];

  constructor(hooks: string | string[]) {
    if (typeof hooks === 'string') {
      hooks = [hooks];
    }

    this.hooks = hooks;
  }

  text(content: string, at: AtOptions | string | string[] = {}): GroupBot {
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

  at(at: AtOptions | string | string[] = {}): GroupBot {
    this.text('', at);
    return this;
  }

  image(base64: string, md5: string): GroupBot {
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

  news(options: NewOptions[] | NewOptions): GroupBot {
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

  markdown(content: string): GroupBot {
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

  send(options: SendOptions = {}): GroupBot {
    const { clearMsgQueue = true } = options;

    this.hooks.forEach((hook): void => {
      this.msgQueue.forEach(({ params }): void => {
        axios.post(hook, params);
      });
    });

    if (clearMsgQueue) this.msgQueue = [];

    return this;
  }

  async parallelSend(options: SendOptions = {}): Promise<GroupBot> {
    const { clearMsgQueue = true } = options;

    const tasks: Promise<AxiosResponse>[] = [];
    this.hooks.forEach((hook): void => {
      this.msgQueue.forEach(({ params }): void => {
        tasks.push(axios.post(hook, params));
      });
    });

    await Promise.all(tasks);

    if (clearMsgQueue) this.msgQueue = [];

    return this;
  }

  async seriesSend(options: SendOptions = {}): Promise<GroupBot> {
    const { clearMsgQueue = true } = options;

    const hooks = this.hooks;
    const msgQueue = this.msgQueue;

    for (let i = 0, hookLen = hooks.length; i < hookLen; i++) {
      const hook = hooks[i];

      for (let j = 0, queueLen = msgQueue.length; j < queueLen; j++) {
        const { params } = msgQueue[j];

        await axios.post(hook, params);
      }
    }

    if (clearMsgQueue) this.msgQueue = [];

    return this;
  }

  public file(mediaId: string): GroupBot {
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

  async uploadFile(file: unknown, filename: string): Promise<any> {
    const tasks: Promise<any>[] = [];

    this.hooks.forEach((hook: string) => {
      const key = (new url.URL(hook)).searchParams.get('key') || '';

      tasks.push(new Promise((resolve, reject) => {
        upload({
          file,
          key,
          filename,
        }).then((data): void => {
          data.hook = hook;
          data.bot = hook;
          resolve(data);
        }).catch((e) => {
          reject(e);
        });
      }));
    });

    const resolves = await Promise.all(tasks);

    return resolves.length === 1 ? resolves[0] : resolves;
  }

  __clearMsgQueue(): GroupBot {
    this.msgQueue = [];

    return this;
  }
}

export default GroupBot;
