/**
 * Абстрактный класс конвертера данных.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.converter.AbstractConverter',
	{
		/**
		 * Нормализует данные полученные из книги.
		 * Нормализация подразумевает удаление начальных префиксов у всех свойств и
		 * удаление ненужных свойств.
		 * @param {Object} data Данные, полученные из книги.
		 * @return {Object} Нормализованные данные.
		 */
		normalize: function (data)
		{
			var me= this,
				prefix = FBEditor.util.xml.Json.prefix,
				d;

			delete data[prefix + 'id'];
			delete data[prefix + 'version'];
			delete data[prefix + 'xmlns'];
			d = me._normalize(data);

			return d;
		},

		/**
		 * @private
		 * Удаляет начальные префиксы у всех свойств.
		 * @param {Object} data
		 * @return {Object|String}
		 */
		_normalize: function (data)
		{
			var me= this,
				prefix = FBEditor.util.xml.Json.prefix,
				d = {},
				reg;

			reg = new RegExp('^(' + prefix + ')+');
			Ext.Object.each(
				data,
				function (key, item)
				{
					var k;

					k = key.replace(reg, '');
					if (Ext.isObject(item) || Ext.isArray(item))
					{
						d[k] = me._normalize(item);
					}
					else if (k !== 'toString')
					{
						d[k] = item;
					}
				}
			);

			return d;
		}
	}
);