/**
 * Пользовательская информация.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.customInfo.CustomInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',

		xtype: 'form-desc-customInfo',
		id: 'form-desc-customInfo',
		name: 'form-desc-plugin-fieldcontainerreplicator',
		cls: 'desc-fieldcontainer',

		translateText: {
			infoType: 'Тип',
			desc: 'Описание'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					cls: 'block-container', // необходим для выделения блока полей
					defaults: {
						anchor: '100%',
						labelAlign: 'right',
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
							xtype: 'desc-field-text-required',
							name: 'custom-info-info-type',
							flex: 1,
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
									xtype: 'desc-field-textarea-required',
									cls: 'custom-info-text',
									name: 'custom-info-text',
									flex: 1,
									height: 100,
									plugins: {
										ptype: 'fieldCleaner',
										style: 'right: 17px; margin-top: -22px'
									},
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
				items = me.items,
				data = d,
				values = null;

			items.each(
				function (item)
				{
					var val;

					val = {
						__text: item.down('[name=custom-info-text]').getValue(),
						'_info-type': item.down('[name=custom-info-info-type]').getValue()
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
				data['custom-info'] = values;
			}

			return data;
		}
	}
);