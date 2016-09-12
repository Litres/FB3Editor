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
		onItemClick: function (nodeView, record)
		{
			var me = this;

			me.callParent(arguments);

			// устанавливаем курсор на элементе и прокурчиваем к нему окно
			me.setFocusElement(record);
		},

		/**
		 * Устанавливает фокус на элементе и прокуручивает к нему скролл.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		setFocusElement: function (record)
		{
			var me = this,
				data = record.getData(),
				els = {},
				nodes = {},
				manager = FBEditor.getEditorManager(),
				root,
				rootNode;

			if (!me.isActiveBody())
			{
				// ждем рендеринга панели тела
				Ext.defer(
					function ()
					{
						me.setFocusElement(record);
					},
				    200
				);
			}
			else
			{
				// получаем элемент по его id
				els.node = manager.getElementById(data.elementId);

				if (els.node)
				{
					// устанавливаем фокус на корневом узле главного окна
					root = manager.getContent();
					rootNode = root.getNodeHelper().getNode();
					rootNode.focus();

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
							startNode: nodes.first
						}
					);
				}
			}
		},

		/**
		 * Открывает панель текста.
		 */
		openContent: function ()
		{
			var me = this,
				cmd;

			// если панель не открыта
			if (!me.isActiveBody())
			{
				cmd = Ext.create('FBEditor.command.OpenBody');

				if (cmd.execute())
				{
					FBEditor.HistoryCommand.add(cmd);
				}
			}
		},

		/**
		 * Активна ли панель тела.
		 * @return {Boolean}
		 */
		isActiveBody: function ()
		{
			var bridge = FBEditor.getBridgeWindow(),
				mainContent,
				res;

			mainContent = bridge.Ext.getCmp('panel-main-content');
			res = mainContent.isActiveItem('main-editor');

			return res;
		}
	}
);