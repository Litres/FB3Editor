/**
 * Список жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.Subject',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.subject.SubjectStore'
		],
		xtype: 'form-desc-subject',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		fieldLabel: 'Жанр',
		name: 'subject',
		allowBlank: false,
		editable: false,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.subject.SubjectStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);