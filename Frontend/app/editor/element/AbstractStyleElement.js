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
		}
	}
);