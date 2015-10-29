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
				json;

			if (!rels)
			{
				json = me.getJson();
				rels = json.Relationships.Relationship || null;
				if (rels)
				{
					rels = Ext.isArray(rels) ? rels : [rels];
					rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);
				}
			}

			return rels;
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
				rels = me.getRels();

			if (!images && rels)
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
						           parentRelsDir + '/' + targetName : targetName.substring(1);

						selfImages[i] = Ext.create('FBEditor.FB3.rels.Image', me.getStructure(), fileName);
						selfImages[i].setId(id);
					}
				);
			}

			return images;
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
					var rel = '<Relationship Id="{%s}" ' +
					          'Type="http://www.fictionbook.org/FictionBook3/relationships/image" Target="img/{%s}"/>';

					rel = rel.replace(/{%s}/g, item.name);
					xml += rel;
				}
			);
			xml += '</Relationships>';
			me.setFileContent(xml);
		}

	}
);