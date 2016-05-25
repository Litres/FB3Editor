/**
 * Контроллер элемента notebody.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notebody.NotebodyElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				name = me.getNameElement(),
				manager,
				res,
				sch,
				range,
				nameElements;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			manager = els.node.getManager();

			// ищем notes
			while (!(els.parent.isNotes || els.parent.isRoot))
			{
				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
			}

			if (!els.parent.isNotes)
			{
				return false;
			}

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nodes.first = nodes.parent.firstChild;
			els.first = nodes.first ? nodes.first.getElement() : null;

			// получаем дочерние имена элементов для проверки по схеме

			nameElements = manager.getNamesElements(els.parent);

			if (!els.first.isTitle)
			{
				nameElements.unshift(name);
			}
			else
			{
				nameElements.splice(1, 0, name);
			}

			// проверяем элемент по схеме
			sch = manager.getSchema();
			name = els.parent.getName();
			//console.log('name, nameElements', name, nameElements);
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		}
	}
);