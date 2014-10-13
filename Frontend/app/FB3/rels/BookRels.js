/**
 * Связи книги в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.BookRels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

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
						var fileName = parentRelsDir + '/' + item[me.prefix + 'Target'];

						selfBodies[i] = Ext.create('FBEditor.FB3.rels.Body', me.getStructure(), fileName);
					}
				);
			}

			return bodies;
		}
	}
);