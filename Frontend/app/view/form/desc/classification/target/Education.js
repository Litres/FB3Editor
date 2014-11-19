/**
 * Список типов образований целевой аудетории.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.Education',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.classification.target.EducationStore'
		],
		xtype: 'form-desc-classification-target-education',
		queryMode: 'local',
		displayField: 'value',
		valueField: 'value',
		fieldLabel: 'Образование',
		emptyText: 'Образование',
		editable: false,
		hideLabel: true,

		initComponent: function ()
		{
			var me = this,
				store;

			store = Ext.create('FBEditor.view.form.desc.classification.target.EducationStore');
			me.store = store;
			me.callParent(arguments);
		}
	}
);