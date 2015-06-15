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
		attributes: {
			'xmlns:l': 'http://www.w3.org/1999/xlink',
			'xmlns': 'http://www.fictionbook.org/FictionBook3/body',
			'xmlns:fb3d': 'http://www.fictionbook.org/FictionBook3/description'
		},
		cls: 'el-body',

		constructor: function (attributes, children)
		{
			var me = this;

			me.elementId = Ext.id({prefix: me.prefixId});
			me.mixins.observable.constructor.call(me, {});
			me.children = children || me.children;
			Ext.Array.each(
				me.children,
				function (item)
				{
					item.parent = me;
				}
			);
			me.attributes = Ext.apply(attributes, me.attributes);
			me.permit = me.permit ? Ext.applyIf(me.permit, me.permitDefault) : me.permitDefault;
			me.createController();
		},

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
				els = {};

			els.section = FBEditor.editor.Factory.createElement('section');
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Текст книги');
			els.p.add(els.t);
			els.section.add(els.p);
			me.add(els.section);

			return els;
		}
	}
);