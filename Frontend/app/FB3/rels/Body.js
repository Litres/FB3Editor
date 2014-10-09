/**
 * Тело книга в архиве FB3.
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
				//rels = Ext.create('FBEditor.FB3.rels.BodyRels', me.getStructure(), relsName);
			}

			return rels;
		},

		/**
		 * Возвращает xml тела книги.
		 * @returns {String} Строка xml.
		 */
		getContent: function ()
		{
			var me = this;

			return me.getText();
		}
	}
);