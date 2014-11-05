/**
 * Привязка к месту и времени.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.coverage.Coverage',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [

		],
		xtype: 'form-desc-classification-coverage',
		fieldLabel: 'Привязка к месту и времени',
		items: [
			{
				xtype: 'textfield',
				fieldLabel: 'Страна',
				emptyText: 'Страна',
				hideLabel: true
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Место',
				emptyText: 'Место',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				fieldLabel: 'Дата',
				emptyText: 'Дата',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				fieldLabel: 'Дата начала',
				emptyText: 'Дата начала',
				hideLabel: true
			},
			{
				xtype: 'datefield',
				fieldLabel: 'Дата окончания',
				emptyText: 'Дата окончания',
				hideLabel: true
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Век',
				emptyText: 'Век',
				hideLabel: true
			}
		]
	}
);