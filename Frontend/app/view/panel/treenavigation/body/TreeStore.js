/**
 * Хранилище дерева навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.TreeStore',
	{
		extend: 'Ext.data.TreeStore',
		defaultRootText: 'Текст',
		rootVisible: true,
		proxy: {
			type: 'memory'
		},
		root: {
			//expandable: false,
			icon: ' ',
			cls: 'treenavigation-root treenavigation-root-body'//,
			//iconCls: 'treenavigation-root-icon treenavigation-root-icon-body fa fa-lg'
		}
	}
);