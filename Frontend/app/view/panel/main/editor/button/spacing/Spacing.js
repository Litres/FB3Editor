/**
 * Кнопка создания элемента spacing.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.spacing.Spacing',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		id: 'main-editor-button-spacing',
		xtype: 'main-editor-button-spacing',
		//controller: 'main.editor.button.spacing',
		html: '<i class="fa fa-text-width"></i>',
		tooltip: 'Межбуквенный интервал (Ctrl+Shift+I)',
		elementName: 'spacing'
	}
);