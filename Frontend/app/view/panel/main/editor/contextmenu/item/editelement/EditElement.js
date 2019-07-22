/**
 * Редактирование элемента отдельно.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.editelement.EditElement',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.editelement.EditElementController',
			'FBEditor.view.panel.main.editor.contextmenu.item.editelement.EditElementController',
			'FBEditor.command.EditElement'
		],
		
		xtype: 'contextmenu-main-editor-item-editelement',
		controller: 'contextmenu.main.editor.item.editelement',
		
		text: 'Редактировать отдельно'
	}
);