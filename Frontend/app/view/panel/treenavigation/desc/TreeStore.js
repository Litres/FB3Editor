/**
 * Хранилище дерева навигации по описанию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.desc.TreeStore',
	{
		extend: 'Ext.data.TreeStore',
		defaultRootText: 'Описание',
		rootVisible: true,
		proxy: {
			type: 'memory'
		},
		root: {
			expandable: false,
			icon: ' ',
			cls: 'treenavigation-root treenavigation-root-desc',
			iconCls: 'treenavigation-root-icon treenavigation-root-icon-desc fa fa-lg',
			children: [
				{
					text: 'Название произведения',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Обложка',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Серия',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Классификация произведения',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Связанные персоны (автор, переводчик и т.д.)',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Периодическое издание',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Связанные объекты',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Информация о бумажной публикации',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'История',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Пользовательская информация',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Информация о файле',
					expandable: false,
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc',
					iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				}
			]
		}
	}
);