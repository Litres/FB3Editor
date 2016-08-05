/**
 * Объект данных ресурса из Url.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.UrlData',
	{
		extend : 'FBEditor.resource.data.AbstractData',

		/**
		 * @property {String} Корневая директория ресурсов, полученных с хаба.
		 */
		rootPathUrl: 'img',

		/**
		 * @param {Object} fileData Данные файла.
		 * @param {ArrayBuffer} fileData.content Бинарное содержимое файла.
		 * @param {String} fileData.name Имя файла.
		 */
		constructor: function (fileData)
		{
			var me = this;

			me.fileData = fileData;
		},

		getData: function ()
		{
			var me = this,
				fileName = me.fileData.fileName,
				fileId = me.fileData.fileId,
				content = me.fileData.content,
				isCover = me.fileData.isCover,
				fileType,
				baseName,
				name,
				url,
				blob,
				data;

			name = fileName.substring(me.rootPathUrl.length + 1);
			fileType = me.getMimeType(fileName);
			blob = new Blob([content], {type: fileType});
			url = window.URL.createObjectURL(blob);
			baseName = me.getBaseFileName(fileName);

			data = {
				content: content,
				url: url,
				fileId: fileId,
				name: name,
				baseName: baseName,
				rootName: me.rootPath + '/' + name,
				sizeBytes: blob.size,
				type: fileType,
				isCover: isCover
			};

			return data;
		}
	}
);