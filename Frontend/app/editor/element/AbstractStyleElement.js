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
		 * @property {Boolean} Элемент ли форматирования.
		 * Это элементы, которые содержатся в абзаце и форматируют текст. 
		 * Строго наследуют от базового класса FBEditor.editor.element.AbstractStyleElement.
		 * @example 
		 * strong, em, spacing... 
		 */
		isStyleFormat: true,

		/**
		 * @property {Boolean} Стилевой ли элемент.
		 * Это элементы форматирования, которые могут находиться в абзаце, включая сам абзац и перенос строки br.
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