/**
 * Элемент a.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.a.AElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'a',
		xmlTag: 'a',

		getAttributesXml: function ()
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					attr += (key === 'href' ? 'l:' : '') + key + '="' + val + '" ';
				}
			);

			return attr;
		}
	}
);