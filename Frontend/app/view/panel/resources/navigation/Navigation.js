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

		/**
		 * @property {Boolean} Отображать ли файлы в структуре.
		 */
		visibleFiles: true,

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

				    val = me.parseNameResource(item.name, {path: ''});
				    if (val)
				    {
					    //treeData.push(val);
					    if (treeData.length && val.children)
					    {
						    treeData = me.groupTreeData(val, treeData);
					    }
					    else
					    {
						    treeData.push(val);
					    }
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
			//console.log(rootTreeData);

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
				children = null,
				pos,
				partName,
				isLast;

			// получаем имя директории
			pos = fileName.indexOf('/');
			isLast = pos === -1;
			partName = isLast ? fileName : fileName.substring(0, pos);
			node.text = partName;

			if (!me.visibleFiles)
			{
				// скрываем файлы в узлах дерева
				node.visible = isLast ? false : true;
			}
			node.leaf = isLast ? true : false;

			// полный путь директории
			node.path = pn.path ? pn.path + '/' + partName : partName;

			// полное имя файла в этой директории
			//node.fullName = pn.fullName;

			// получаем последнею часть имени файла, которая следует за именем текущей директории
			partName = fileName.slice(pos + 1);

			// последняя директория в ветке дерева не должна иметь дпополнительную иконку для открывания
			node.expandable = partName.indexOf('/') === -1 ? false : true;

			// парсим последнюю часть имени файла
			if (!isLast)
			{
				children = [];
				children.push(me.parseNameResource(partName, node));
			}
			node.children = children;

			return node;
		},

		groupTreeData: function (node, data)
		{
			var me = this,
				treeData = data;

			Ext.each(
				treeData,
				function (item, i)
				{
					var val;

					if (item.text === node.text && item.children && node.children)
					{
						val = me.groupTreeData(node.children[0], item.children);
						treeData[i].children = val;
					}
					else if (data.length === i + 1)
					{
						treeData.push(node);
					}
				}
			);

			return treeData;
		}
	}
);