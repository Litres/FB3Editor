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
				data,
				name,
				promise;
			
			name = me.getFileName().substring(me.rootPath.length + 1);

            data = {
                fileId: me.getId(),
                name: name,
                baseName: me.getBaseFileName(),
                rootName: me.getFileName(),
                modifiedDate: me.getDate(),
                isCover: me.getIsCover()
            };

			promise = new Promise(
				function (resolve, reject)
				{
                    me.getArrayBuffer().then(
                        function (arraybuffer)
                        {
                            data.content = arraybuffer;

                            return me.getBlob();
                        }
                    ).then(
                    	function (blob)
						{
                            data.blob = blob;
                            data.sizeBytes = blob.size;
                            data.type = blob.type;

                            return me.getUrl();
						}
					).then(
                        function (url)
                        {
                            data.url = url;

                            resolve(data);
                        }
                    );
				}
			);

			return promise;
		}
	}
);