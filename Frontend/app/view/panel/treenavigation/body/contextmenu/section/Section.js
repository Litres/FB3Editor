/**
 * Контекстное меню секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.Section',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu',
		
		items: [
			{
				text: 'Контетное меню находится в разработке'
			},
			{
				xtype: 'menuseparator'
			},
			{
				text: 'Это тестовая версия'
			},
			{
				xtype: 'menuseparator'
			},
			{
				text: 'Пункт меню'
			},
			{
				text: 'Еще один пункт меню',
				disabled: true
			}
		]
	}
);