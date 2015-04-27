/**
 * Кнотроллер элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * Создает новый заголовок.
		 */
		onCreateElement: function ()
		{
			var me = this,
				title = me.getElement(),
				els = {},
				sel,
				range,
				node,
				newNode,
				parent,
				next,
				parentEl,
				viewportId;

			sel = FBEditor.editor.Manager.getSelection();
			if (sel)
			{
				range = sel.getRangeAt(0);
				node = range.endContainer.parentNode;
				node = node.parentNode.nodeName === 'HEADER' ? node.parentNode : node;
				parent = node.parentNode;
				next = node.nextSibling;
				parentEl = parent.getElement();
				viewportId = node.viewportId;
				els.p = FBEditor.editor.Factory.createElement('p');
				els.t = FBEditor.editor.Factory.createElementText('Заголовок');
				els.p.add(els.t);
				title.add(els.p);
				FBEditor.editor.Manager.suspendEvent = true;
				newNode = title.getNode(viewportId);
				if (next)
				{
					parentEl.insertBefore(title, next.getElement());
					parent.insertBefore(newNode, next);
				}
				else
				{
					parentEl.add(title);
					parent.appendChild(newNode);
				}
				FBEditor.editor.Manager.suspendEvent = false;

				// устанавливаем курсор
				sel.collapse(els.p.nodes[viewportId]);
				FBEditor.editor.Manager.setFocusElement(els.p);
			}
		}
	}
);