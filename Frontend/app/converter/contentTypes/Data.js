/**
 * Конвертер данных mime-типов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.converter.contentTypes.Data',
	{
		extend: 'FBEditor.converter.AbstractConverter',
		singleton: true,

		/**
		 * Нормализует данные.
		 * @param {Object} data Исходные данные.
		 * @return {Object} Нормализованные данные.
		 */
		toNormalize: function (data)
		{
			var me = this,
				d;

			d = me.normalize(data);

			return d;
		}
	}
);