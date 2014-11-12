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
			id: 'ID',
			idError: 'Значение должно соответствовать шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
			         'Например: 18ea4ccf-daa9-102b-9003-10751c2f945c',
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
			var me = this,
				fieldStyleAllow = me.fieldDefaults.fieldStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

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
					        value: me.translateText.id + ':'
				        },
						{
							value: me.translateText.title + ':',
							flex: 0,
							width: 210,
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.issn + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.desc + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.number + ':'
						},
						{
							value: me.translateText.year + ':'
						},
						{
							value: me.translateText.date + ':',
							fieldStyle: fieldStyleAllow
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
							name: 'periodical-id',
							allowBlank: false,
							regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
							regexText: me.translateText.idError,
							fieldLabel: me.translateText.id
						},
						{
							xtype: 'form-desc-title',
							flex: 0,
							width: 210,
							layout: 'fit',
							allowBlank: true,
							defaults: {
								labelWidth: 90,
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
							fieldLabel: me.translateText.date
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);