/**
 * ISBN.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.isbn.Isbn',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.isbn.IsbnController'
		],
		xtype: 'form-desc-isbn',
		controller: 'form.desc.isbn',
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
						},
						blur: function (field)
						{
							// разбиваем введенные через запятую значения на отдельные поля
							me.splitField(field);
						}
					}
				}
			];
			me.callParent(arguments);
		},

		/**
		 * Разбивает введеные через запятую значения на отдельные поля.
		 * @param {Ext.form.field.Text} field Текстовое поле.
		 */
		splitField: function (field)
		{
			var val = field.getValue(),
				container,
				plugin,
				values;

			// разбиваем строку на массив значений
			values = val.split(/,[ ]*/);

			if (values.length > 1)
			{
				container = field.ownerCt;

				Ext.Array.each(
					values,
				    function (item, index)
				    {
					    var f;

					    // плагин
					    plugin = container.getPlugin('fieldcontainerreplicator');

					    // поле
					    f = container.down('textfield');

					    // устаналвиваем значение
					    f.setValue(item);

					    if (index + 1 < values.length)
					    {
						    // добавляем новый контейнер
						    plugin.addFields();

						    // ссылка на новый контейнер
						    container = container.nextSibling();
					    }
				    }
				);
			}
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