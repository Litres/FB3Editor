/**
 * Кнопка создания элемента strong.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.strong.Strong',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractStyleButton',

		xtype: 'editor-toolbar-button-strong',

		html: '<i class="fa fa-bold"></i>',

		elementName: 'strong',
        tooltipText: 'Полужирный'
	}
);