/**
 * Кнопка создания элемента sup.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.sup.Sup',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-sup',
		xtype: 'main-editor-button-sup',
		//controller: 'main.editor.button.sup',
		html: '<i class="fa fa-superscript"></i>',
		tooltip: 'Верхний индекс (Ctrl+.)',
		elementName: 'sup'
	}
);