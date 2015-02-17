/**
 * Хранилище дерева навигации по ресурсам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.store.resource.Navigation',
	{
		extend: 'Ext.data.TreeStore',
		defaultRootText: 'Ресурсы',
		rootVisible: false,
		proxy: {
			type: 'memory'
		},
		/*folderSort: true,
		sorters: [
			{
				property: 'path',
				direction: 'ASC'
			}
		],*/
		filters: [],
		root: {
			expandable: false
		}/*,
		listeners: {
			refresh: function (store)
			{

			}
		}*/
	}
);