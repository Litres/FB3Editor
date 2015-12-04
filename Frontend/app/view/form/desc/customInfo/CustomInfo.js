/**
 * Пользовательская информация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.customInfo.CustomInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		id: 'form-desc-customInfo',
		xtype: 'form-desc-customInfo',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		prefixName: 'custom-info',
		translateText: {
			infoType: 'Тип',
			desc: 'Описание'
		},

		initComponent: function ()
		{
			var me = this,
				prefixName = me.prefixName;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
						cls: 'field-required',
						keyEnterAsTab: true
					},
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'customInfo',
						btnPos: 'end',
						btnStyle: {
							margin: '0 0 0 5px'
						}
					},
					items: [
						{
							xtype: 'textfieldclear',
							name: prefixName + '-info-type',
							flex: 1,
							allowBlank: false,
							labelWidth: 60,
							fieldLabel: me.translateText.infoType
						},
						{
							xtype: 'desc-fieldcontainer',
							layout: 'hbox',
							flex: 3,
							items: [
								{
									xtype: 'displayfield',
									fieldLabel: me.translateText.desc,
									labelAlign: 'right',
									labelWidth: 160
								},
								{
									xtype: 'textareafield',
									name: prefixName + '-text',
									flex: 1,
									//grow: true,
									//growMin: 1,
									allowBlank: false,
									//minHeight: 200,
									height: 100,
									resizable: {
										handles: 's',
										minHeight: 50,
										pinned: true
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
						'_info-type': item.down('[name=' + prefixName + '-info-type]').getValue()
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