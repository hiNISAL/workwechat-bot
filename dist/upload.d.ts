interface UploadOptions {
    file: any;
    filename: string;
    key: string;
}
export declare const upload: (options: UploadOptions) => Promise<any>;
export {};
