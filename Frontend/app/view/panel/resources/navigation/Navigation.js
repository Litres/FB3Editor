/**
 * Дерево навигации по ресурсам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.navigation.Navigation',
	{
		extend: 'Ext.tree.Panel',
		requires: [
			'FBEditor.view.panel.resources.navigation.NavigationController',
			'FBEditor.store.resource.Navigation'
		],
		id: 'panel-resources-navigation',
		xtype: 'panel-resources-navigation',
		controller: 'panel.resources.navigation',
		useArrows: true,
		listeners: {
			itemClick: 'onItemClick'
		},

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.store.resource.Navigation');
			me.callParent(arguments);
		},

		/**
		 * Загружает в дерево ресурсы.
		 * @param {Object} data Данные ресурсов.
		 */
		loadData: function (data)
		{
			var me = this,
				treeData;

			treeData = me.getTreeData(data);
			me.store.loadData(treeData);
			Ext.getCmp('view-resources').setStoreData(data);
		},

		/**
		 * Возвращает струткуру дерева ресурсов по директориям.
		 * @param {Object[]} data Данные ресурсов.
		 * @return {Array} Структура дерева.
		 */
		getTreeData: function (data)
		{
			var me = this,
				rootText,
				treeData = [],
				rootTreeData;

			console.log(data);
			Ext.each(
				data,
			    function (item)
			    {
				    var val;

				    val = me.parseNameResource(item.name, {fullName: item.name, path: ''});
				    if (val)
				    {
					    treeData.push(val);
					    //treeData = me.groupTreeData(val, treeData);
				    }
			    }
			);
			rootText = me.store.getRoot().data.text;
			rootTreeData = [
				{
					root: true,
					text: rootText,
					children: treeData
				}
			];
			console.log(rootTreeData);

			return rootTreeData;
		},

		/**
		 * @private
		 * Парсит имя файла ресурса и возвращает объект узла для дерева, который может содержать другие вложенные узлы,
		 * соответствующие глубине вложенности файла, согласно его полного пути.
		 * @param {String} name Директория узла.
		 * @param {Object} parentNode Родительский узел дерева.
		 * @return {Object} Дочерний узел дерева.
		 */
		parseNameResource: function (name, parentNode)
		{
			var me = this,
				fileName = name,
				pn = parentNode,
				node = {},
				pos,
				partName,
				children;

			// получаем имя директории
			pos = fileName.indexOf('/');
			partName = pos !== -1 ? fileName.substring(0, pos) : name;
			node.text = partName;

			// скрываем файлы в узлах дерева
			//node.visible = partName === pn.fullName ? false : true;
			node.leaf = partName === pn.fullName ? true : false;

			// полный путь директории
			node.path = pn.path ? pn.path + '/' + partName : partName;

			// полное имя файла в этой директории
			node.fullName = pn.fullName;

			// получаем последнею часть имени файла, которая следует за именем текущей директории
			partName = fileName.slice(pos + 1);

			if (partName.indexOf('/') !== -1)
			{
				// парсим последнюю часть имени файла
				children = me.parseNameResource(partName, node);

				if (children)
				{
					node.children = children;
				}
			}
			else
			{
				// последняя директория в ветке дерева не должна открываться
				node.expandable = false;
			}

			return node;
		},

		groupTreeData: function (node, data)
		{
			var me = this,
				treeData = [],
				isGroup = true;

			Ext.each(
				data,
				function (item)
				{
					var val;

					if (item.text === node.text)
					{
						val = me.groupTreeData(node.children, item.children);
						item.children.push(val);
					}
					else
					{
						treeData.push(node);
					}
				}
			);

			return treeData;
		}
	}
);