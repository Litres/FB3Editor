/**
 * Кнотроллер элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onInsertElement: function (node)
		{
			var me = this,
				viewportId = node.viewportId,
				el = me.getElement(),
				els = {},
				parent,
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
			el.add(els.section);
			FBEditor.editor.Manager.suspendEvent = true;
			newNode = els.section.getNode(viewportId);
			parent = node.parentNode;
			next = node.nextSibling;
			if (next)
			{
				parent.insertBefore(newNode, next);
			}
			else
			{
				parent.appendChild(newNode);
			}
			FBEditor.editor.Manager.suspendEvent = false;
		}
	}
);