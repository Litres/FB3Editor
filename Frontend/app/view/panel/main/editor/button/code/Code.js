/**
 * Кнопка создания элемента code.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.code.Code',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',

		xtype: 'main-editor-button-code',
		//controller: 'main.editor.button.code',

		html: '<i class="fa fa-code"></i>',
		tooltip: 'Код',
		elementName: 'code'
	}
);