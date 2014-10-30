/**
 * Целевая аудитория.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.target.Target',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.classification.target.Education'
		],
		xtype: 'form-desc-classification-target',
		fieldLabel: 'Целевая аудитория',
		items: [
			{
				xtype: 'textfield',
				name: 'classification-target',
				fieldLabel: 'Описание',
				emptyText: 'Описание',
				hideLabel: true
			},
			{
				xtype: 'numberfield',
				name: 'classification-target-minAge',
				fieldLabel: 'Минимальный возраст',
				emptyText: 'Минимальный возраст',
				hideLabel: true,
				minValue: 2,
				maxValue: 50
			},
			{
				xtype: 'numberfield',
				name: 'classification-target-maxAge',
				fieldLabel: 'Максимальный возраст',
				emptyText: 'Максимальный возраст',
				hideLabel: true,
				minValue: 2,
				maxValue: 150
			},
			{
				xtype: 'form-desc-classification-target-education'
			}
		]
	}
);