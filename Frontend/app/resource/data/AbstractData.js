/**
 * Абстрактный объект данных ресурса для загрузки в редактор.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.AbstractData',
	{
		/**
		 * @property {String} Корневая директория ресурсов в архиве.
		 */
		rootPath: '/fb3/img',

		/**
		 * @abstract
		 * Вовзращает данные ресурса необходимые для создания объекта ресурса.
		 */
		getData: function ()
		{
			throw Error('Нереализован метод FBEditor.resource.data.AbstractData#getData()');
		},

		/**
		 * Парсит название файла и возвращает mime-тип.
		 * @param {String} fileName Имя файла.
		 * @return {String} Mime-тип.
		 */
		getMimeType: function (fileName)
		{
			return FBEditor.util.Format.getMimeType(fileName);
		},

		/**
		 * Возвращает базовое имя файла без полного пути.
		 * @param {String} fileName Имя файла.
		 * @return {String} Имя файла.
		 */
		getBaseFileName: function (fileName)
		{
			var name;

			name = fileName.replace(/.*\/(.*?\.\w+)$/, '$1');

			return name;
		},

		/**
		 * Возвращает ресурс в виде Blob.
		 * @param {ArrayBuffer|ArrayBuffer[]} content Содержимое файла.
		 * @param {String} fileType Тип файла.
		 * @return {Blob}
		 */
		getBlob: function (content, fileType)
		{
			var blob;

			content = Ext.isArray(content) ? content : [content];
			blob = new Blob(content, {type: fileType});
			
			return blob;
		}
	}
);