/**
 * Кнопка вставки blockquote.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.blockquote.Blockquote',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.blockquote.BlockquoteController'
		],
		id: 'panel-toolstab-main-button-blockquote',
		xtype: 'panel-toolstab-main-button-blockquote',
		controller: 'panel.toolstab.main.button.blockquote',
		html: '<i class="fa fa-quote-right"></i>',
		tooltip: 'Цитата',
		elementName: 'blockquote'
	}
);