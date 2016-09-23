/**
 * Кнопка создания элемента strikethrough.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.strikethrough.Strikethrough',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-strikethrough',
		xtype: 'main-editor-button-strikethrough',
		//controller: 'main.editor.button.strikethrough',
		html: '<i class="fa fa-strikethrough"></i>',
		tooltip: 'Зачёркнутый (Alt+Shift+5)',
		elementName: 'strikethrough'
	}
);