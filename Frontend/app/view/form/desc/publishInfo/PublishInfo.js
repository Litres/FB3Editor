/**
 * Информация о бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.PublishInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.publishInfo.biblio.Biblio',
			'FBEditor.view.form.desc.publishInfo.isbn.Isbn',
			'FBEditor.view.form.desc.publishInfo.sequence.Sequence',
			'FBEditor.view.form.desc.publishInfo.title.Title'
		],
		id: 'form-desc-publishInfo',
		xtype: 'form-desc-publishInfo',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		prefixName: 'paper-publish-info',

		translateText: {
			title: 'Название',
			publisher: 'Издательство',
			city: 'Город',
			year: 'Год',
			biblio: 'Библиограф. описание'
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
						groupName: 'publishInfo',
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
							cls: 'block-container', // необходим для выделения блока полей
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 130,
								labelAlign: 'right',
								keyEnterAsTab: true
							},
							items: [
								{
									xtype: 'form-desc-publishInfo-title',
									name: prefixName + '-title',
									allowBlank: false,
									fieldLabel: me.translateText.title,
									cls: 'field-required',
									plugins: 'fieldCleaner'
								},
								{
									xtype: 'desc-fieldcontainer',
									items: [
										{
											xtype: 'form-desc-biblio-description',
											name: prefixName + '-biblio-description'
										}
									],
									fieldLabel: me.translateText.biblio,
									cls: 'field-optional'
								},
								{
									xtype: 'textfield',
									name: prefixName + '-publisher',
									fieldLabel: me.translateText.publisher,
									cls: 'field-optional',
									plugins: 'fieldCleaner'
								},
								{
									xtype: 'textfield',
									name: prefixName + '-city',
									fieldLabel: me.translateText.city,
									cls: 'field-optional',
									plugins: 'fieldCleaner'
								},
								{
									xtype: 'desc-fieldcontainer',
									flex: 1,
									layout: 'anchor',
									defaults: {
										anchor: '100%',
										labelWidth: 130,
										labelAlign: 'right',
										keyEnterAsTab: true
									},
									items: [
										{
											xtype: 'textfield',
											name: prefixName + '-year',
											fieldLabel: me.translateText.year,
											cls: 'field-optional',
											plugins: 'fieldCleaner'
										},
										{
											xtype: 'form-desc-publishInfo-isbn',
											fieldName: prefixName + '-isbn',
											labelWidth: 130
										},
										{
											xtype: 'form-desc-publishInfo-sequence',
											fieldName: prefixName + '-sequence'
										}
									]
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
					var val,
						isbn,
						sequence;

					isbn = item.down('form-desc-publishInfo-isbn').getValues();
					sequence = item.down('form-desc-publishInfo-sequence').getValues();
					val = {
						isbn: isbn,
						sequence: sequence,
						_publisher: item.down('[name=' + prefixName + '-publisher]').getValue(),
						_city: item.down('[name=' + prefixName + '-city]').getValue(),
						_year: item.down('[name=' + prefixName + '-year]').getValue(),
						_title: item.down('[name=' + prefixName + '-title]').getValue(),
						'biblio-description': item.down('[name=' + prefixName + '-biblio-description]').getValue()
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