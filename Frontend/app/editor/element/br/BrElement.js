/**
 * Элемент br.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.br.BrElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.br.BrElementController',
			'FBEditor.editor.command.br.CreateEmptyTextCommand'
		],

		controllerClass: 'FBEditor.editor.element.br.BrElementController',

		htmlTag: 'br',
		xmlTag: 'br',
		showedOnTree: false,

		isStyleType: true,

		isEmpty: function ()
		{
			return true;
		}
	}
);