/**
 * Связи книги в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.BookRels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		defaultContent: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
			'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://www.fictionbook.org/FictionBook3/relationships/body" ' +
		                'Target="body.xml"/>' +
            '</Relationships>',

		/**
		 * @private
		 * @property {FBEditor.FB3.rels.Body[]} Содержимое книги (может быть подшивкой из нескольких книг).
		 */
		bodies: null,

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				json;

			if (!rels)
			{
				json = me.getJson();
				rels = json.Relationships.Relationship;
				rels = Ext.isArray(rels) ? rels : [rels];
				rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);
			}

			return rels;
		},

		/**
		 * Возвращает несколько тел книги.
		 * @return {FBEditor.FB3.rels.Body[]} Массив тел книги.
		 */
		getBodies: function ()
		{
			var me = this,
				bodies = me.bodies,
				parentRelsDir = me.getParentRelsDir(),
				rels;

			if (!bodies)
			{
				rels = me.getRels();
				bodies = rels[FBEditor.FB3.rels.RelType.body];
				bodies = Ext.isArray(bodies) ? bodies : [bodies];
				Ext.each(
					bodies,
					function (item, i, selfBodies)
					{
						var targetName = item[me.prefix + 'Target'],
							fileName;

						// путь может быть абсолютным или относительным
						fileName = targetName.substring(0, 1) !== '/' ?
						           parentRelsDir + '/' + targetName : targetName.substring(1);

						selfBodies[i] = Ext.create('FBEditor.FB3.rels.Body', me.getStructure(), fileName);
					}
				);
			}

			return bodies;
		}
	}
);