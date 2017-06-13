/**
 * Объекты, имеющие отношение к произведению.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.object.Object',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.object.item.ObjectItem'
		],
		
		id: 'form-desc-relations-object',
		xtype: 'form-desc-relations-object',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'form-desc-relations-object-item'
				}
			];
						
			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				items = me.items,
				isValid = true;

			items.each(
				function (item)
				{
					if (!item.isValid())
					{
						isValid = false;

						return false;
					}
				}
			);

			return isValid;
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

					val = item.getValues();

					if (val && !me.valContains(val, values))
					{
						values = values || [];
						values.push(val);
					}
				}
			);

			if (values)
			{
				data['fb3-relations'] = data['fb3-relations'] || {};
				data['fb3-relations'].object = values;
			}

			return data;
		},

		/**
		 * Проверяет существует ли переданное значение в массиве.
		 * @param val {Object} Значение.
		 * @param values {Object[]} Массив значений.
		 * @return {Boolean}
		 */
		valContains: function (val, values)
		{
			var contains = false;

			Ext.each(
				values,
				function (item)
				{
					if (val._id === item._id && val._link === item._link)
					{
						contains = true;

						return false;
					}
				}
			);

			return contains;
		}
	}
);