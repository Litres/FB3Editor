/**
 * Элемент p.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.p.PElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.p.PElementController',
			'FBEditor.editor.command.p.SplitNodeCommand',
			'FBEditor.editor.command.p.RemoveRangeNodesCommand',
			'FBEditor.editor.command.p.JoinNextNodeCommand',
			'FBEditor.editor.command.p.JoinPrevNodeCommand'/*,

			'FBEditor.editor.command.p.AppendEmptyNodeCommand',
			'FBEditor.editor.command.p.RemoveEmptyNodeCommand',
			'FBEditor.editor.command.p.JoinTextToNextNodeCommand',
			'FBEditor.editor.command.p.JoinTextToPrevNodeCommand',
			'FBEditor.editor.command.p.TextToNextNodeCommand',
			'FBEditor.editor.command.p.TextToPrevNodeCommand'*/
		],
		controllerClass: 'FBEditor.editor.element.p.PElementController',
		htmlTag: 'p',
		xmlTag: 'p',
		cls: 'el-p',
		showedOnTree: false,

		/**
		 * @property {Boolean} Стилевой ли элемент.
		 */
		isStyleType: true,

		isP: true,

		setAttributesHtml: function (element)
		{
			var me = this,
				children = me.children,
				first;

			first = children.length ? children[0] : null;
			if (first && first.isImg)
			{
				// не должно быть отсупа
				me.cls += ' el-p-no-indent';
			}
			element = me.callParent(arguments);

			return element;
		}
	}
);