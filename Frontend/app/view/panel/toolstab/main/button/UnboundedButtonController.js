/**
 * Контроллер кнопки элемента блочного типа неограниченного по количеству.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.UnboundedButtonController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.ButtonController',

		onSync: function ()
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
				factory = manager.getFactory(),
				nodes = {},
				els = {},
				reg = {},
				pos = {},
				name = btn.elementName,
				xml,
				range;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();
				return;
			}

			if (!range.collapsed)
			{
				nodes.common = range.common;

				if (!nodes.common.getElement || nodes.common.getElement().isRoot)
				{
					btn.disable();
					return;
				}

				els.common = nodes.common.getElement();
				nodes.start = range.start;
				els.start = nodes.start.getElement();
				nodes.end = range.end;
				els.end = nodes.end.getElement();

				// ищем самый верхниий элемент, который может делиться на несколько
				while (!els.common.permit.splittable)
				{
					nodes.common = nodes.common.parentNode;
					els.common = nodes.common.getElement();
					if (els.common.isRoot)
					{
						btn.disable();
						return;
					}
				}

				// получаем позицию первого элемента из выделения
				nodes.start = range.start;
				els.start = nodes.start.getElement();
				nodes.parentStart = nodes.start.parentNode;
				els.parentStart = nodes.parentStart.getElement();
				while (els.parentStart.elementId !== els.common.elementId)
				{
					nodes.start = nodes.parentStart;
					els.start = nodes.start.getElement();
					nodes.parentStart = nodes.start.parentNode;
					els.parentStart = nodes.parentStart.getElement();
				}
				pos.start = els.common.getChildPosition(els.start);

				// получаем позицию последнего элемента из выделения
				nodes.end = range.end;
				els.end = nodes.end.getElement();
				nodes.parentEnd = nodes.end.parentNode;
				els.parentEnd = nodes.parentEnd.getElement();
				while (els.parentEnd.elementId !== els.common.elementId)
				{
					nodes.end = nodes.parentEnd;
					els.end = nodes.end.getElement();
					nodes.parentEnd = nodes.end.parentNode;
					els.parentEnd = nodes.parentEnd.getElement();
				}
				pos.end = els.common.getChildPosition(els.end);

				reg.start = new RegExp('^' + range.toString());
				reg.start2 = new RegExp('^' + els.start.getText());
				reg.end = new RegExp(range.toString() + '$');
				reg.end2 = new RegExp(els.end.getText() + '$');

				// позиция выделения относительно затронутых элементов
				pos.isStart = reg.start.test(els.start.getText()) || reg.start2.test(range.toString());
				pos.isEnd = reg.end.test(els.end.getText()) || reg.end2.test(range.toString());

				// создаем временный элемент для проверки новой структуры
				els.newEl = factory.createElement(name);
				els.newEl.createScaffold();

				pos.count = pos.end - pos.start;
				pos.start = !pos.isStart ? pos.start + 1 : pos.start;
				pos.count = pos.isStart && pos.isEnd ? pos.count + 1 : pos.count;
				pos.count = !pos.isStart && !pos.isEnd ? pos.count - 1 : pos.count;

				//console.log(els);
				//console.log(pos);

				els.common.children.splice(pos.start, 0, els.newEl);

				// переносим все выделенные элементы во временный
				els.rangeNext = els.common.children[pos.start + pos.count + 1];
				els.range = els.common.children.splice(pos.start + 1, pos.count);
				for (var i = 0; i < pos.count; i++)
				{
					els.newEl.add(els.range[i]);
				}

				// получаем xml
				xml = manager.getContent().getXml(true);

				// возвращаем все выделенные элементы обратно
				for (i = 0; i < pos.count; i++)
				{
					if (els.rangeNext)
					{
						els.common.insertBefore(els.range[i], els.rangeNext);
					}
					else
					{
						els.common.add(els.range[i]);
					}
				}

				// удаляем временный элемент
				els.common.children.splice(pos.start, 1);

				// проверяем по схеме
				me.verify(xml);
			}
			else
			{
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

				els.parent = nodes.parent.getElement();
				nodes.node = els.parent.hisName(name) ? nodes.parent : nodes.node;

				nodes.parent = els.node.isRoot ? nodes.node : nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// создаем временный элемент для проверки новой структуры
				els.newEl = factory.createElement(name);
				els.newEl.createScaffold();

				pos = els.parent.getChildPosition(els.node) + 1;
				els.parent.children.splice(pos, 0, els.newEl);

				// получаем xml
				xml = manager.getContent().getXml(true);

				// удаляем временный элемент
				els.parent.children.splice(pos, 1);

				// проверяем по схеме
				//console.log('xml', xml);
				me.verify(xml);
			}
		}
	}
);