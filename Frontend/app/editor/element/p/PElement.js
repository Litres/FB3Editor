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
			'FBEditor.editor.element.p.PElementControllerWebKit',
			'FBEditor.editor.command.p.GetNextHolderCommand',
			'FBEditor.editor.command.p.JoinNextNodeCommand',
			'FBEditor.editor.command.p.JoinPrevNodeCommand',
			'FBEditor.editor.command.p.RemoveRangeNodesCommand',
			'FBEditor.editor.command.p.SplitNodeCommand'
		],

		controllerClass: 'FBEditor.editor.element.p.PElementController',
		//controllerClassWebkit: 'FBEditor.editor.element.p.PElementControllerWebKit',

		htmlTag: 'p',
		xmlTag: 'p',
		cls: 'el-p el-styleholder',

		isP: true,

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				parent = me.parent,
				xml;

			xml = me.callParent(arguments);

			if (me.isEmpty())
			{
				// заменяем все пустые абзацы на br

				if (!withoutFormat)
				{
					xml = xml.replace(/<p(.*?)>\n\s+<br(.*?)\/>\n\s+<\/p>/gi, '<br$2/>');
				}
				else
				{
					xml = xml.replace(/<p(.*?)><br(.*?)\/><\/p>/gi, '<br$2/>');
				}

				if (!parent.hisName('section') && parent.first().equal(me))
				{
					// для всех элементов, кроме section, первым элементом не может быть br
					xml = '<p></p>';
				}
			}

			return xml;
		}
	}
);