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
					defaults: {
						anchor: '100%',
						flex: 1,
						labelAlign: 'right'
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
							xtype: 'textfieldrequire',
							name: 'custom-info-info-type',
							allowBlank: false,
							labelWidth: 160,
							fieldLabel: me.translateText.infoType
						},
						{
							xtype: 'textareafield',
							name: 'custom-info-text',
							grow: true,
							growMin: 1,
							allowBlank: false,
							fieldLabel: me.translateText.desc
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);