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
		animate: false,
		manageHeight: false,

		syncContentId: 'panel-resources',

		/**
		 * @property {Boolean} Отображать ли файлы в структуре.
		 */
		visibleFiles: false,

		/**
		 * @property {Boolean} Отображать ли иконку для открывавния у последней директории в ветке.
		 */
		expandableLastFolder: false,

		/**
		 * @property {Boolean} Находится ли панель в окне.
		 */
		inWindow: false,

		initComponent: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow();

			me.store = Ext.create('FBEditor.store.resource.Navigation');
			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				bridge = FBEditor.getBridgeWindow(),
				resData;

			resData = bridge.FBEditor.resource.Manager.getData();
			if (resData.length)
			{
				me.loadData(resData);
			}
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

				    val = Ext.clone(me.parseNameResource(item.name, {path: '', isFile: !item.isFolder}));

				    if (val)
				    {
					    if (treeData.length && val.children && val.children.length)
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
		 * @param {String} name Имя узла.
		 * @param {Object} parentNode Данные родительского узла дерева.
		 * @param {String} parentNode.path Родительский путь.
		 * @param {Boolean} [parentNode.isFile] Является ли узел файлом.
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
			isFile = pn.isFile || (isLast && fileName.indexOf('.') !== -1 ? true : false);

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
			node.childrenPath = partName;

			// последняя директория в ветке дерева не должна иметь дпополнительную иконку для открывания
			node.expandable = partName.indexOf('/') === -1 ? false : true;

			node.icon = ' ';
			node.cls = 'treenavigation-children treenavigation-children-resource';
			//node.iconCls = 'treenavigation-children-icon treenavigation-children-icon-resource fa';

			// парсим последнюю часть имени файла
			if (!isLast)
			{
				children = [];
				children.push(me.parseNameResource(partName, Ext.clone(node)));
			}
			node.children = Ext.clone(children);

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

					//console.log('item, node', item, node);

					if (item.text === node.text && item.children && node.children)
					{
						if (item.children.length === 0)
						{
							val = node.children;
						}
						else
						{
							//console.log('node', node);
							// TODO: есть плавающая ошибка при вложенности ресурса в подпапки когда node = undefined
							val = node.children[0] ? me.groupTreeData(node.children[0], item.children) : [];
						}

						treeData[i].children = val;
						treeData[i].expandable = true;
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

			//me.collapseAll();
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

		selectPath: function (p)
		{
			var me = this,
				rootText = me.store.getRoot().data.text,
				path = p;

			path = path.indexOf('/root') === 0 ? path : '/' + rootText + '/' + path;
			//console.log('!select path', path);
			me.callParent([path, 'text']);
		},

		/**
		 * Переписывает стандартный метод, возвращающий корневой узел (необходимо для метода #expandPath).
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