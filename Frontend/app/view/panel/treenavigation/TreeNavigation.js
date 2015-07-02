/**
 * Дерево навигации по контенту центральной части, в заисимости от того какой контекст выбран
 * (редактирование заголовка, текста или ресурсов).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.TreeNavigation',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.treenavigation.TreeNavigationController',
			'FBEditor.view.panel.resources.navigation.Navigation',
			'FBEditor.view.panel.treenavigation.desc.Tree',
			'FBEditor.view.panel.treenavigation.body.Tree'
		],
		id: 'panel-treenavigation',
		xtype: 'panel-treenavigation',
		controller: 'panel.treenavigation',
		defaults: {
			width: '100%'
		},
		listeners: {
			clearSelection: 'onClearSelection'
		},

		/**
		 * @private
		 * @property {Object} Хранит данные выделенного узла.
		 */
		_selectData: null,

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'panel-desc-navigation'
				},
				{
					xtype: 'panel-body-navigation'
				}
			];
			me.callParent(arguments);
		},

		afterRender: function ()
		{
			var me = this,
				winRes;

			winRes = Ext.getCmp('window-resource');
			if (winRes && !winRes.isHidden())
			{
				// вставляем панель навигации ресурсов в открытое окно выбора ресурсов
				winRes.getWindowPanelResourcesNavigation().add({xtype: 'panel-resources-navigation'});
			}
			else
			{
				me.insert(1, {xtype: 'panel-resources-navigation'});
			}

			me.callParent(arguments);
		},

		saveSelectData: function (data)
		{
			var me = this;

			me._selectData = data;
		},

		restoreSelectData: function ()
		{
			var me = this,
				data = me._selectData,
				recordData;

			if (data && data.view)
			{
				//data.node.focusNode(data.record);
				//data.view.expandPath(data.record.getPath());
				recordData = data.record.getData();
				//console.log('restore data', data.record.getPath(), recordData);
				if (recordData.path)
				{
					data.view.selectPath(recordData.path);
				}
				else
				{
					data.view.selectPath(data.record.getPath());
				}
			}
		}
	}
);