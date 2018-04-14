/**
 * Кнопка вставки ul.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.ul.Ul',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractLiHolderButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.ul.UlController'
		],

		xtype: 'main-editor-button-ul',
		controller: 'main.editor.button.ul',
		
		html: '<i class="fa fa-list-ul"></i>',

		tooltipText: 'Маркированный список',
		elementName: 'ul'
	}
);