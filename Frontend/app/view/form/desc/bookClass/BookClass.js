/**
 * Список литературных форм.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.bookClass.BookClass',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.bookClass.BookClassStore'
		],
		xtype: 'form-desc-bookClass',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		fieldLabel: 'Литературная форма',
		editable: false,
		listConfig: {
			maxHeight: 'auto'
		},

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.bookClass.BookClassStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);