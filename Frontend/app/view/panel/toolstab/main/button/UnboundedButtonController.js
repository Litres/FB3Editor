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
				nodes = {},
				els = {},
				names = {},
				reg = {},
				pos = {},
				name = btn.elementName,
				nameElements,
				range,
				sch,
				enable;

			range = manager.getRange();

			if (!range)
			{
				btn.disable();

				return;
			}

			if (!range.collapsed)
			{
				nodes.common = range.common;
				els.common = nodes.common.getElement();

				if (els.common.isRoot)
				{
					btn.disable();

					return;
				}

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

				// получаем дочерние имена элементов родитильского элемента для проверки по схеме
				names.common = manager.getNamesElements(els.common);

				// количество имен элементов, заменяемых в списке
				pos.count = pos.end - pos.start;

				reg.start = new RegExp('^' + range.toString());
				reg.start2 = new RegExp('^' + els.start.getText());
				reg.end = new RegExp(range.toString() + '$');
				reg.end2 = new RegExp(els.end.getText() + '$');

				// позиция выделения относительно затронутых элементов
				pos.isStart = reg.start.test(els.start.getText()) || reg.start2.test(range.toString());
				pos.isEnd = reg.end.test(els.end.getText()) || reg.end2.test(range.toString());

				// получаем имена элементов, которые станут дочерними для элемента, для проверки по схеме
				names.el = names.common.slice(pos.start, pos.end + 1);

				// проверяем элемент по схеме
				sch = manager.getSchema();
				//console.log('name, names.el', name, names.el);
				enable = sch.verify(name, names.el);

				if (enable)
				{
					// проверяем родительсктий элемент по схеме

					pos.start = !pos.isStart ? pos.start + 1 : pos.start;
					pos.count = pos.isStart && pos.isEnd ? pos.count + 1 : pos.count;
					pos.count = !pos.isStart && !pos.isEnd ? pos.count - 1 : pos.count;

					// убираем из проверки имена элементов, которые попали в выделение, и заменяем их на имя нового элемента
					names.common.splice(pos.start, pos.count, name);
					if (els.start.elementId === els.end.elementId && !pos.isStart && !pos.isEnd)
					{
						// добалвяем имя элемента, который делится выделением пополам
						names.common.splice(pos.start + 1, 0, names.common[pos.start - 1]);
					}

					name = els.common.getName();
					//console.log('name, names.common', name, names.common);
					enable = sch.verify(name, names.common);
				}
			}
			else
			{
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

				// получаем дочерние имена элементов для проверки по схеме
				nameElements = manager.getNamesElements(els.parent);
				nameElements.splice(els.parent.getChildPosition(els.node) + 1, 0, name);

				// проверяем элемент по схеме
				sch = manager.getSchema();
				name = els.parent.getName();
				//console.log('name, nameElements', name, nameElements);
				enable = sch.verify(name, nameElements);
			}

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