/**
 * Корневой элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.Fb3bodyElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

		htmlTag: 'body',
		xmlTag: 'fb3-body',
		attributes: {
			'xmlns:l': 'http://www.w3.org/1999/xlink',
			'xmlns': 'http://www.fictionbook.org/FictionBook3/body',
			'xmlns:fb3d': 'http://www.fictionbook.org/FictionBook3/description'
		},

		constructor: function (attributes, children)
		{
			var me = this;

			me.children = children || me.children;
			me.attributes = Ext.apply(attributes, me.attributes);
		}
	}
);