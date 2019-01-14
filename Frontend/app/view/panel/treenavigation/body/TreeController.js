/**
 * Контроллер дерева навигации по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.TreeController',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTreeController',
		
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
                view = me.getView(),
				data = record.getData(),
				manager = FBEditor.getEditorManager(),
				els = {},
				nodes = {},
				helper;

			if (!view.isActivePanel())
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
					helper = els.node.getNodeHelper();
					
					// перематываем скролл во всех окнах
					helper.scrollIntoView();
					
					// получаем самый вложенный первый элемент
					els.first = els.node.getDeepFirst();
					helper = els.first.getNodeHelper();
					nodes.first = helper.getNode();
					
					// учитываем оверлей в тексте
					nodes.first = nodes.first.nodeValue === '' && nodes.first.previousSibling ?
						nodes.first.previousSibling : nodes.first;
					nodes.first = manager.getDeepFirst(nodes.first);
					
					// устанавливаем курсор на соответствующем элементе в главном окне
					manager.setCursor(
						{
							startNode: nodes.first
						}
					);
				}
			}
		}
	}
);