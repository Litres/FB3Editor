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
				factory = FBEditor.editor.Factory,
				nodes = {},
				els = {},
				name = btn.elementName,
				range,
				xml,
				pos,
				enable;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();

				return;
			}

			nodes.node = range.common;

			if (!nodes.node.getElement || nodes.node.getElement().isRoot)
			{
				btn.disable();

				return;
			}

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

			nodes.parent = els.node.isRoot ? nodes.node : nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			nodes.first = nodes.parent.firstChild;
			els.first = nodes.first ? nodes.first.getElement() : null;

			// создаем временный элемент для проверки новой структуры
			els.newEl = factory.createElement(name);
			els.newEl.createScaffold();

			pos = !els.first.isTitle ? 0 : 1;
			els.parent.children.splice(pos, 0, els.newEl);

			if (!range.collapsed)
			{
				// переносим выделенный параграф

				els.p = range.start.getElement();
				els.isRoot = els.p.isRoot;
				while (els.p && !els.p.isP)
				{
					els.p = els.isRoot ? els.p.first() : els.p.parent;
				}

				els.parentP = els.p.parent;
				els.next = els.p.next();
				els.newEl.add(els.p);
			}

			// получаем xml
			xml = manager.getContent().getXml(true);

			if (!range.collapsed)
			{
				// возвращаем параграф на старое место
				if (els.next)
				{
					els.parentP.insertBefore(els.p, els.next);
				}
				else
				{
					els.parentP.add(els.p);
				}
			}

			// удаляем временный элемент
			els.parent.children.splice(pos, 1);

			// проверяем по схеме
			enable = me.verify(xml);

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