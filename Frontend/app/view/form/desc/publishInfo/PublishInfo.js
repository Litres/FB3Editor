/**
 * Информация о бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.PublishInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		id: 'form-desc-publishInfo',
		xtype: 'form-desc-publishInfo',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			title: 'Название',
			publisher: 'Издательство',
			city: 'Город',
			year: 'Год',
			isbn: 'ISBN',
			isbnError: 'По шаблону ([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]. Например 978-5-358-02523-3'
		},

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'desc-fieldcontainer',
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
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 160,
								labelAlign: 'right'
							},
							items: [
								{
									xtype: 'textfieldclear',
									name: 'publish-info-title',
									allowBlank: false,
									fieldLabel: me.translateText.title
								},
								{
									xtype: 'textfield',
									name: 'publish-info-publisher',
									fieldLabel: me.translateText.publisher,
									cls: 'field-optional'
								},
								{
									xtype: 'textfield',
									name: 'publish-info-city',
									fieldLabel: me.translateText.city,
									cls: 'field-optional'
								}
							]
						},
						{
							xtype: 'fieldcontainer',
							width: 50
						},
						{
							xtype: 'desc-fieldcontainer',
							flex: 1,
							layout: 'anchor',
							defaults: {
								anchor: '100%',
								labelWidth: 160,
								labelAlign: 'right'
							},
							items: [
								{
									xtype: 'numberfield',
									name: 'publish-info-year',
									fieldLabel: me.translateText.year,
									cls: 'field-optional'
								},
								{
									xtype: 'textfieldclear',
									name: 'publish-info-isbn',
									regex: /^([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]$/,
									regexText: me.translateText.isbnError,
									fieldLabel: me.translateText.isbn,
									cls: 'field-optional'
								}
							]
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);