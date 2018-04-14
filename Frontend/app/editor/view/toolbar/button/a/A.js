/**
 * Кнопка создания элемента a.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.view.toolbar.button.a.A',
	{
		extend: 'FBEditor.editor.view.toolbar.button.AbstractStyleButton',
		requires: [
			'FBEditor.editor.view.toolbar.button.a.AController'
		],

		xtype: 'editor-toolbar-button-a',
		controller: 'editor.toolbar.button.a',

		html: '<i class="fa fa-link"></i>',

		elementName: 'a',
        tooltipText: 'Ссылка',

		translateText: {
			enterAddress: 'Пожалуйста, введите адрес'
		}
	}
);