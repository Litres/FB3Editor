/**
 * Контроллер кнопки epigraph.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.epigraph.EpigraphController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',
		alias: 'controller.panel.toolstab.main.button.epigraph',

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				nodes = {},
				els = {},
				name = btn.elementName,
				range,
				nameElements,
				sch,
				enable;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();

				return;
			}

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

			// получаем дочерние имена элементов для проверки по схеме
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
			enable = sch.verify(name, nameElements);

			if (enable)
			{
				btn.enable();
			}
			else
			{
				btn.disable();
			}
		}
	}
);