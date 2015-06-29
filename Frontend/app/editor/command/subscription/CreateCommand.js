/**
 * Создает подпись.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subscription.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'subscription',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData();

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.last = nodes.parent.lastChild;
			els.last = nodes.last ? nodes.last.getElement() : null;

			// создаем элемент
			els.node = FBEditor.editor.Factory.createElement(me.elementName);
			els = Ext.apply(els, els.node.createScaffold());
			nodes.node = els.node.getNode(data.viewportId);

			if (els.last && els.last.isSubscription)
			{
				// подпись уже существует
				throw Error('Subscription exists');
			}

			// добавляем в конец
			els.parent.add(els.node);
			nodes.parent.appendChild(nodes.node);
		}
	}
);