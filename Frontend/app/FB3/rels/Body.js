/**
 * Тело книги в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Body',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				relsName = me.getRelsName(),
				parentDir = me.getParentDir();

			if (!rels)
			{
				rels = Ext.create('FBEditor.FB3.rels.BodyRels', me.getStructure(), relsName, parentDir);
			}

			return rels;
		},

		/**
		 * Возвращает xml тела книги.
		 * @return {String} Строка xml.
		 */
		getContent: function ()
		{
			var me = this;

			return me.getText();
		}
	}
);