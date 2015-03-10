/**
 * Список языков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.lang.Lang',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.field.lang.LangStore'
		],
		xtype: 'langfield',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		editable: false,
		listConfig: {
			maxHeight: 'auto'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.field.lang.LangStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);