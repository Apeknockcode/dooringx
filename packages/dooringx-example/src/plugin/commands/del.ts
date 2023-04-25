import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const del = new CommanderItemFactory(
	'del',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		console.log(clonedata);
		debugger;
		clonedata.block.forEach((v, i) => {
			// 焦距
			if (v.focus) {
				clonedata.block.splice(i, 1);
			}
		});
		store.setData(clonedata);
	},
	'删除'
);

export default del;
