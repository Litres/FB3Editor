/**
 * Связи для ресурсов тела книги, находящихся в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.BodyRels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		defaultContent: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
			'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>',

		/**
		 * @private
		 * @property {FBEditor.FB3.rels.Image[]} Изображения книги.
		 */
		images: null,

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				promise;

			if (!rels)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getJson().then(
                        	function (json)
							{
                                rels = json.Relationships.Relationship || null;

                                if (rels)
                                {
                                    rels = Ext.isArray(rels) ? rels : [rels];
                                    rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);
                                }

                                me.rels = rels;

                                resolve(rels);
							}
						);
					}
				);
			}
			else
			{
				promise = Promise.resolve(rels);
			}

			return promise;
		},

		/**
		 * Возвращает изображения для тела книги.
		 * @return {FBEditor.FB3.rels.Image[]} Изображения.
		 */
		getImages: function ()
		{
			var me = this,
				images = me.images,
				parentRelsDir = me.getParentRelsDir(),
				promise;

			if (!images)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getRels().then(
                            function (rels)
                            {
                                if (rels)
                                {
                                    images = rels[FBEditor.FB3.rels.RelType.image];
                                    images = Ext.isArray(images) ? images : [images];

                                    Ext.each(
                                        images,
                                        function (item, i, selfImages)
                                        {
                                            var id = item[me.prefix + 'Id'],
                                                targetName = item[me.prefix + 'Target'],
                                                fileName;

                                            // путь может быть абсолютным или относительным
                                            fileName = targetName.substring(0, 1) !== '/' ?
                                                parentRelsDir + '/' + targetName : targetName;

                                            selfImages[i] = Ext.create('FBEditor.FB3.rels.Image', me.getStructure(),
												fileName);
                                            selfImages[i].setId(decodeURI(id));
                                        }
                                    );

                                    me.images = images;

                                    resolve(images);
                                }
                                else
                                {
                                    resolve(null);
                                }
                            }
                        );
					}
				);
			}
			else if (images)
			{
				promise = Promise.resolve(images);
			}

			return promise;
		},

		/**
		 * Устанавливает содержимое xml-файла.
		 * @param {FBEditor.resource.Resource[]} data Ресурсы.
		 */
		setContent: function (data)
		{
			var me = this,
				xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
				      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';

			Ext.each(
				data,
				function (item)
				{
					var rel = '<Relationship Id="{%id}" ' +
					          'Type="http://www.fictionbook.org/FictionBook3/relationships/image"' +
					          ' Target="{%target}"/>';

					// кодируем кириллицу
					item.fileId = encodeURI(item.fileId);
					item.rootName = encodeURI(item.rootName);

					rel = rel.replace(/{%id}/ig, item.fileId);
					rel = rel.replace(/{%target}/ig, item.rootName);
					xml += rel;
				}
			);

			//console.log('xml', xml);
			
			xml += '</Relationships>';
			me.setFileContent(xml);
		}

	}
);