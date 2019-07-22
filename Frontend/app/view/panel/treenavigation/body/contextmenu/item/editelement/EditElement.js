/**
 * Редактирование элемента отдельно.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.item.editelement.EditElement',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.treenavigation.body.contextmenu.item.editelement.EditElementController',
			'FBEditor.command.EditElement'
		],
		
		xtype: 'contextmenu-treenavigation-body-item-editelement',
		controller: 'contextmenu.treenavigation.body.item.editelement',
		
		text: 'Редактировать отдельно'
	}
);