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
		
		//html: '<span style="position: relative; font-family: monospace; font-size: 1.4em; top: 2px;">M</span>',
		text: 'CODE',

		tooltipText: 'Предварительно отформатированный текст',
		elementName: 'pre'
	}
);