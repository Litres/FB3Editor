/**
 * Кнопка вставки заголовка.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.title.Title',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.title.TitleController'
		],

		xtype: 'main-editor-button-title',
		controller: 'main.editor.button.title',

		html: '<i class="fa fa-header"></i>',
		tooltip: 'Заголовок (Ctrl+H)',
		
		elementName: 'title'
	}
);