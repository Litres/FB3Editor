/**
 * Обложка архива FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Thumb',
	{
		extend: 'FBEditor.FB3.rels.Image',

		isCover: true,

		getRels: function ()
		{
            return Promise.resolve(null);
		}
	}
);