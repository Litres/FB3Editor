/**
 * Объект ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Resource',
	{
		content: null, // содержимое файла ArrayBuffer
		url: '', // адрес в памяти браузера
		name: '', // полное имя файла относительно коренвой директории ресурсов в архиве
		baseName: '', // базовое имя файла
		rootName: '', // полное имя файла, включая корневую директории ресурсов в архиве
		modifiedDate: null, // дата изменения файла Date
		sizeBytes: null, // рамзер файла в байтах
		size: '', // отформатированный размер файла
		type: '', // mime-тип
		date: '', // отформатированная дата изменения файла
		extension: '', // разрешение файла
		width: null,
		height: null,
		isFolder: false, // папка ли
		isCover: false, // обложка ли

		/**
		 * @property {String} Формат даты.
		 */
		formatDate: 'd.m.Y H:i',

		/**
		 * Инициализирует ресурс.
		 * @param {Object} data Данные ресурса.
		 */
		constructor: function (data)
		{
			var me = this,
				img = new Image();

			me.content = data.content;
			me.url = data.url;
			me.name = data.name;
			me.baseName = data.baseName;
			me.rootName = data.rootName;
			me.modifiedDate = data.modifiedDate;
			me.sizeBytes = data.sizeBytes;
			me.type = data.type;
			me.isCover = data.isCover;
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