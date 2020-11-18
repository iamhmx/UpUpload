/*
 * @Author: mingxing.huang
 * @Date: 2020-11-18 11:18:24
 */
export function fileSize(file) {
  if (!file) {
    return 0
  }
  if (file.size < 1024 * 1024) {
    // 小于1M
    return (file.size / 1024).toFixed(1) + 'kb'
  } else {
    // 大于1M
    return (file.size / 1024 / 1024).toFixed(1) + 'mb'
  }
}
