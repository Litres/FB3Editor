/**
 * Контроллер дерева навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.TreeController',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',
		requires: [
			'FBEditor.command.OpenBody'
		],
		alias: 'controller.panel.body.navigation',

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{

		},

		/**
		 * Открывает панель текста.
		 */
		openContent: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.command.OpenBody');
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
			}
		}
	}
);