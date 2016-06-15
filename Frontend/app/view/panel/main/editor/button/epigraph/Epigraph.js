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
		id: 'main-editor-button-epigraph',
		xtype: 'main-editor-button-epigraph',
		controller: 'main.editor.button.epigraph',
		html: '<i class="fa fa-pinterest-p"></i>',
		tooltip: 'Эпиграф (Ctrl+E)',
		elementName: 'epigraph'
	}
);