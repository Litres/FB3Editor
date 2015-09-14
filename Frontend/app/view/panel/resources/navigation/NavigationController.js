/**
 * Контроллер дерева навигации по ресурсам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.navigation.NavigationController',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',
		requires: [
			'FBEditor.command.OpenResources'
		],
		alias: 'controller.panel.resources.navigation',

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = record.getData(),
				manager,
				selectFunction,
				folder;

			me.callParent(arguments);
			manager = bridge.FBEditor.resource.Manager;

			if ((selectFunction = manager.getSelectFunction()) && !record.isLeaf())
			{
				// вызываем колбэк-функцию выбора папки
				selectFunction(data);
			}
			else if (!record.isLeaf())
			{
				folder = data.path ? data.path : '';
				manager.setActiveFolder(folder);
			}
		},

		/**
		 * Открывает панель ресурсов.
		 */
		openContent: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenResources');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);