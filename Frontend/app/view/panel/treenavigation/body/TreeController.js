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
				els = {},
				nodes = {},
				manager;

			me.callParent(arguments);

			manager = bridge.FBEditor.editor.Manager;

			// получаем элемент по его id
			els.node = manager.getElementById(data.elementId);

			if (els.node)
			{
				// устанавливаем фокус на корневом узле главного окна
				Ext.Object.getValues(FBEditor.editor.Manager.getContent().nodes)[0].focus();

				// узлы элемента
				nodes.nodes = Ext.Object.getValues(els.node.nodes);

				// перематываем скролл во всех окнах
				Ext.Array.each(
					nodes.nodes,
				    function (item)
				    {
					    item.scrollIntoView();
				    }
				);

				// получаем самый вложенный первый элемент
				nodes.first = nodes.nodes[0];
				while (nodes.first.firstChild)
				{
					nodes.first = nodes.first.firstChild;
				}

				els.first = nodes.first.getElement();

				// устанавливаем курсор на соответствующем элементе в главном окне
				manager.setCursor(
					{
						startNode: nodes.first,
						startOffset: 0,
						endNode: nodes.first,
						endOffset: 0,
						focusElement: els.first
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