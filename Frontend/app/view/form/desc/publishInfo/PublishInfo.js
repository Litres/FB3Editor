/**
 * Информация о бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.PublishInfo',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		xtype: 'form-desc-publishInfo',

		translateText: {
			title: 'Заголовок',
			publisher: 'Издатель',
			city: 'Город',
			year: 'Год',
			isbn: 'ISBN',
			isbnError: 'Значение должно соответствовать шаблону ([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]. ' +
			           'Например: 978-5-358-02523-3'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
					xtype: 'fieldcontainer',
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
							value: me.translateText.title + ':'
						},
						{
							value: me.translateText.publisher + ':'
						},
						{
							value: me.translateText.city + ':'
						},
						{
							value: me.translateText.year + ':'
						},
						{
							value: me.translateText.isbn + ':'
						},
						{
							flex: 0,
							width: 140,
							value: ''
						}
					]
				},
				{
					xtype: 'fieldcontainer',
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
						groupName: 'publishInfo',
						btnPos: 'end',
						btnStyle: 'margin: 0 0 0 2px'
					},
					items: [
						{
							name: 'publishInfo-title',
							allowBlank: false,
							fieldLabel: me.translateText.title
						},
						{
							name: 'publishInfo-publisher',
							fieldLabel: me.translateText.publisher
						},
						{
							name: 'publishInfo-city',
							fieldLabel: me.translateText.city
						},
						{
							xtype: 'numberfield',
							name: 'publishInfo-year',
							fieldLabel: me.translateText.year
						},
						{
							name: 'publishInfo-isbn',
							regex: /^([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]$/,
							regexText: me.translateText.isbnError,
							fieldLabel: me.translateText.isbn
						}
					]
				}
			];
			me.callParent(arguments);
		}
	}
);