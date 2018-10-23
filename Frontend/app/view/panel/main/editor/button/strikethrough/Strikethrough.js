/**
 * Кнопка создания элемента strikethrough.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.strikethrough.Strikethrough',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractStyleButton',
		
		xtype: 'main-editor-button-strikethrough',
		//controller: 'main.editor.button.strikethrough',
		
		//html: '<i class="fa fa-strikethrough"></i>',
		iconCls: 'litres-icon-strikethrough',

		tooltipText: 'Зачёркнутый',
		elementName: 'strikethrough'
	}
);