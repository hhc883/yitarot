import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YiTatro｜周易·八字·塔罗 AI 命理',
    short_name: 'YiTatro',
    description:
      'YiTatro 汇聚东方周易（八字排盘、六爻神谕、紫微斗数、奇门遁甲）与西方经典韦特塔罗，提供清澈深邃的自我认知镜像。',
    start_url: '/zh',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#171717',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      }
    ]
  };
}
