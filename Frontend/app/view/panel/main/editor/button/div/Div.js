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
		
		xtype: 'main-editor-button-div',
		controller: 'main.editor.button.div',
		
		//html: '<i class="fa fa-cubes"></i>',
		text: 'Блок',

		tooltipText: 'Блок',
		elementName: 'div'
	}
);