import { createPagesFunctionHandler } from '@cloudflare/next-on-pages';

export const onRequest = createPagesFunctionHandler({
  // 可选：自定义配置
  // assets: {
  //   bucketDirectory: './public',
  //   cacheControl: 'public, max-age=3600',
  // },
});
