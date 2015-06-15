/**
 * ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.isbn.Isbn',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.publishInfo.isbn.IsbnController'
		],
		xtype: 'form-desc-publishInfo-isbn',
		controller: 'form.desc.publishInfo.isbn',
		layout: 'hbox',
		defaults: {
			anchor: '100%',
			flex: 1,
			labelWidth: 60,
			labelAlign: 'right'
		},

		/**
		 * @property {String} Имя поля.
		 */
		fieldName: '',

		translateText: {
			isbn: 'ISBN',
			isbnError: 'По шаблону ([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]. Например 978-5-358-02523-3'
		},

		initComponent: function ()
		{
			var me = this,
				name = me.fieldName;

			me.plugins = {
				ptype: 'fieldcontainerreplicator',
				groupName: name,
				btnStyle: {
					margin: '0 0 0 5px'
				}
			};
			me.items = [
				{
					xtype: 'textfield',
					name: name,
					regex: /^([0-9]+[\-\s]){3,6}[0-9]*[xX0-9]$/,
					regexText: me.translateText.isbnError,
					fieldLabel: me.translateText.isbn,
					cls: 'field-optional',
					afterBodyEl:  '<span class="after-body">' + me.translateText.isbnError + '</span>',
					listeners: {
						loadData: function (data)
						{
							me.fireEvent('loadData', data);
						}
					}
				}
			];
			me.callParent(arguments);
		},

		getValues: function ()
		{
			var me = this,
				name = me.fieldName,
				data = [],
				items;

			items = me.ownerCt.query('textfield[name=' + name + ']');
			Ext.each(
				items,
				function (item)
				{
					if (item.getValue())
					{
						data.push(item.getValue());
					}
				}
			);

			return data;
		}
	}
);