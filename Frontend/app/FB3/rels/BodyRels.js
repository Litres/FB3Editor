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
						var fileName = parentRelsDir + '/' + item[me.prefix + 'Target'];

						selfImages[i] = Ext.create('FBEditor.FB3.rels.Image', me.getStructure(), fileName);
					}
				);
			}

			return images;
		}

	}
);