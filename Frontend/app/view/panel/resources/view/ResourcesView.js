/**
 * Отображение списка ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.view.ResourcesView',
	{
		extend: 'Ext.view.View',
		requires: [
			'FBEditor.store.resource.Resource',
			'FBEditor.view.panel.resources.tpl.LargeResource'
		],
		xtype: 'view-resources',
		id: 'view-resources',
		itemSelector: 'div.resource-thumb-wrap',
		emptyText: 'Нет доступных ресурсов',
		deferEmptyText: false,

		initComponent: function ()
		{
			var me = this;

			me.tpl = Ext.create('FBEditor.view.panel.resources.tpl.LargeResource');
			me.store = Ext.create('FBEditor.store.resource.Resource');
			me.callParent(arguments);
		},

		/**
		 * Устанавливает данные ресурсов.
		 * @param {Object} data Данные.
		 */
		setStoreData: function (data)
		{
			var me = this,
				store = me.store;

			store.setData(data);
		}
	}
);