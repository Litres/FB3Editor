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
			var me = this,
				fieldStyleAllow = me.fieldDefaults.fieldStyle + '; color: ' +
				                  FBEditor.view.form.desc.Desc.ALLOW_COLOR;

			me.items = [
				{
					xtype: 'desc-fieldcontainer',
					layout: 'hbox',
					hideLabel: true,
					margin: '0',
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
							value: me.translateText.publisher + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.city + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.year + ':',
							fieldStyle: fieldStyleAllow
						},
						{
							value: me.translateText.isbn + ':',
							fieldStyle: fieldStyleAllow
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
					margin: '0 0 2',
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
						btnStyle: {
							margin: '0 0 0 2px'
						}
					},
					items: [
						{
							name: 'publish-info-title',
							allowBlank: false,
							fieldLabel: me.translateText.title
						},
						{
							name: 'publish-info-publisher',
							fieldLabel: me.translateText.publisher
						},
						{
							name: 'publish-info-city',
							fieldLabel: me.translateText.city
						},
						{
							xtype: 'numberfield',
							name: 'publish-info-year',
							fieldLabel: me.translateText.year
						},
						{
							name: 'publish-info-isbn',
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