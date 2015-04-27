/**
 * Кнотроллер элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		/**
		 * Вставляет новую секцию.
		 * @param {Node} node Узел, после которого необходимо вставить секцию.
		 */
		onInsertElement: function (node)
		{
			var viewportId = node.viewportId,
				els = {},
				sel,
				parent,
				parentEl,
				next,
				newNode;

			els.section = FBEditor.editor.Factory.createElement('section');
			els.title = FBEditor.editor.Factory.createElement('title');
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Заголовок');
			els.p.add(els.t);
			els.title.add(els.p);
			els.section.add(els.title);
			els.p2 = FBEditor.editor.Factory.createElement('p');
			els.t2 = FBEditor.editor.Factory.createElementText('Текст');
			els.p2.add(els.t2);
			els.section.add(els.p2);
			parent = node.parentNode;
			parentEl = parent.getElement();
			next = node.nextSibling;
			FBEditor.editor.Manager.suspendEvent = true;
			newNode = els.section.getNode(viewportId);
			if (next)
			{
				parentEl.insertBefore(els.section, next.getElement());
				parent.insertBefore(newNode, next);
			}
			else
			{
				parentEl.add(els.section);
				parent.appendChild(newNode);
			}
			FBEditor.editor.Manager.suspendEvent = false;

			// устанавливаем курсор
			sel = window.getSelection();
			sel.collapse(els.p2.nodes[viewportId]);
			FBEditor.editor.Manager.setFocusElement(els.p2);
		}
	}
);