/**
 * Корневой элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.fb3body.Fb3bodyElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.fb3body.Fb3bodyElementController'
		],
		controllerClass: 'FBEditor.editor.element.fb3body.Fb3bodyElementController',
		htmlTag: 'main',
		xmlTag: 'fb3-body',
		defaultAttributes: {
			'xmlns:l': 'http://www.w3.org/1999/xlink',
			'xmlns': 'http://www.fictionbook.org/FictionBook3/body',
			'xmlns:fb3d': 'http://www.fictionbook.org/FictionBook3/description'
		},
		cls: 'el-body',

		/**
		 * @property {Boolean} Признан корневого элемента.
		 */
		isRoot: true,

		setAttributesHtml: function (element)
		{
			var me = this,
				el = element;

			el = me.callParent(arguments);
			el.setAttribute('contentEditable', true);

			return el;
		},

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.title = factory.createElement('title');
			els = Ext.apply(els, els.title.createScaffold());
			me.add(els.title);

			els.section = factory.createElement('section');
			els.p = factory.createElement('p');
			els.t = factory.createElementText('Текст книги');
			els.p.add(els.t);
			els.section.add(els.p);
			me.add(els.section);

			return els;
		}
	}
);