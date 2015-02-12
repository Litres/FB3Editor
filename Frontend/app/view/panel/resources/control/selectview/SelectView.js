/**
 * Компонент выбора вида отображения ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.resources.control.selectview.SelectView',
	{
		extend: 'Ext.form.ComboBox',
		requires: [
			'FBEditor.view.panel.resources.control.selectview.SelectViewStore'
		],
		xtype: 'panel-resources-selectview',
		fieldLabel: 'Вид',
		labelWidth: 30,
		queryMode: 'local',
		displayField: 'name',
		valueField: 'type',
		forceSelection: true,
		editable: false,
		value: "great",
		listeners: {
			select: function (combo, records)
			{
				var type = records[0].getData().type;

				Ext.getCmp('view-resources').setTpl(type);
			}
		},

		initComponent:  function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.view.panel.resources.control.selectview.SelectViewStore');
			me.callParent(arguments);
		}
	}
);