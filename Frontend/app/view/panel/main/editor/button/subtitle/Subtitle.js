/**
 * Кнопка создания элемента subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.subtitle.Subtitle',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.subtitle.SubtitleController'
		],
		
		xtype: 'main-editor-button-subtitle',
		controller: 'main.editor.button.subtitle',
		
		html: '<i class="fab fa-diaspora"></i>',

		tooltipText: 'Подзаголовок',
		elementName: 'subtitle'
	}
);