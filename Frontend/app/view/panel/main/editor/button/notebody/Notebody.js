/**
 * Кнопка вставки notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.notebody.Notebody',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.notebody.NotebodyController'
		],
		
		xtype: 'main-editor-button-notebody',
		controller: 'main.editor.button.notebody',
		
		//html: '<i class="fa fa-sticky-note"></i>',
		text: '+ Текст сноски',

		tooltipText: 'Текст сноски',
		elementName: 'notebody'
	}
);