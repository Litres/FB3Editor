/**
 * Серия, в которой выпущено произведение.
 * Например "Детство, Отрочество, Юность" для книги Толстого "Детство".
 * Не путать серию с названием периодического издания.
 * Вложенность серий обозначает "многоуровневые" серии.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.sequence.Sequence',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldContainer',
		requires: [
			'FBEditor.view.form.desc.sequence.item.SequenceItem',
			'FBEditor.view.form.desc.sequence.SequenceController'
		],

		id: 'form-desc-sequence',
		xtype: 'form-desc-sequence',
		controller: 'form.desc.sequence',
		name: 'form-desc-plugin-fieldcontainerreplicator',

		layout: 'anchor',

		initComponent: function ()
		{
			var me = this;

			me.items=  [
				{
					xtype: 'form-desc-sequence-item'
				}
			];
			
			me.callParent(arguments);
		},

		isValid: function ()
		{
			var me = this,
				items = me.items,
				isValid = true,
				hiddenCount = 0;

			items.each(
				function (item)
				{
					if (item.isHidden())
					{
						hiddenCount++;
						isValid = true;
					}
					else if (!item.isValid())
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
				data = d || null,
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
				data = data || {};
				data.sequence = values;
			}

			return data;
		},

		/**
		 * Добавляет новые секции и устанавливает в них значения полей.
		 * @param {Object} data Данные.
		 * @param {FBEditor.ux.FieldContainerReplicator} plug Плагин, с которого начинается установка данных.
		 */
		setValues: function (data, plug)
		{
			var nextContainer = plug.getCmp(),
				plugin = plug;

			Ext.Object.each(
				data,
				function (index, item)
				{
					var field,
						putContainer;

					// переключаем контейнер секции на данные
					nextContainer.switchContainers();

					field = nextContainer.query('[name=sequence-id]')[0];
					field.setValue(item.id);
					field = nextContainer.query('[name=sequence-number]')[0];
					field.setValue(item.number ? item.number : '');
					field = nextContainer.query('[name=sequence-title-main]')[0];
					field.setValue(item.title.main);
					field = nextContainer.query('[name=sequence-title-sub]')[0];
					field.setValue(item.title.sub ? item.title.sub : '');

					if (item.title.alt)
					{
						field = nextContainer.query('[name=sequence-title-alt]')[0];
						field.fireEvent('loadData', item.title.alt);
					}

					if (item.sequence)
					{
						putContainer = plugin.putFields();
						putContainer.fireEvent('putData', item.sequence);
					}

					if (data[parseInt(index) + 1])
					{
						plugin.addFields();
						nextContainer = nextContainer.nextSibling();
						plugin = nextContainer.getPlugin('fieldcontainerreplicator');
					}
				}
			);
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
					if (val._id === item._id)
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