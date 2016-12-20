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
				name,
				data;
			
			name = me.getFileName().substring(me.rootPath.length);

			data = {
				fileId: me.getId(),
				content: me.getArrayBuffer(),
				url: me.getUrl(),
				name: name,
				baseName: me.getBaseFileName(),
				rootName: me.getFileName(),
				modifiedDate: me.getDate(),
				sizeBytes: me.getSize(),
				type: me.getType(),
				isCover: me.getIsCover()
			};

			return data;
		}
	}
);