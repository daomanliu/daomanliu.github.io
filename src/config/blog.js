// ========== 博客全局配置 ==========
// 改成你自己的信息即可，全站生效
export const blogConfig = {
  // 站点信息
  title: '道满的博客',
  subtitle: '记录学习与生活',
  author: '刘道满',
  avatar: '/avatar1.jpg',
  // 页脚 / 关于区链接（不需要可留空数组）
  links: [
    { label: 'GitHub', url: 'https://github.com/daomanliu' }
  ],

  // ========== 后台登录（仅你一人使用） ==========
  // 用户名
  username: '刘道满',
  // 密码的 SHA-256 哈希（不存明文）。默认密码是 123456。
  // 修改密码方法：在浏览器控制台执行
  //   crypto.subtle.digest('SHA-256', new TextEncoder().encode('你的新密码'))
  //     .then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')))
  // 把输出的哈希替换到下面即可。
  passwordHash: 'e1a9057e3bb2eacbf3f0653f2ef54e81f14126c3d0f9bdf2ea01a8b72e31ed07',

  // 文章目录（构建后与 index.html 同目录下的相对路径）
  postsBase: 'posts/'
}
