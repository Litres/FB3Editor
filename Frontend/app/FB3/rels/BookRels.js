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

		/**
		 * @private
		 * @property {String} Директория архива FB3, в которой находятися текущая директория _rels.
		 */
		folderName: '',

		/**
		 *
		 * @param {FBEditor.FB3.Structure} structure Структура архива FB3.
		 * @param {String} fileName Имя файла в архиве.
		 * @param {String} folderName Директория архива FB3, в которой находятися текущая директория _rels.
		 */
		constructor: function (structure, fileName, folderName)
		{
			var me = this;

			me.callParent(arguments);
			me.folderName = folderName;
		},

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
		 * Возвращает тело книги или несколько тел книги, если не передан параметр index.
		 * @param {Number} [index] Индекс тела книги в массиве.
		 * @return {FBEditor.FB3.rels.Body|FBEditor.FB3.rels.Body[]} Тело книги или массив тел книги.
		 */
		getBodies: function (index)
		{
			var me = this,
				bodies = me.bodies,
				folderName = me.folderName,
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
						var fileName = folderName + '/' + item[me.prefix + 'Target'];

						selfBodies[i] = Ext.create('FBEditor.FB3.rels.Body', me.getStructure(), fileName);
					}
				);
			}
			bodies = Ext.isNumeric(index) ? bodies[index] : bodies;

			return bodies;
		}
	}
);