/**
 * Объект обложки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.cover.Cover',
	{
		content: null, // содержимое файла ArrayBuffer
		url: '', // адрес в памяти браузера
		name: '', // имя файла
		baseName: '', // базовое имя файла
		rootName: '', // полное имя файла
		modifiedDate: null, // дата изменения файла Date
		sizeBytes: null, // рамзер файла в байтах
		size: '', // отформатированный размер файла
		type: '', // mime-тип
		date: '', // отформатированная дата изменения файла
		extension: '', // разрешение файла
		width: null,
		height: null,

		/**
		 * @property {String} Формат даты.
		 */
		formatDate: 'd.m.Y H:i',

		/**
		 * Инициализирует обложку.
		 * @param {Object} data Данные обложки.
		 */
		constructor: function (data)
		{
			var me = this,
				img = new Image();

			me.content = data.content;
			me.url = data.url;
			me.name = data.name ? data.name : data.baseName;
			me.baseName = data.baseName;
			me.rootName = data.rootName;
			me.modifiedDate = data.modifiedDate;
			me.sizeBytes = data.sizeBytes;
			me.type = data.type;
			me.size = me.getSizeFormat();
			me.date = me.getDateFormat();
			me.extension = me.getExtension();
			img.src = me.url;
			img.onload = function ()
			{
				me.width = img.width;
				me.height = img.height;
			};
		},

		/**
		 * Возвращает отформатированный размер файла.
		 * @return {String} Размер файла.
		 */
		getSizeFormat: function ()
		{
			var me = this,
				size;

			size = FBEditor.util.Format.fileSize(me.sizeBytes);

			return size;
		},

		/**
		 * Возвращает отформатированную дату.
		 * @return {String} Дата.
		 */
		getDateFormat: function ()
		{
			var me = this,
				date;

			date = Ext.Date.format(me.modifiedDate, me.formatDate);

			return date;
		},

		/**
		 * Возвращает расширение файла.
		 * @return {String} Имя файла.
		 */
		getExtension: function ()
		{
			var me = this,
				fileName = me.baseName,
				ext;

			ext = fileName.replace(/.*?\.(\w+)$/, '$1');

			return ext;
		}
	}
);