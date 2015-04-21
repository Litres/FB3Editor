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

			me.children = children || me.children;
			me.attributes = Ext.apply(attributes, me.attributes);
			me.createController();
		},

		setAttributesHtml: function (element)
		{
			var me = this,
				el = element;

			el = me.callParent(arguments);
			el.setAttribute('contentEditable', true);

			return el;
		}
	}
);