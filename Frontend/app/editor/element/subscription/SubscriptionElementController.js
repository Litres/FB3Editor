/**
 * Кнотроллер элемента subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.subscription.SubscriptionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var els = {},
				nodes = {},
				range;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.commonAncestorContainer;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			while (els.parent.isStyleHolder || els.parent.isStyleType)
			{
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
			}

			return nodes.node;
		},

		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				nameElements,
				name;

			name = me.getNameElement();
			els.parent = nodes.parent.getElement();
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			nameElements.push(name);

			return nameElements;
		}
	}
);