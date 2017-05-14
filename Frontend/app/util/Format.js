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
		 * Возвращает размер строки в байтах.
		 * @param {String} str Строка.
		 * @return {Number} Количество байтов.
		 */
		byteLength: function (str)
		{
			return unescape(encodeURIComponent(str)).length;
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
		},

		/**
		 * Возвращает расширение файла из его имени.
		 * @param {String} name Имя.
		 * @return {String} Расширение.
		 */
		getExtensionFile: function (name)
		{
			var ext = '';

			if (/.*?\.(\w+)(\?.*?)?$/.test(name))
			{
				ext = name.replace(/.*?\.(\w+)(\?.*?)?$/, '$1');
			}

			return ext;
		},

		/**
		 * Парсит mime-тип и возвращает расширение.
		 * @param {String} type Mime-тип.
		 * @return {String} расширение.
		 */
		getExtensionMime: function (type)
		{
			var ext = '';

			ext = type === 'image/svg+xml' ? 'svg' : ext;
			ext = type === 'image/png' ? 'png' : ext;
			ext = type === 'image/jpeg' ? 'jpeg' : ext;
			ext = type === 'image/gif' ? 'gif' : ext;

			return ext;
		},

		/**
		 * Парсит имя и возвращает mime-тип.
		 * @param {String} name Имя.
		 * @return {String} Mime-тип.
		 */
		getMimeType: function (name)
		{
			var type = '';

			type = /\.svg$/.test(name) ? 'image/svg+xml' : type;
			type = /\.png$/.test(name) ? 'image/png' : type;
			type = /\.(jpg|jpeg)$/.test(name) ? 'image/jpeg' : type;
			type = /\.gif$/.test(name) ? 'image/gif' : type;

			return type;
		},

		/**
		 * Преобразует шестадцетиричную строку в двоичный массив данных.
		 * @param {String} hex Данные в шестнадцетеричном формате.
		 * @return {Uint8Array} Двоичные данные.
		 */
		hexToBytes: function (hex)
		{
			var bytes = [];

			bytes = new Uint8Array(hex.length / 2);
			
			Ext.each(
				bytes,
			    function (item, index)
			    {
				    bytes[index] = parseInt(hex.substr(index * 2, 2), 16);
			    }
			);
			
			return bytes;
		},

		/**
		 * Переводит пиксели в миллиметры.
		 * @param {Number} num Количество пикселей.
		 * @param {Number} [dpi=72] Разрешение на дюйм.
		 */
		pixelsToMillimeters: function (num, dpi)
		{
			var i2mm = 25.4, // в 1 дюйме 25,4 мм
				mm;

			dpi = dpi || 72;
			num = Number(num);
			mm = num * i2mm / dpi;
			
			return mm
		}
	}
);