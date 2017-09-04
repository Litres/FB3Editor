/**
 * Кнопка вставки section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.section.Section',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.section.SectionController'
		],
		
		xtype: 'main-editor-button-section',
		controller: 'main.editor.button.section',
		
		html: '<i class="fa fa-cube"></i>',
		tooltip: 'Вложенная секция (Ctrl+Shift+S)',
		elementName: 'section',

		createOpts: {
			inner: true
		}
	}
);