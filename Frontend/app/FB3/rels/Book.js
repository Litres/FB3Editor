/**
 * Книга в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Book',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		/**
		 * @private
		 * @property {Object} Описание книги.
		 */
		desc: null,

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
			me.desc = me.getDesc();
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				fileName = me.getFileName(),
				folderName,
				descName,
				relsName;

			if (!rels)
			{
				fileName = fileName.split('/');
				descName = fileName.pop();
				folderName = fileName.join('/');
				relsName = folderName + '/_rels/' + descName + '.rels';
				rels = Ext.create('FBEditor.FB3.rels.BookRels', me.getStructure(), relsName, folderName);
			}

			return rels;
		},

		/**
		 * Возвращает описание книги.
		 * @return {Object}
		 */
		getDesc: function ()
		{
			var me = this,
				desc = me.desc || me.getJson()['fb3-description'];

			return desc;
		}
	}
);