/**
 * Контекстное меню секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.Section',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.ContextMenu',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.editsource.EditSource'
		],
		
		xtype: 'contextmenu-treenavigation-body-section',
		
		initComponent: function ()
		{
			var me = this;
			
			me.items = [
				{
					text: 'Добавить вложенную главу',
					disabled: true
				},
				{
					text: 'Добавить главу ниже',
					disabled: true
				},
				{
					xtype: 'menuseparator'
				},
				{
					text: 'Объединить главу с предыдущей',
					disabled: true
				},
				{
					xtype: 'menuseparator'
				},
				{
					text: 'Сдвинуть вправо (сделать вложенной)',
					disabled: true
				},
				{
					text: 'Сдвинуть влево (убрать вложенность)',
					disabled: true
				},
				{
					xtype: 'menuseparator'
				},
				{
					xtype: 'contextmenu-treenavigation-body-section-editsource'
				}
			];
			
			me.callParent(arguments);
		}
	}
);