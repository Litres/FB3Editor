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

								if (response.status === statusOK)
								{
									// обновляем данные
									me.updateData(response);

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
		 * @param {Object} response Данные, полученные в ответе на запрос.
		 */
		updateData: function (response)
		{
			var me = this,
				img = new Image(),
				bytes = response.responseBytes,
				type = me.type,
				ext;

			if (!type)
			{
				// если расширение загружаемого ресурса не было известно до загрузки, то обновляем его

				type = response.getResponseHeader('content-type');
				me.type = type;
				ext = FBEditor.util.Format.getExtensionMime(type);

				if (ext)
				{
					ext = '.' + ext;
					me.name += ext;
					me.baseName += ext;
					me.rootName += ext;
				}
			}

			me.content = bytes;
			me.blob = new Blob([bytes], {type: type});
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