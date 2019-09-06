/**
 * Кнопка вставки pre.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.pre.Pre',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.pre.PreController'
		],
		
		xtype: 'main-editor-button-pre',
		controller: 'main.editor.button.pre',
		
		html: '<i class="fas fa-file-code fa-lg"></i>',

		tooltipText: 'Предварительно отформатированный текст',
		elementName: 'pre'
	}
);