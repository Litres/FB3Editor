/**
 * Кнотроллер элемента title.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.title.TitleElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				root = manager.getContent(),
				res,
				sch,
				name,
				range,
				nameElements;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			nodes.node = els.node.isText || els.node.hisName(manager.emptyElement) ? nodes.node.parentNode : nodes.node;
			els.node = nodes.node.getElement();
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			// получаем дочерние имена элементов для проверки по схеме
			if (opts && opts.body)
			{
				nameElements = manager.getNamesElements(root);
				name = root.getName();
			}
			else
			{
				nameElements = me.getNameElementsVerify(nodes);
				name = els.parent.getName();
			}

			// проверяем элемент по схеме
			sch = manager.getSchema();
			//console.log('name, nameElements', name, nameElements);
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		}
	}
);