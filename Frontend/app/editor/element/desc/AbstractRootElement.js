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
			'FBEditor.editor.element.desc.AbstractRootElementController'
		],

		controllerClass: 'FBEditor.editor.element.desc.AbstractRootElementController',

		cls: 'el-desc-root',

		/**
		 * Наобходимые аттрибуты для проверки по схеме.
		 */
		defaultAttributes: {
			'xmlns:l': 'http://www.w3.org/1999/xlink',
			'xmlns': 'http://www.fictionbook.org/FictionBook3/description'
		},

		/**
		 * @property {Boolean} Является ли элементом описания книги.
		 */
		isDesc: true,

		getXml: function ()
		{
			var me = this,
				xml;

			xml = me.callParent(arguments);

			if (me.first().isEmpty())
			{
				// первым элементом не может быть br согласно схеме
				xml = xml.replace(/<br\/>/, '<p>&#160;</p>');
			}

			// пустой ли элемент
			//xml = me.isEmpty() ? xml.replace('<br/>', '') : xml;

			return xml;
		},

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.p = factory.createElement('p');
			els.br = factory.createElement('br');
			els.p.add(els.br);
			me.add(els.p);

			return els;
		}
	}
);