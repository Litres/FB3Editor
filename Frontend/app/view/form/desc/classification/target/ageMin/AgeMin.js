/**
 * Минимальный возраст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.ageMin.AgeMin',
	{
		extend: 'Ext.form.field.ComboBox',
		requires: [
			'FBEditor.view.form.desc.classification.target.ageMin.AgeMinStore'
		],
		xtype: 'form-desc-classification-target-agemin',
		queryMode: 'local',
		displayField: 'name',
		valueField: 'value',

		initComponent: function ()
		{
			var me = this;

			me.store = Ext.create('FBEditor.view.form.desc.classification.target.ageMin.AgeMinStore');
			me.callParent(arguments);
		}
	}
);