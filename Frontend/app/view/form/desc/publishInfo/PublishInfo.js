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
					xtype: 'textfield',
					name: 'publishInfo-title',
					fieldLabel: me.translateText.title
				},
				{
					xtype: 'textfield',
					name: 'publishInfo-publisher',
					fieldLabel: me.translateText.publisher
				},
				{
					xtype: 'textfield',
					name: 'publishInfo-city',
					fieldLabel: me.translateText.city
				},
				{
					xtype: 'textfield',
					name: 'publishInfo-year',
					fieldLabel: me.translateText.year
				},
				{
					xtype: 'textfield',
					name: 'publishInfo-isbn',
					regex: /^([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]$/,
					regexText: me.translateText.isbnError,
					emptyText: me.translateText.isbnError,
					fieldLabel: me.translateText.isbn
				}
			];
			me.callParent(arguments);
		}
	}
);