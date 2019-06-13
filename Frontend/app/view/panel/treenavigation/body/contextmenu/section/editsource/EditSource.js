/**
 * Редактирование xml секции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.editsource.EditSource',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.section.editsource.EditSourceController'
		],
		
		xtype: 'contextmenu-treenavigation-body-section-editsource',
		controller: 'contextmenu.treenavigation.body.section.editsource',
		
		text: 'Редактировать исходник'
	}
);