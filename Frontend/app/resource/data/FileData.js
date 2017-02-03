/**
 * Объект данных ресурса из файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.FileData',
	{
		extend : 'FBEditor.resource.data.AbstractData',

		/**
		 * @private
		 * @property {Object} Данные файла.
		 */
		fileData: null,

		/**
		 * @param {Object} fileData Данные файла.
		 * @param {ArrayBuffer} fileData.content Бинарное содержимое файла.
		 * @param {Object} fileData.file Данные.
		 */
		constructor: function (fileData)
		{
			var me = this;

			me.fileData = fileData;
		},

		getData: function ()
		{
			var me = this,
				file = me.fileData.file,
				content = me.fileData.content,
				manager = FBEditor.resource.Manager,
				activeFolder,
				name,
				url,
				blob,
				data;

			activeFolder = manager.getActiveFolder();
			name = activeFolder + (activeFolder ? '/' : '') + file.name;
			blob = me.getBlob(content, file.type);
			file.size = file.size || blob.size;
			url = window.URL.createObjectURL(blob);

			data = {
				blob: blob,
				content: content,
				url: url,
				name: name,
				baseName: file.name,
				rootName: me.rootPath + '/' + name,
				modifiedDate: file.lastModifiedDate,
				sizeBytes: file.size,
				type: file.type
			};

			return data;
		}
	}
);