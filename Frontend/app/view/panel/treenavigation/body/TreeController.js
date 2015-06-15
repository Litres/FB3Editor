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
		 * Вызывается при двойном клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} nodeView Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemDblClick: function (nodeView, record)
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				data = record.getData(),
				manager,
				el,
				nodes;

			me.callParent(arguments);

			manager = bridge.FBEditor.editor.Manager;

			// получаем элемент по его id
			el = manager.getElementById(data.elementId);

			if (el)
			{
				// узлы элемента
				nodes = Ext.Object.getValues(el.nodes);

				// перематываем скролл во всех окнах
				Ext.Array.each(
					nodes,
				    function (item)
				    {
					    item.scrollIntoView();
				    }
				);

				// устанавливаем курсор на соответствующем элементе в главном окне
				manager.setCursor(
					{
						startNode: nodes[0],
						startOffset: 0,
						focusElement: el
					}
				);
			}
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