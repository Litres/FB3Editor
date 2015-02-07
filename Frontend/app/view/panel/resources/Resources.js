/**
 * Панель ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.Resources',
	{
		extend: 'Ext.panel.Panel',
		requires: [
			'FBEditor.view.panel.resources.ResourcesController',
			'FBEditor.view.panel.resources.view.ResourcesView'
		],
		id: 'panel-resources',
		xtype: 'panel-resources',
		controller: 'panel.resources',
		autoScroll: true,
		bodyPadding: 5,

		initComponent: function ()
		{
			var me = this;

			var viewTypes = Ext.create(
				'Ext.data.Store',
				{
					fields: ['type', 'name'],
					data : [
						{type: "great", name: "Огромные значки"},
						{type: "large", name: "Крупные значки"},
						{type: "normal", name: "Обычные значки"},
						{type: "small", name: "Мелкие значки"},
						{type: "list", name: "Список"},
						{type: "table", name: "Таблица"}
					]
				}
			);
			me.items = [
				{
					xtype: 'combo',
					fieldLabel: 'Вид',
					labelWidth: 30,
					store: viewTypes,
					queryMode: 'local',
					displayField: 'name',
					valueField: 'type',
					forceSelection: true,
					editable: false,
					value: "great",
					listeners:{
						select: function (combo, records)
						{
							var type = records[0].getData().type

							Ext.getCmp('view-resources').setTpl(type);
						}
					}
				},
				{
					xtype: 'view-resources'
				}
			];
			me.callParent(arguments);
		}
	}
);