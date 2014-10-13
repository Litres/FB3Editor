/**
 * Типы данных.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.ContentTypes',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		getRels: function ()
		{
			return null;
		},

		/**
		 * Возвращает типы данных в виде json.
		 * @return {Object} Типы данных.
		 */
		getContent: function ()
		{
			var me = this;

			return me.getJson().Types;
		}
	}
);