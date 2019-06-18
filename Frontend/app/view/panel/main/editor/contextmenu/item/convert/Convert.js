/**
 * Превращение в простой текст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.contextmenu.item.convert.Convert',
	{
		extend: 'FBEditor.view.panel.main.editor.contextmenu.item.Item',
		requires: [
			'FBEditor.view.panel.main.editor.contextmenu.item.convert.ConvertController'
		],
		
		xtype: 'contextmenu-main-editor-item-convert',
		controller: 'contextmenu.main.editor.item.convert',
		
		text: 'Превратить в простой текст'
	}
);