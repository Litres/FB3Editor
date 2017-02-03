/**
 * Внешний ресурс.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.ExternalResource',
	{
		extend: 'FBEditor.resource.Resource',

		load: function ()
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
					if (me.blob)
					{
						// данные уже загружены
						resolve();
					}
					
					// формируем запрос
					Ext.Ajax.request(
						{
							url: me.url,
							binary: true,
							scope: me,
							success: function(response)
							{
								var statusOK = 200;

								//console.log('response', response);

								if (response.status === statusOK)
								{
									// обновляем данные
									me.updateBytes(response.responseBytes);
									
									resolve();
								}
								else
								{
									reject(response);
								}
							},
							failure: function (response)
							{
								reject(response);
							}
						}
					);
				}
			);

			return promise;
		},

		/**
		 * @private
		 * Обновляет данные ресурса.
		 * @param {ArrayBuffer} bytes Двоичное содержимое ресурса.
		 */
		updateBytes: function (bytes)
		{
			var me = this,
				img = new Image();
			
			me.content = bytes;
			me.blob = new Blob([bytes], {type: me.type});
			me.url = window.URL.createObjectURL(me.blob);
			me.sizeBytes = me.blob.size;
			img.src = me.url;
			img.onload = function ()
			{
				me.width = img.width;
				me.height = img.height;
			};
		}
	}
);