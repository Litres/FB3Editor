/**
 * Кнопка создания элемента sub.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.sub.Sub',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-sub',
		xtype: 'main-editor-button-sub',
		//controller: 'main.editor.button.sub',
		html: '<i class="fa fa-subscript"></i>',
		tooltip: 'Нижний индекс (Ctrl+X)',
		elementName: 'sub'
	}
);