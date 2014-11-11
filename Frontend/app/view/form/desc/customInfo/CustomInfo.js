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
							value: me.translateText.infoType + ':'
						},
						{
							value: me.translateText.desc + ':'
						},
						{
							flex: 0,
							width: 140,
							value: ''
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
					plugins: {
						ptype: 'fieldcontainerreplicator',
						groupName: 'customInfo',
						btnPos: 'end',
						btnStyle: {
							margin: '0 0 0 2px'
						}
					},
					items: [
						{
							name: 'customInfo-infoType',
							allowBlank: false,
							fieldLabel: me.translateText.infoType
						},
						{
							xtype: 'textareafield',
							name: 'customInfo-desc',
							fieldLabel: me.translateText.desc
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);