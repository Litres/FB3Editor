/**
 * Кнотроллер элемента subscription.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.subscription.SubscriptionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				nameElements,
				name;

			name = me.getNameElement();
			nodes.first = nodes.parent.firstChild;
			els.parent = nodes.parent.getElement();
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			nameElements.push(name);

			return nameElements;
		}
	}
);