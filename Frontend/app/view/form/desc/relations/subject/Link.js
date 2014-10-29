/**
 * Список возможных типов связей с субьектами.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Link',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.relations.subject.LinkStore'
		],
		xtype: 'form-desc-relations-subject-link',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		fieldLabel: 'Тип связи',
		name: 'relations-subject-link',
		allowBlank: false,
		editable: false,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.relations.subject.LinkStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);