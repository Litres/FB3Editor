/**
 * Объект папки в отображении ресурсов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.FolderResource',
	{
		extend: 'FBEditor.resource.Resource',

		/**
		 * @property {Number} Количество ресурсов в папке.
		 */
		total: 0,

		constructor: function (data)
		{
			var me = this;

			me.name = data.name;
			me.baseName = data.baseName;
			me.modifiedDate = data.modifiedDate;
			me.total = data.total;
			me.date = me.getDateFormat();
			me.extension = 'folder';
			me.isFolder = true;
			me.type = 'папка с файлами';
			me.cls = 'resource-folder-wrap';
		}
	}
);