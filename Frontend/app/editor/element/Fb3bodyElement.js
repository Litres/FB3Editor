/**
 * Корневой элемент.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.Fb3bodyElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',

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
		},

		setEvents: function (element)
		{
			var me = this;

			element = me.callParent(arguments);

			// редактирование текстового узла
			element.addEventListener(
				'DOMCharacterDataModified',
				function (e)
				{
					var node = e.target,
						text = node.nodeValue,
						viewportId = node.viewportId,
						nextSibling = node.nextSibling,
						previousSibling = node.previousSibling,
						parentNode = node.parentNode,
						parentEl,
						el;

					console.log('DOMCharacterDataModified:', e, me);
					if (!nextSibling && !previousSibling)
					{
						el = FBEditor.editor.Factory.createElementText(text);
						el.createNode(viewportId);
						parentEl = parentNode.getElement();
						//console.log('el', el);
						parentEl.removeAll();
						parentEl.add(el);
						parentEl.sync(viewportId);
						//FBEditor.editor.Manager.setFocusElement(el);
					}
					else
					{
						el = node.getElement();
						el.setText(text);
						el.sync(viewportId);
						//FBEditor.editor.Manager.setFocusElement(el);
					}
				},
				false
			);

			return element;
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