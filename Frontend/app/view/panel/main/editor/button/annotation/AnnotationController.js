/**
 * Контроллер кнопки annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.annotation.AnnotationController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.ButtonController',
		alias: 'controller.main.editor.button.annotation',

		/**
		 * Синхронизирует кнопку, используя проверку по схему.
		 */
		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = btn.getEditorManager(),
				factory = FBEditor.editor.Factory,
				nodes = {},
				els = {},
				pos = 0,
				name = btn.elementName,
				range,
				xml;

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

			while (els.first && (els.first.isEpigraph || els.first.isTitle))
			{
				pos++;
				nodes.first = nodes.first.nextSibling;
				els.first = nodes.first ? nodes.first.getElement() : null;
			}

			// создаем временный элемент для проверки новой структуры
			els.newEl = factory.createElement(name);
			els.newEl.createScaffold();

			if (!range.collapsed)
			{
				// переносим выделенный параграф

				els.p = range.start.getElement();
				els.isRoot = els.p.isRoot;
				while (els.p && !els.p.isP)
				{
					els.p = els.isRoot ? els.p.first() : els.p.parent;
				}

				if (!els.p)
				{
					btn.disable();

					return;
				}

				els.parentP = els.p.parent;
				els.next = els.p.next();
				els.newEl.add(els.p);
			}

			els.parent.children.splice(pos, 0, els.newEl);

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
			me.verify(xml);
		}
	}
);