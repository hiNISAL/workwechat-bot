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
declare class GroupBot {
    hooks: string[];
    msgQueue: any[];
    constructor(hooks: string | string[]);
    text(content: string, at?: AtOptions | string | string[]): GroupBot;
    at(at?: AtOptions | string | string[]): GroupBot;
    image(base64: string, md5: string): GroupBot;
    news(options: NewOptions[] | NewOptions): GroupBot;
    markdown(content: string): GroupBot;
    send(options?: SendOptions): GroupBot;
    parallelSend(options?: SendOptions): Promise<GroupBot>;
    seriesSend(options?: SendOptions): Promise<GroupBot>;
    file(mediaId: string): GroupBot;
    uploadFile(file: unknown, filename: string): Promise<any>;
    __clearMsgQueue(): GroupBot;
}
export default GroupBot;
