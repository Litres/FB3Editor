/**
 * Кнопка вставки эпиграфа.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.epigraph.Epigraph',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.epigraph.EpigraphController'
		],
		
		xtype: 'main-editor-button-epigraph',
		controller: 'main.editor.button.epigraph',
		
		html: '<i class="fas fa-comment-dots"></i>',

		tooltipText: 'Эпиграф',
		elementName: 'epigraph'
	}
);