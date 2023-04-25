/*
 * @Author: yehuozhili
 * @Date: 2021-07-20 17:38:03
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-28 10:30:54
 * @FilePath: \dooringx\script\changelog.js
 */

const fs = require('fs-extra');
const path = require('path');
const changelog = path.resolve(process.cwd(), 'CHANGELOG.md');
const doclog = path.resolve(
	process.cwd(),
	'packages',
	'dooringx-dumi-doc',
	'docs',
	'ChangeLog',
	'index.md'
);
const isExist = fs.existsSync(doclog);
if (isExist) {
	fs.removeSync(doclog);
}

const prepend = `---
title: 变更日志
toc: menu
nav:
  title: 变更日志
  order: 6
---
`;

const data = prepend + fs.readFileSync(changelog).toString();
fs.writeFileSync(doclog, data);
