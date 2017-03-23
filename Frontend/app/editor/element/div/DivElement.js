/**
 * Элемент div.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.div.DivElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.div.SplitCommand',
			'FBEditor.editor.command.div.CreateCommand',
			'FBEditor.editor.command.div.CreateRangeCommand',
			'FBEditor.editor.element.div.DivElementController'
		],
		controllerClass: 'FBEditor.editor.element.div.DivElementController',
		htmlTag: 'div',
		xmlTag: 'div',
		cls: 'el-div',
		splittable: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Блок');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		},

		getAttributesXml: function (withoutText)
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
					if (key !== 'marker')
					{
						attr += key + '="' + val + '" ';
					}
				}
			);

			return attr.trim();
		},

		setStyleHtml: function ()
		{
			var me = this,
				attributes = me.attributes,
				//widthFloatDefault = '10em',
				width,
				style;

			style = me.callParent();
			style += style ? ' ' : '';
			style += attributes['min-width'] ? 'min-width: ' + attributes['min-width'] + '; ' : '';
			style += attributes['max-width'] ? 'max-width: ' + attributes['max-width'] + '; ' : '';

			// обтекание
			style += attributes.float ? 'float: ' + attributes.float + '; ' : '';

			// выравнивание внутри блока
			style += attributes.align ? 'text-align: ' + attributes.align + '; ' : '';

			// ширина
			width = attributes.width ? attributes['width'] : false;
			//width = attributes['float'] && !width ? widthFloatDefault : width;
			style += width ? 'width: ' + width + '; ' : '';

			me.style = style;

			return style;
		},

		initCls: function ()
		{
			var me = this,
				attributes = me.attributes,
				cls;

			cls = attributes.align ? ' el-div-align-' + attributes.align : '';
			cls = 'el-div' + cls;
			me.cls = cls;
		}
	}
);