/**
 * Корневой элемент в описании книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.desc.AbstractRootElement',
	{
		extend: 'FBEditor.editor.element.root.RootElement',
		requires: [
			'FBEditor.editor.element.desc.AbstractRootElementController',
			'FBEditor.editor.element.desc.AbstractRootElementControllerWebkit'
		],

		controllerClass: 'FBEditor.editor.element.desc.AbstractRootElementController',
		controllerClassWebkit: 'FBEditor.editor.element.desc.AbstractRootElementControllerWebkit',

		cls: 'el-desc-root',

		/**
		 * Наобходимые аттрибуты для проверки по схеме.
		 */
		defaultAttributes: {
			'xmlns:xlink': 'http://www.w3.org/1999/xlink',
			'xmlns': 'http://www.fictionbook.org/FictionBook3/description'
		},

		/**
		 * @property {Boolean} Является ли элементом описания книги.
		 */
		isDesc: true,

		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			// корректируем аттрибут для передачи на хаб
			xml = xml.replace(/xlink:href=/g, 'href=');

			return xml;
		},

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.p = factory.createElement('p');
			els.t = factory.createElementText(' ');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);