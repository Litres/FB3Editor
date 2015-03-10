/**
 * Список возможных типов связей с объектами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.Link',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.relations.object.LinkStore'
		],
		xtype: 'form-desc-relations-object-link',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		fieldLabel: 'Тип связи',
		name: 'relations-object-link',
		allowBlank: false,
		editable: false,
		listConfig: {
			maxHeight: 'auto'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.relations.object.LinkStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);