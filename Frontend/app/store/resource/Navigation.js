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
		proxy: {
			type: 'memory'
		},
		sorters: [
			{
				property: 'text',
				direction: 'ASC'
			}
		],
		root: {
			expandable: false
		},
		listeners: {
			datachanged: function (self)
			{
				//console.log(arguments);
				Ext.defer(
					function ()
					{
						console.log(self, self.getData(), self.getRoot());
					},
				    2000
				);
			}
		}
	}
);