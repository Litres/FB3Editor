/**
 * Авторы, правообладатели и другие имеющие отношение к произведению субьекты.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.relations.subject.Subject',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.relations.subject.item.SubjectItem'
		],

		id: 'form-desc-relations-subject',
		xtype: 'form-desc-relations-subject',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		translateText: {
			error: 'Необходимо заполнить хотя бы одну персону'
		},

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'form-desc-relations-subject-item'
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

					val = item.getValues();

					if (val && !me.valContains(val, values))
					{
						values = values || [];
						values.push(val);
					}
				}
			);

			data['fb3-relations'] = data['fb3-relations'] || {};
			data['fb3-relations'].subject = values;

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