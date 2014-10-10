/**
 * Мета-информация о содержимом в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Meta',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		getRels: function ()
		{
			return null;
		},

		/**
		 * Возвращает мета-информацию в виде json.
		 * @return {Object} Мета-информация.
		 */
		getContent: function ()
		{
			var me = this;

			return me.getJson().coreProperties;
		}
	}
);