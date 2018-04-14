/**
 * Кнопка вставки ol.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.ol.Ol',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractLiHolderButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.ol.OlController'
		],
		
		xtype: 'main-editor-button-ol',
		controller: 'main.editor.button.ol',
		
		html: '<i class="fa fa-list-ol"></i>',

		tooltipText: 'Нумерованный список',
		elementName: 'ol'
	}
);