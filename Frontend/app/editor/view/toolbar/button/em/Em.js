/**
 * Кнопка создания элемента em.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.em.Em',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractStyleButton',

		xtype: 'editor-toolbar-button-em',

		html: '<i class="fa fa-italic"></i>',
		tooltip: 'Курсив (Ctrl+I)',

		elementName: 'em'
	}
);