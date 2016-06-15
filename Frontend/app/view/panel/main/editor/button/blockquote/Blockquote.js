/**
 * Кнопка вставки blockquote.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.blockquote.Blockquote',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.blockquote.BlockquoteController'
		],
		id: 'main-editor-button-blockquote',
		xtype: 'main-editor-button-blockquote',
		controller: 'main.editor.button.blockquote',
		html: '<i class="fa fa-quote-right"></i>',
		tooltip: 'Цитата (Ctrl+Q)',
		elementName: 'blockquote'
	}
);