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
			'FBEditor.editor.command.a.CreateRangeCommand'
		],
		controllerClass: 'FBEditor.editor.element.a.AElementController',
		htmlTag: 'a',
		xmlTag: 'a',
		showedOnTree: false,
		_attributes: {
			href: ''
		},

		constructor: function (attributes, children)
		{
			var me = this;

			me.callParent(arguments);
			me.attributes = Ext.applyIf(attributes, me._attributes);
		},

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