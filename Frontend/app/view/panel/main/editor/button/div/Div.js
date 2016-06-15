/**
 * Кнопка вставки блока div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.div.Div',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.div.DivController'
		],
		id: 'main-editor-button-div',
		xtype: 'main-editor-button-div',
		controller: 'main.editor.button.div',
		html: '<i class="fa fa-cubes"></i>',
		tooltip: 'Блок (Ctrl+D)',
		elementName: 'div'
	}
);