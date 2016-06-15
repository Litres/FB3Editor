/**
 * Кнопка создания элемента underline.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.underline.Underline',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-underline',
		xtype: 'main-editor-button-underline',
		//controller: 'main.editor.button.underline',
		html: '<i class="fa fa-underline"></i>',
		tooltip: 'Подчёркнутый (Ctrl+U)',
		elementName: 'underline'
	}
);