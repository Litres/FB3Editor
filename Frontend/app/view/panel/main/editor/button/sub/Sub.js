/**
 * Кнопка создания элемента sub.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.sub.Sub',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		
		xtype: 'main-editor-button-sub',
		//controller: 'main.editor.button.sub',
		
		html: '<i class="fa fa-subscript"></i>',

		tooltipText: 'Нижний индекс',
		elementName: 'sub'
	}
);