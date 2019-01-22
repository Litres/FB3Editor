/**
 * Кнотроллер элемента annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.annotation.AnnotationElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				name = me.getNameElement(),
				manager = FBEditor.getEditorManager(),
				els = {},
				nodes = {},
				pos = 0,
				res,
				sch,
				range,
				nameElements;

			range = manager.getRangeCursor();
			nodes.node = range.common;
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

			// ищем родитель-заголовок
			nodes.title = nodes.parent;
			els.title = nodes.title.getElement();
			while (!(els.title.isTitle || els.title.isRoot))
			{
				nodes.title = nodes.title.parentNode;
				els.title = nodes.title.getElement();
			}

			if (els.title.isTitle)
			{
				nodes.node = nodes.title;
				els.node = els.title;
			}
			else
			{
				els.parent = nodes.parent.getElement();
				nodes.node = els.parent.hisName(name) ? nodes.parent : nodes.node;
			}

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			nodes.first = nodes.parent.firstChild;
			els.first = nodes.first ? nodes.first.getElement() : null;

			nameElements = manager.getNamesElements(els.parent);

			while (els.first && (els.first.isEpigraph || els.first.isTitle))
			{
				pos++;
				nodes.first = nodes.first.nextSibling;
				els.first = nodes.first ? nodes.first.getElement() : null;
			}

			nameElements.splice(pos, 0, name);

			// проверяем элемент по схеме
			sch = manager.getSchema();
			name = els.parent.getName();
			//console.log('name, nameElements', name, nameElements);
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		}
	}
);