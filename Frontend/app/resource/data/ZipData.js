/**
 * Объект данных ресурса из архива.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.ZipData',
	{
		extend : 'FBEditor.resource.data.AbstractData',

		getData: function ()
		{
			var me = this,
				fileType = me.getType(),
				content = me.getArrayBuffer(),
				blob,
				name,
				data;
			
			name = me.getFileName().substring(me.rootPath.length + 1);
			blob = me.getBlob(content, fileType);

			data = {
				blob: blob,
				fileId: me.getId(),
				content: content,
				url: me.getUrl(),
				name: name,
				baseName: me.getBaseFileName(),
				rootName: me.getFileName(),
				modifiedDate: me.getDate(),
				sizeBytes: me.getSize(),
				type: fileType,
				isCover: me.getIsCover()
			};

			return data;
		}
	}
);