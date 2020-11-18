/*
 * @Author: mingxing.huang
 * @Date: 2020-11-12 17:05:47
 */
const fse = require('fs-extra')
const path = require('path')

/**
 * @description: 文件合并
 * @param {*} filepPath：文件路径+名称
 * @param {*} filehash：文件hash
 * @param {*} size：文件chunk大小
 */
const mergeFile = async (filepPath, filehash, size) => {
  // 切片的文件夹
  const chunkDir = path.resolve('server', 'public', filehash)
  // 读取所有切片
  let chunks = await fse.readdir(chunkDir)
  // 切片排序
  chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
  // 切片路径+名字
  chunks = chunks.map(cp => path.resolve(chunkDir, cp))
  await mergeChunks(chunks, filepPath, size, chunkDir)
}
/**
 * @description: 合并切片
 * @param {*} files 切片文件
 * @param {*} dest 目标文件
 * @param {*} size 切片大小
 * @param {*} chunkdDir 切片文件夹路径
 */
async function mergeChunks(files, dest, size, chunkdDir) {
  // filePath：切片文件路径；writeStream：写入流
  const pipStream = (filePath, writeStream) => {
    return new Promise(resolve => {
      // 去读切片
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        // 写入完后删除切片
        fse.unlinkSync(filePath)
        resolve()
      })
      // 写入writeStream
      readStream.pipe(writeStream)
    })
  }
  let funs = []
  files.forEach((file, index) => {
    funs.push(
      pipStream(
        file,
        fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size
        })
      )
    )
  })
  // 执行所有合并操作
  await Promise.all(funs)
  // 合并后，删除文件夹
  fse.removeSync(chunkdDir)
}

async function getUploadedList(dirPath) {
  return fse.existsSync(dirPath)
    ? (await fse.readdir(dirPath)).filter(name => name[0] !== '.')
    : []
}

module.exports = {
  mergeFile,
  getUploadedList
}
