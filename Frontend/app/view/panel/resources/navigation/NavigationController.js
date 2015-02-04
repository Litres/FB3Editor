/**
 * Контроллер дерева навигации по ресурсам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.navigation.NavigationController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.resources.navigation',

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				data;

			//node.toggle(record);
			data = record.getData();
			console.log(node, record, data);
			if (data.expanded)
			{
				console.log('collapse');
				node.collapse(record);
			}
			else
			{
				node.expand(record);
			}
			if (!record.isExpandable())
			{
				//data = record.getData();
				//console.log(data);
			}
		}
	}
);