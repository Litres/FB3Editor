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
		id: 'main-editor-button-subtitle',
		xtype: 'main-editor-button-subtitle',
		controller: 'main.editor.button.subtitle',
		html: '<i class="fa fa-h-square fa-lg"></i>',
		tooltip: 'Подзаголовок',
		elementName: 'subtitle'
	}
);