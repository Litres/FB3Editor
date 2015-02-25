/**
 * Изображение архива FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Image',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		/**
		 * @property {Boolean} Обложка ли.
		 */
		isCover: false,

		getRels: function ()
		{
			return null;
		},

		/**
		 * Обложка ли.
		 * @return {Boolean}
		 */
		getIsCover: function ()
		{
			return this.isCover;
		}
	}
);