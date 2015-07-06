/**
 * Элемент li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.li.LiElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.li.LiElementController',
			'FBEditor.editor.command.li.SplitNodeCommand',
			'FBEditor.editor.command.li.RemoveRangeNodesCommand'
		],
		controllerClass: 'FBEditor.editor.element.li.LiElementController',
		htmlTag: 'li',
		xmlTag: 'li',
		showedOnTree: false,

		/**
		 * @property {Boolean} Стилевой ли элемент.
		 */
		isStyleType: true
	}
);