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
		rootVisible: true,
		folderSort: true,
		sorters: [
			{
				property: 'text',
				direction: 'ASC'
			}
		]
	}
);