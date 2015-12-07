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
		id: 'form-desc-periodical',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		prefixName: 'periodical',

		translateText: {
			id: 'ID',
			idError: 'По шаблону [0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}. ' +
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
				prefixName = me.prefixName;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
					cls: 'desc-fieldcontainer',
					layout: 'hbox',
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: prefixName,
						btnPos: 'end',
						btnCls: 'plugin-fieldcontainerreplicator-big-btn',
						btnStyle: {
							margin: '0 0 0 5px',
							width: '40px',
							height: '65px'
						}
					},
					items: [
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 100,
								labelAlign: 'right',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'textfieldclear',
									fieldLabel: me.translateText.id,
									name: prefixName + '-id',
									allowBlank: false,
									regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/,
									regexText: me.translateText.idError,
									cls: 'field-required'
								},
								{
									xtype: 'numberfield',
									name: prefixName + '-number',
									allowBlank: false,
									fieldLabel: me.translateText.number,
									cls: 'field-required'
								},
								{
									xtype: 'numberfield',
									name: prefixName + '-year',
									allowBlank: false,
									fieldLabel: me.translateText.year,
									cls: 'field-required'
								},
								{
									xtype: 'datefield',
									name: prefixName + '-date',
									fieldLabel: me.translateText.date,
									cls: 'field-optional'
								},
								{
									xtype: 'textfield',
									name: prefixName + '-issn',
									regex: /^\d{4}-\d{3}(\d|X)$/,
									regexText: me.translateText.issnError,
									fieldLabel: me.translateText.issn,
									cls: 'field-optional'
								},
								{
									xtype: 'textfield',
									name: prefixName + '-text',
									fieldLabel: me.translateText.desc,
									cls: 'field-optional'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 10
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							items: [
								{
									xtype: 'form-desc-title',
									name: prefixName + '-title',
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelWidth: 160,
										labelAlign: 'right'
									}
								}
							]
						}
					]
				}
			];
			me.callParent(arguments);
		},

		getValues: function (d)
		{
			var me = this,
				prefixName = me.prefixName,
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						__text: item.down('[name=' + prefixName + '-text]').getValue(),
						_number: item.down('[name=' + prefixName + '-number]').getValue(),
						_year: item.down('[name=' + prefixName + '-year]').getValue(),
						_date: Ext.Date.format(item.down('[name=' + prefixName + '-date]').getValue(), 'Y-m-d')
					};
					val = me.removeEmptyValues(val);
					val = {
						_id: item.down('[name=' + prefixName + '-id]').getValue(),
						title: item.down('[name=' + prefixName + '-title]').getValues(),
						issn: item.down('[name=' + prefixName + '-issn]').getValue(),
						issue: val
					};
					val = me.removeEmptyValues(val);

					if (val)
					{
						values = values || [];
						values.push(val);
					}
				}
			);

			if (values)
			{
				data[prefixName] = values;
			}

			return data;
		}
	}
);