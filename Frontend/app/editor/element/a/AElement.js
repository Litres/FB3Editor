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
		},

		getBlock: function ()
		{
			return this;
		},

		getData: function ()
		{
			var me = this,
				resData = {},
				data;

			data = me.callParent(arguments);
			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					resData[key] = val ? val : '';
				}
			);
			data = Ext.apply(data, resData);

			return data;
		},

		update: function (data)
		{
			var me = this;

			// аттрибуты
			me.attributes = {
				href: ''
			};
			Ext.Object.each(
				data,
				function (key, val)
				{
					if (val)
					{
						me.attributes[key] = val;
					}
				}
			);

			// отображение
			me.callParent(arguments);
		}
	}
);