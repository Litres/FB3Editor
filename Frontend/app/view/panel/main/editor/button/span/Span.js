/**
 * Кнопка создания элемента span.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.span.Span',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		
		xtype: 'main-editor-button-span',
		//controller: 'main.editor.button.span',
		
		iconCls: 'litres-icon-span',

		tooltipText: 'Метка/Выделение',
		elementName: 'span'
	}
);