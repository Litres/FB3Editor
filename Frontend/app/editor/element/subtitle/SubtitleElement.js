/**
 * Элемент subtitle.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.subtitle.SubtitleElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElement',
		requires: [
			'FBEditor.editor.element.subtitle.SubtitleElementController',
			'FBEditor.editor.element.subtitle.SubtitleElementControllerWebKit',
			'FBEditor.editor.command.subtitle.CreateCommand',
			'FBEditor.editor.command.subtitle.CreateRangeCommand',
			'FBEditor.editor.command.subtitle.GetNextHolderCommand',
			'FBEditor.editor.command.subtitle.JoinNextNodeCommand',
			'FBEditor.editor.command.subtitle.JoinPrevNodeCommand',
			'FBEditor.editor.command.subtitle.RemoveRangeNodesCommand',
			'FBEditor.editor.command.subtitle.SplitNodeCommand'
		],

		controllerClass: 'FBEditor.editor.element.subtitle.SubtitleElementController',
		//controllerClassWebkit: 'FBEditor.editor.element.subtitle.SubtitleElementControllerWebKit',

		htmlTag: 'subtitle',
		xmlTag: 'subtitle',
		cls: 'el-subtitle el-styleholder',

		isSubtitle: true,
		showedOnTree: true,

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.t = factory.createElementText('Подзаголовок');
			me.add(els.t);

			return els;
		},

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			if (me.isEmpty())
			{
				// заменяем все пустые subtitle
				
				if (!withoutFormat)
				{
					xml = xml.replace(/<subtitle(.*?)>\n\s*<br(.*?)\/>\n\s*<\/subtitle>/gi, '<subtitle$1></subtitle>');
				}
				else
				{
					xml = xml.replace(/<subtitle(.*?)><br(.*?)\/><\/subtitle>/gi, '<subtitle$1></subtitle>');
				}
			}

			return xml;
		}
	}
);