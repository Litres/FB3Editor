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
		 * Преобразует данные для заполнения формы.
		 * @param {Object} data Данные, полученные из книги.
		 * @return {Object} Преобразованные данные.
		 */
		toForm: function (data)
		{
			throw Error('Не реализован метод converter.AbstractConverter#toForm');
		},

		/**
		 * Нормализует данные полученные из книги.
		 * Нормализация подразумевает удаление начальных подчеркиваний у всех свойств и
		 * удаление ненужных свойств.
		 * @param {Object} data Данные, полученные из книги.
		 * @return {Object} Нормализованные данные.
		 */
		normalize: function (data)
		{
			var me= this,
				d;

			delete data._id;
			delete data._version;
			delete data._xmlns;
			d = me._normalize(data);

			return d;
		},

		/**
		 * @private
		 * Удаляет начальные подчеркивания у всех свойств.
		 * @param {Object} data
		 * @return {Object|String}
		 */
		_normalize: function (data)
		{
			var me= this,
				d = {};

			Ext.Object.each(
				data,
				function (key, item)
				{
					var k;

					k = key.replace(/^(_)+/, '');
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