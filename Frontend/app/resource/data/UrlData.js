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
		 * @property {Array} Корневая директория ресурсов, полученных с хаба.
		 */
		rootPathUrl: ['/fb3/img/', 'img/'],

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
				rootPathUrl = me.rootPathUrl,
				name = fileName,
				fileType,
				baseName,
				url,
				blob,
				data;

			// вырезаем корневую диреткорию из имени файла
			Ext.Array.each(
				rootPathUrl,
			    function (path)
			    {
				    var reg;

				    reg = new RegExp('^' + path, 'i');

				    if (reg.test(fileName))
				    {
					    name = fileName.replace(reg, '');
					    return false;
				    }
				    //name = fileName.substring(path + 1);
			    }
			);

			fileType = me.getMimeType(fileName);
			blob = me.getBlob(content, fileType);
			url = window.URL.createObjectURL(blob);
			baseName = me.getBaseFileName(fileName);

			data = {
				blob: blob,
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