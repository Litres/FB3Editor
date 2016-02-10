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
			'FBEditor.editor.command.subtitle.CreateCommand',
			'FBEditor.editor.command.subtitle.CreateRangeCommand',
			'FBEditor.editor.command.subtitle.SplitNodeCommand',
			'FBEditor.editor.command.subtitle.RemoveRangeNodesCommand',
			'FBEditor.editor.command.subtitle.JoinNextNodeCommand',
			'FBEditor.editor.command.subtitle.JoinPrevNodeCommand'
		],

		controllerClass: 'FBEditor.editor.element.subtitle.SubtitleElementController',
		htmlTag: 'subtitle',
		xmlTag: 'subtitle',
		cls: 'el-subtitle',

		isSubtitle: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.t = FBEditor.editor.Factory.createElementText('Подзаголовок');
			me.add(els.t);

			return els;
		},

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// заменяем все пустые элементы subtitle на br
			xml = xml.replace(/<subtitle><br\/><\/subtitle>/gi, '<br/>');

			return xml;
		}
	}
);