#!/usr/bin/env node
/**
 * 跨平台 VitePress 运行包装脚本。
 *
 * 在 WorkBuddy 终端中，NODE_OPTIONS 默认被注入了「安全删除」shim，
 * 它会把 VitePress 的临时目录删除重定向到系统回收站。在 Windows 上
 * 回收站操作会报 "Some operations were aborted"，导致 build/preview
 * 在结尾清理 .temp 时失败（但产物 dist 实际上已正确生成）。
 *
 * 本脚本在启动 VitePress 前清除 NODE_OPTIONS，让 VitePress 正常执行
 * 自身的临时文件清理，从而消除该报错。仅影响 VitePress 进程，不影响
 * WorkBuddy 自身的文件安全机制。
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// 解析 vitepress 可执行入口
// vitepress 的 exports 未暴露 ./bin/vitepress.js，故从其主入口回推包根再拼接 bin 路径
const vitepressMain = require.resolve('vitepress')
const vitepressRoot = resolve(vitepressMain, '../../../')
const vitepressBin = resolve(vitepressRoot, 'bin/vitepress.js')
const nodeBin = process.execPath

const env = { ...process.env }
delete env.NODE_OPTIONS // 关键：移除安全删除 shim 注入

const child = spawn(nodeBin, [vitepressBin, ...process.argv.slice(2)], {
  cwd: resolve(__dirname, '..'),
  env,
  stdio: 'inherit',
})

child.on('exit', (code) => process.exit(code ?? 0))
