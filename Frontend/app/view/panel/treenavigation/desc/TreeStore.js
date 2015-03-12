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
			//expandable: false,
			icon: ' ',
			cls: 'treenavigation-root treenavigation-root-desc',
			//iconCls: 'treenavigation-root-icon treenavigation-root-icon-desc fa fa-lg',
			children: [
				{
					text: 'Название произведения',
					expandable: false,
					anchor: 'desc-fieldset-title',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Обложка',
					expandable: false,
					anchor: 'desc-fieldset-title',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Серия',
					expandable: false,
					anchor: 'desc-fieldset-sequence',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Аннотация',
					expandable: false,
					anchor: 'desc-fieldset-annotation',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Классификация произведения',
					expandable: false,
					anchor: 'desc-fieldset-classification',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Связанные персоны (автор, переводчик и т.д.)',
					expandable: false,
					anchor: 'desc-fieldset-relations-subject',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Периодическое издание',
					expandable: false,
					anchor: 'desc-fieldset-periodical',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Связанные объекты',
					expandable: false,
					anchor: 'desc-fieldset-relations-object',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Информация о бумажной публикации',
					expandable: false,
					anchor: 'desc-fieldset-publishInfo',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Комментарии редактора',
					expandable: false,
					anchor: 'desc-fieldset-history',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Пользовательская информация',
					expandable: false,
					anchor: 'desc-fieldset-customInfo',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				},
				{
					text: 'Информация о файле',
					expandable: false,
					anchor: 'desc-fieldset-documentInfo',
					icon: ' ',
					cls: 'treenavigation-children treenavigation-children-desc'//,
					//iconCls: 'treenavigation-children-icon treenavigation-children-icon-desc fa'
				}
			]
		}
	}
);