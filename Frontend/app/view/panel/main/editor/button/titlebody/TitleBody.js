/**
 * Кнопка вставки главного заголовка всей книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.titlebody.TitleBody',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.titlebody.TitleBodyController'
		],
		
		xtype: 'main-editor-button-titlebody',
		controller: 'main.editor.button.titlebody',
		
		html: '<i class="fa fa-heading fa-lg"></i>',

		tooltipText: 'Заголовок для всей книги',
		elementName: 'title',
		
		createOpts: {
			body: true
		}
	}
);