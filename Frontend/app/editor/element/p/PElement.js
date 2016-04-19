/**
 * Элемент p.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.p.PElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElement',
		requires: [
			'FBEditor.editor.element.p.PElementController',
			'FBEditor.editor.command.p.SplitNodeCommand',
			'FBEditor.editor.command.p.RemoveRangeNodesCommand',
			'FBEditor.editor.command.p.JoinNextNodeCommand',
			'FBEditor.editor.command.p.JoinPrevNodeCommand'
		],

		controllerClass: 'FBEditor.editor.element.p.PElementController',
		htmlTag: 'p',
		xmlTag: 'p',
		cls: 'el-p',

		isP: true,

		setAttributesHtml: function (element)
		{
			var me = this,
				first,
				el;

			el = me.callParent(arguments);

			first = me.first();

			if (first && first.isImg)
			{
				// не должно быть отступа
				me.cls += ' el-p-no-indent';
			}

			return el;
		},

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// заменяем все пустые параграфы на br
			xml = xml.replace(/<p><br\/><\/p>/gi, '<br/>');

			return xml;
		}
	}
);