/*
 * @Author: yehuozhili
 * @Date: 2022-01-13 16:16:53
 * @LastEditors: yehuozhili
 * @LastEditTime: 2022-01-14 09:16:58
 * @FilePath: \dooringx-cli\src\createPlugin.ts
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import modifyTemplate from './modifyTemplate';
import { deleteFolder, doAction } from './utils';

export async function createPlugin(name: string, option: string) {
	createApp(name, option);
}
/**
 * 相当于 npm init -y 创建一个依赖文件
 *
 * */
async function createApp(projectName: string, option: string) {
	console.log('createApp-项目名称', projectName);
	console.log('createApp-配置项', option);
	debugger;
	let root = path.resolve(projectName);

	const isExist = fs.existsSync(root);
	console.log('判断这个包是否存在');

	if (isExist) {
		const choices = ['y', 'n'];
		let sign = 'y';
		const result = await inquirer.prompt({
			name: 'sign',
			type: 'list',
			message: `${projectName}  already exists , continue ?`,
			choices,
		});
		sign = result.sign;
		if (sign === 'n') {
			return;
		}
	}

	/*
	 * ensureDirSync()函数是ensureDir()函数的同步版本。
	 * 该函数确保该目录存在，如果目录结构不存在，它将由该函数创建。
	 * 也可以使用mkdirsSync()和mkdirpSync()代替ensureDirSync()，结果将相同。
	 */
	fs.ensureDirSync(projectName); // 没有则创建文件夹
	console.log(`create a new app in ${chalk.green(root)}`);
	const packageJson = {
		name: projectName,
		version: '0.0.1',
		private: true,
	};
	// 写入package.json
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2));
	/**
	 * process.chdir()方法是过程模块的内置应用程序编程接口，用于更改当前工作目录。
	 */
	process.chdir(root);
	// 复制项目模板，安装项目依赖等
	await run(root, projectName, option);
}

// run 方法  创建对应的文件目录
async function run(root: string, projectName: string, _option: string) {
	console.log('createPlugin-Run 方法', root, projectName, _option);
	debugger;
	const template = 'dooringx-plugin-template';
	const templateName = template;
	const allDependencies = [templateName];
	console.log('Installing packages. This might take a couple of minutes');
	console.log(`Installing ${chalk.cyan(templateName)} ...`);
	try {
		await doAction(root, allDependencies);
	} catch (e) {
		console.log(`Installing ${chalk.red(templateName)} failed ...`, e);
	}
	console.log(`Installing ${chalk.cyan(templateName)} succeed!`);

	//path.dirname 用于获取给定路径的目录名称。它会忽略相应平台的尾随目录分隔符。
	const templatePath = path.dirname(
		require.resolve(`${templateName}/package.json`, { paths: [root] })
	);
	// 复制文件到项目目录
	// path.join()方法 可以连接任意多个路径字符串。要连接的多个路径可做为参数传入。path.join()方法在接边路径的同时也会对路径进行规范化
	const tempDir = path.join(root, 'temp');
	const templateDir = path.join(templatePath, `template`);

	/**
	 * fs.existsSync(path:将检测的目录路径)
	 * 以同步的方法检测目录是否存在。
	 * 如果目录存在 返回 true ，如果目录不存在 返回false
	 */
	if (fs.existsSync(templatePath)) {
		await modifyTemplate(templateDir, 'temp', {
			projectName: projectName,
			basicProject: template,
		});

		fs.copySync(tempDir, root);
		deleteFolder(tempDir);
	} else {
		console.error(`Could not locate supplied template: ${chalk.green(templatePath)}`);
		return;
	}
	let tempPkg = fs.readFileSync(root + '/template.json').toString();
	let pkg = fs.readFileSync(root + '/package.json').toString();

	const tempPkgJson = JSON.parse(tempPkg);
	let pkgJson = JSON.parse(pkg);
	pkgJson = { ...pkgJson };
	pkgJson.main = tempPkgJson?.main;
	pkgJson.scripts = tempPkgJson?.scripts;
	pkgJson.dependencies = {
		...tempPkgJson?.dependencies,
	};
	pkgJson.devDependencies = {
		...tempPkgJson?.devDependencies,
	};
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkgJson, null, 2));
	fs.unlinkSync(path.join(root, 'template.json'));
	fs.unlinkSync(path.join(root, 'package-lock.json'));
	console.log(`🎉  Successfully created project ${projectName}.`);
	console.log('👉  Get started with the following commands:');
	console.log(`${chalk.cyan(`cd ${projectName}`)}`);
	console.log(`${chalk.cyan('npm install')}`);
  debugger
	process.exit(0);
}
