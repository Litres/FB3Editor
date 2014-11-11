/**
 * Элемент, хранящий специфические для периодических изданий сведения.
 * Для каждого периодического издания вводится ID, позволяющий опознавать вышедшие в его рамках номера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.periodical.Periodical',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-periodical',

		translateText: {
			title: 'Заголовок',
			issn: 'ISSN',
			issnError: 'Значение должно соответствовать шаблону \d{4}-\d{3}(\d|X). Например: 1748-7188',
			desc: 'Описание',
			number: 'Номер',
			year: 'Год',
			date: 'Дата'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					hideLabel: true,
					margin: '0 0 0 0',
					defaults: {
						anchor: '100%',
						flex: 1,
						xtype: 'displayfield',
						hideLabel: true,
						margin: '0 2 0 0'
					},
					items: [
						{
							value: me.translateText.title + ':',
							flex: 0,
							width: 280
						},
						{
							value: me.translateText.issn + ':'
						},
						{
							value: me.translateText.desc + ':'
						},
						{
							value: me.translateText.number + ':'
						},
						{
							value: me.translateText.year + ':'
						},
						{
							value: me.translateText.date + ':'
						}
					]
				},
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					hideLabel: true,
					combineErrors: true,
					msgTarget: 'side',
					defaults: {
						anchor: '100%',
						flex: 1,
						labelAlign: 'top',
						labelPad: '0',
						xtype: 'textfield',
						msgTarget: 'none',
						hideLabel: true,
						margin: '0 2 0 0'
					},
					items: [
						{
							xtype: 'form-desc-title',
							flex: 0,
							width: 280,
							layout: 'fit',
							allowBlank: true,
							defaults: {
								labelWidth: 140,
								labelAlign: 'right',
								margin: '0 0 2 0'
							}
						},
						{
							name: 'periodical-issn',
							regex: /^\d{4}-\d{3}(\d|X)$/,
							regexText: me.translateText.issnError,
							fieldLabel: me.translateText.issn
						},
						{
							name: 'periodical-desc',
							allowBlank: false,
							fieldLabel: me.translateText.desc
						},
						{
							xtype: 'numberfield',
							name: 'periodical-number',
							allowBlank: false,
							fieldLabel: me.translateText.number
						},
						{
							xtype: 'numberfield',
							name: 'periodical-year',
							allowBlank: false,
							fieldLabel: me.translateText.year
						},
						{
							xtype: 'datefield',
							name: 'periodical-date',
							allowBlank: false,
							fieldLabel: me.translateText.date
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);