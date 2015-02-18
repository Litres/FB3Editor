/**
 * Дерево навигации по ресурсам.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.navigation.Navigation',
	{
		extend: 'FBEditor.view.panel.treenavigation.AbstractTree',
		requires: [
			'FBEditor.view.panel.resources.navigation.NavigationController',
			'FBEditor.store.resource.Navigation'
		],
		id: 'panel-resources-navigation',
		xtype: 'panel-resources-navigation',
		controller: 'panel.resources.navigation',
		useArrows: true,
		listeners: {
			itemclick: 'onItemClick'
		},

		syncContentId: 'panel-resources',

		/**
		 * @property {Boolean} Отображать ли файлы в структуре.
		 */
		visibleFiles: false,

		/**
		 * @property {Boolean} Отображать ли иконку для открывавния у последней директории в ветке.
		 */
		expandableLastFolder: false,

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.store.resource.Navigation');
			me.callParent(arguments);
		},

		/**
		 * Загружает в дерево ресурсы.
		 * @param {FBEditor.resource.Resource[]} data Данные ресурсов.
		 */
		loadData: function (data)
		{
			var me = this,
				treeData;

			//console.log(data);
			treeData = me.getTreeData(data);
			me.store.loadData(treeData);
			Ext.defer(
				function ()
				{
					me.restoreOpenNode();
				},
			    200
			);
		},

		/**
		 * Возвращает струткуру дерева ресурсов по директориям.
		 * @param {FBEditor.resource.Resource[]} data Данные ресурсов.
		 * @return {Array} Структура дерева.
		 */
		getTreeData: function (data)
		{
			var me = this,
				rootData = me.store.getRoot().data,
				treeData = [],
				rootTreeData;

			Ext.each(
				data,
			    function (item)
			    {
				    var val;

				    val = me.parseNameResource(item.name, {path: ''});
				    //console.log('val', val);
				    if (val)
				    {
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
			//console.log(treeData);
			rootTreeData = [
				{
					root: true,
					text: rootData.text,
					expandable: rootData.expandable,
					icon: rootData.icon,
					cls: rootData.cls,
					iconCls: rootData.iconCls,
					children: treeData
				}
			];

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
				isLast,
				isFile;

			// получаем имя директории
			pos = fileName.indexOf('/');
			isLast = pos === -1;
			partName = isLast ? fileName : fileName.substring(0, pos);
			node.text = partName;

			// файл ли
			isFile = isLast && fileName.indexOf('.') !== -1 ? true : false;

			if (!me.visibleFiles)
			{
				// скрываем файлы в узлах дерева
				node.visible = isFile ? false : true;
			}
			node.leaf = isFile ? true : false;
			if (isLast && !isFile)
			{
				//node.loaded = true;
				children = [];
			}

			// полный путь директории
			node.path = pn.path ? pn.path + '/' + partName : partName;
			node.id = node.path;

			// получаем последнею часть имени файла, которая следует за именем текущей директории
			partName = fileName.slice(pos + 1);

			// последняя директория в ветке дерева не должна иметь дпополнительную иконку для открывания
			//node.expandable = partName.indexOf('/') === -1 ? false : true;
			node.expandable = false;

			node.icon = ' ';
			node.cls = 'treenavigation-children treenavigation-children-resource';
			node.iconCls = 'treenavigation-children-icon treenavigation-children-icon-resource fa';

			// парсим последнюю часть имени файла
			if (!isLast)
			{
				children = [];
				children.push(me.parseNameResource(partName, node));
			}
			node.children = children;

			return node;
		},

		/**
		 * Группирует узлы дерева по названиям.
		 * @param {Object} node Узел.
		 * @param {Object[]} data Узлы.
		 * @return {Object[]} Сгруппированные узлы.
		 */
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
						if (item.children.length === 0)
						{
							val = node.children;
						}
						else
						{
							val = me.groupTreeData(node.children[0], item.children);
						}
						treeData[i].children = val;
					}
					else if (data.length === i + 1)
					{
						treeData.push(node);
					}
				}
			);

			return treeData;
		},

		/**
		 * Восстанвливает открытый узел дерева и обновляет отображение ресурсов.
		 */
		restoreOpenNode: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				rootText = me.store.getRoot().data.text,
				path;

			me.collapseAll();
			path = bridge.FBEditor.resource.Manager.getActiveFolder();
			path = path ? '/' + path : '';
			path = '/' + rootText + path;

			// открываем ветку узла
			me.expandPath(
				path,
				'text',
				'/',
				function (success, node)
				{
					var data,
						folder;

					if (success)
					{
						// отображаем активную папку
						data = node.getData();
						folder = data.path ? data.path : '';
						bridge.FBEditor.resource.Manager.setActiveFolder(folder);
					}
				}
			);
		},

		/**
		 * Переписывает стандартный метод, возвращающий корневой узел.
		 * @return {Ext.data.TreeModel} Корневой узел.
		 */
		getRootNode: function ()
		{
			var me = this,
				store= me.store,
				root;

			root = store && store.first() ? store.first() : me.callParrent();

			return root;
		}
	}
);