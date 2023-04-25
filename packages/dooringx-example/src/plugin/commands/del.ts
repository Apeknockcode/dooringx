import deepcopy from 'deepcopy';
import { CommanderItemFactory } from 'dooringx-lib';
import { IStoreData } from 'dooringx-lib/dist/core/store/storetype';

const del = new CommanderItemFactory(
	'del',
	'',
	(store) => {
		const clonedata: IStoreData = deepcopy(store.getData());
		debugger;
		clonedata.block.forEach((v) => {
			if (v.focus) {
				v.canSee = false;
			}
		});
		store.setData(clonedata);
	},
	'删除'
);

export default del;
