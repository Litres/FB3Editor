/**
 * Элемент a.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.a.AElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.a.AElementController',
			'FBEditor.editor.command.a.CreateRangeCommand',
			'FBEditor.editor.command.a.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.a.AElementController',
		htmlTag: 'a',
		xmlTag: 'a',
		showedOnTree: false,
		defaultAttributes: {
			href: 'undefined'
		},

		getAttributesXml: function (withoutText)
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					attr += (key === 'href' && !withoutText ? 'l:' : '') + key + '="' + val + '" ';
				}
			);

			return attr;
		},

		getBlock: function ()
		{
			return this;
		}
	}
);