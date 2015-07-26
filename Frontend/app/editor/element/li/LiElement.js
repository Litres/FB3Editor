/**
 * Элемент li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.li.LiElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElement',
		requires: [
			'FBEditor.editor.element.li.LiElementController',
			'FBEditor.editor.command.li.SplitNodeCommand',
			'FBEditor.editor.command.li.RemoveRangeNodesCommand',
			'FBEditor.editor.command.li.JoinNextNodeCommand',
			'FBEditor.editor.command.li.JoinPrevNodeCommand'
		],
		controllerClass: 'FBEditor.editor.element.li.LiElementController',
		htmlTag: 'li',
		xmlTag: 'li'
	}
);