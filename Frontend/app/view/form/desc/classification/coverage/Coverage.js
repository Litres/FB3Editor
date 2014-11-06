/**
 * Привязка к месту и времени.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.coverage.Coverage',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-classification-coverage',
		fieldLabel: 'Привязка к месту и времени',
		items: [
			{
				xtype: 'textfield',
				name: 'classification-coverage-desc',
				fieldLabel: 'Описание',
				emptyText: 'Описание',
				hideLabel: true
			},
			{
				xtype: 'countryfield',
				name: 'classification-coverage-country',
				fieldLabel: 'Страна',
				emptyText: 'Страна',
				forceSelection: false,
				editable: false,
				hideLabel: true
			},
			{
				xtype: 'textfield',
				name: 'classification-coverage-place',
				fieldLabel: 'Место',
				emptyText: 'Место',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				name: 'classification-coverage-date',
				fieldLabel: 'Дата',
				emptyText: 'Дата',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				name: 'classification-coverage-dateFrom',
				fieldLabel: 'Дата начала',
				emptyText: 'Дата начала',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				name: 'classification-coverage-dateTo',
				fieldLabel: 'Дата окончания',
				emptyText: 'Дата окончания',
				hideLabel: true
			},
			{
				xtype: 'textfield',
				name: 'classification-coverage-age',
				fieldLabel: 'Век',
				emptyText: 'Век',
				hideLabel: true
			}
		]
	}
);