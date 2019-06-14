/**
 * Редактирование xml элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.item.editsource.EditSource',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.item.editsource.EditSourceController'
		],
		
		xtype: 'contextmenu-treenavigation-body-item-editsource',
		controller: 'contextmenu.treenavigation.body.item.editsource',
		
		text: 'Редактировать исходник'
	}
);