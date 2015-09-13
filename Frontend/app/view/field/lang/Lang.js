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
			'FBEditor.view.field.lang.LangController',
			'FBEditor.view.field.lang.LangStore'
		],
		controller: 'langfield',
		xtype: 'langfield',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		editable: true,
		typeAhead: true,
		value: '',
		listConfig: {
			maxHeight: 210,
			tpl : '<tpl for="."><tpl if="value!=\'line\'"><div class="x-boundlist-item">{name}</div>' +
			      '<tpl else><div class="x-boundlist-item x-boundlist-item-line"></div></tpl></tpl>'
		},

		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
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