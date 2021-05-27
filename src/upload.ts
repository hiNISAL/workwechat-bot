import axios from 'axios';
import * as mimetype from 'mimetype';
import concat = require('concat-stream');
import FormData = require('form-data');

interface UploadOptions {
  file: any;
  filename: string;
  key: string;
}

export const upload = (options: UploadOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    const {
      file,
      key,
      filename,
    } = options;

    const fm = new FormData();

    fm.append('media', file, {
      contentType: mimetype.lookup(filename),
      filename,
    });

    fm.pipe(
      concat({ encoding: 'buffer' }, async (data: any) => {
        axios
          .post('https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            params: {
              key,
              type: 'file',
            },
          })
          .then((res) => {
            if (res.status === 200) {
              resolve(res.data);
            } else {
              reject(new Error(data));
            }
          })
          .catch(error => {
            reject(error)
          });
      })
    );
  });
};
