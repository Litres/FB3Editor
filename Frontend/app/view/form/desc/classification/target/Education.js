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
			'FBEditor.view.form.desc.classification.target.EducationStore',
			'FBEditor.view.form.desc.classification.target.EducationController'
		],
		xtype: 'form-desc-classification-target-education',
		controller: 'form.desc.classification.target.education',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',
		fieldLabel: 'Образование',
		editable: false,
		listeners: {
			change: 'onChange'
		},

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