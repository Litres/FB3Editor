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
			'FBEditor.editor.element.li.LiElementControllerWebKit',
			'FBEditor.editor.command.li.SplitNodeCommand',
			'FBEditor.editor.command.li.RemoveRangeNodesCommand',
			'FBEditor.editor.command.li.JoinNextNodeCommand',
			'FBEditor.editor.command.li.JoinPrevNodeCommand'
		],

		controllerClass: 'FBEditor.editor.element.li.LiElementController',
		controllerClassWebkit: 'FBEditor.editor.element.li.LiElementControllerWebKit',

		htmlTag: 'li',
		xmlTag: 'li',
		cls: 'el-li el-styleholder',

		isLi: true,

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// удаляем все одиночные br
			xml = xml.replace(/<li(.*?)>\n\s+<br(.*?)\/>\n\s+<\/li>/gi, '<li><\/li>');

			return xml;
		}
	}
);