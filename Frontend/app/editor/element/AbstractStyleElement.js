/**
 * Абстрактный класс элементов форматирования текста.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.AbstractStyleElementController'
		],

		controllerClass: 'FBEditor.editor.element.AbstractStyleElementController',

		showedOnTree: false,

		/**
		 * @property {Boolean} Стилевой ли элемент.
		 */
		isStyleType: true,

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.t = factory.createElementText('текст');
			me.add(els.t);

			return els;
		},

		getFormatOptionsXml: function ()
		{
			var me = this,
				parent = me.parent,
				existTextSibling = false,
				existTextChild = false,
				formatOptions;

			formatOptions = me.callParent(arguments);

			if (parent && parent.children)
			{
				// определяем существование текстового сиблинга
				Ext.Array.each(
					parent.children,
					function (sibling)
					{
						if (sibling.isText)
						{
							existTextSibling = true;
							return true;
						}
					}
				);
			}


			// определяем существование текстового потомка
			Ext.Array.each(
				me.children,
				function (child)
				{
					if (child.isText)
					{
						existTextChild = true;
						return true;
					}
				}
			);

			formatOptions.spacesBefore = formatOptions.spacesBefore && !existTextSibling ?
			                             formatOptions.spacesBefore : '';
			formatOptions.spacesAfter = formatOptions.spacesAfter && !existTextChild ?
			                            formatOptions.spacesAfter : '';

			formatOptions.nlBefore = existTextChild ? '' : formatOptions.nlBefore;
			formatOptions.nlAfter = existTextSibling ? '' : formatOptions.nlAfter;

			return formatOptions;
		}
	}
);