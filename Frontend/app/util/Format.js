/**
 * Утилита для различных форматирований.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.Format',
	{
		singleton: true,

		/**
		 * @private
		 * @property {Object} Кэш форматированных размеров файла.
		 */
		cacheFileSize: {},

		translateText: {
			bytes: '',
			kb: ' КБ',
			mb: ' МБ',
			gb: ' ГБ'
		},

		/**
		 * Форматирует размер файла (xxx, xxx KБ, xxx MБ).
		 * @param {Number/String} size Размер файла в байтах.
		 * @return {String} Отформатированный размер
		 */
		fileSize: function (size)
		{
			var me = this,
				byteLimit = 1024,
				kbLimit = 1048576,
				mbLimit = 1073741824,
				out;

			if (me.cacheFileSize[size])
			{
				return me.cacheFileSize[size];
			}
			if (size < byteLimit)
			{
				out = size + me.translateText.bytes;
			}
			else if (size < 1000000)
			{
				out = (Ext.util.Format.number(size / byteLimit, '0.00')) + me.translateText.kb;
			}
			else if (size < 1000000000)
			{
				out = (Ext.util.Format.number(size / kbLimit, '0.00')) + me.translateText.mb;
			}
			else
			{
				out = (Ext.util.Format.number(size / mbLimit, '0.00')) + me.translateText.gb;
			}
			me.cacheFileSize[size] = out;

			return out;
		}
	}
);