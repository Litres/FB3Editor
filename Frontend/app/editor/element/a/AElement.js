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
		cls: 'el-a',

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
					if (key === 'href' && withoutText)
					{
						// xmllint не может корректно проверить ссылки с &
						val = val.replace(/&/g, '');
					}

					attr += (key === 'href' && !withoutText ? 'xlink:' : '') + key + '="' + val + '" ';
					//attr += key + '="' + val + '" ';
				}
			);

			attr = attr.trim();

			return attr;
		},

		getBlock: function ()
		{
			return this;
		}
	}
);