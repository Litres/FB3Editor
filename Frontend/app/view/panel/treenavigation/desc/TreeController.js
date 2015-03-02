/**
 * Контроллер дерева навигации по описанию.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.desc.TreeController',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',
		requires: [
			'FBEditor.command.OpenDesc'
		],
		alias: 'controller.panel.desc.navigation',

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = record.getData();

			me.callParent(arguments);
			if (data.anchor)
			{
				// переходим к определенному блоку описания
				bridge.location = '#' + data.anchor;
			}
		},

		/**
		 * Открывает панель описания книги.
		 */
		openContent: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenDesc');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);