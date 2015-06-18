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

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.t = FBEditor.editor.Factory.createElementText('текст');
			me.add(els.t);

			return els;
		}
	}
);