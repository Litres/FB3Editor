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
				treeData = [];

			console.log(data);
			Ext.each(
				data,
			    function (item)
			    {
				    var val;

				    val = me.parseNameResource(item.name, item.name);
				    treeData.push(val);
			    }
			);
			//treeData = me.groupTreeData(treeData, treeData);
			console.log(treeData);
			rootText = me.store.getRoot().data.text;
			treeData = [
				{
					text: rootText,
					children: treeData
				}
			];

			return treeData;
		},

		/**
		 * @private
		 * Парсит имя файла ресурса и возвращает объект узла для дерева, который может содержать другие вложенные узлы,
		 * соответствующие глубине вложенности файла, согласно его полного пути.
		 * @param {String} name Полный путь файла в архиве, отсносительно корневой директории ресурсов.
		 * @return {Object} Узел девера.
		 */
		parseNameResource: function (name, id)
		{
			var me = this,
				pos,
				partName,
				node = {};

			pos = name.indexOf('/');
			partName = pos !== -1 ? name.substring(0, pos) : name;
			node.text = partName;
			if (pos !== -1)
			{
				partName = name.slice(pos + 1);
				node.children = me.parseNameResource(partName, id);
			}
			else
			{
				node.leaf = true;
				node.id = id;
			}

			return node;
		},

		groupTreeData: function (data, fullData)
		{
			var treeData = [];

			Ext.each(
				data,
				function (item)
				{
					var val;

					if (!item.leaf)
					{
						val = item;
					}
					treeData.push(val);
				}
			);

			return treeData;
		}
	}
);