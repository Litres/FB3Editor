/**
 * Кнотроллер элемента epigraph.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.epigraph.EpigraphElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		getNodeVerify: function (sel, opts)
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				name = me.getNameElement(),
				els = {},
				nodes = {},
				range;

			// получаем данные из выделения
			range = manager.getRangeCursor();

			nodes.node = range.start;
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

			//console.log('node verify', range, els, nodes);

			return nodes.node;
		}
	}
);