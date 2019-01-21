/**
 * Создает эпиграф.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.epigraph.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'epigraph',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				range = data.range,
				factory = FBEditor.editor.Factory,
				elementName = me.elementName,
				viewportId = data.viewportId,
				manager,
				helper;
			
			manager = els.node.getManager();
			els.parent = els.node.getParent();
			els.node = els.parent.hisName(elementName) ? els.parent : els.node;
			els.parent = els.node.getParent();
			els.prevNode = data.prevNode ? data.prevNode.getElement() : null;
			els.first = els.prevNode && els.prevNode.next() ? els.prevNode : els.parent.first();
			
			els.node = factory.createElement(elementName);

			if (range.collapsed)
			{
				// содержимое по умолчанию
				els = Ext.apply(els, els.node.createScaffold());
			}

			if (els.first)
			{
				if (els.prevNode && els.prevNode.hisName(els.node.getName()))
				{
					// вставка после конкретного эпиграфа
					els.first = els.first.next();
				}
				else
				{
					// вставка после всех эпиграфов или заголовка

					els.next = els.first.next();

					while (els.next && (els.first.hisName(els.node.getName()) || els.first.isTitle))
					{
						els.first = els.next;
						els.next = els.next.next();
					}
				}

				els.parent.insertBefore(els.node, els.first, viewportId);
			}
			else
			{
				els.parent.add(els.node, viewportId);
			}
			
			if (!range.collapsed)
			{
				// переносим выделенные параграфы в элемент

				els.firstP = range.start.getElement();
				els.firstP = els.firstP.isStyleHolder ? els.firstP : els.firstP.getStyleHolder();
				helper = els.firstP.getNodeHelper();
				nodes.firstP = helper.getNode(viewportId);
				els.lastP = range.end.getElement();
				els.lastP = els.lastP.isStyleHolder ? els.lastP : els.lastP.getStyleHolder();
				helper = els.lastP.getNodeHelper();
				nodes.lastP = helper.getNode(viewportId);

				// получаем все выделенные абзацы
				nodes.pp = manager.getNodesPP(nodes.firstP, nodes, els);
				nodes.pp.push(nodes.lastP);

				// переносим все выделенные абзацы в эпиграф
				Ext.each(
					nodes.pp,
				    function (p)
				    {
					    var elP = p.getElement();

					    // временно сохраняем ссылки для использования в операции undo
					    elP._oldLinks = {
						    parent: elP.parent,
						    next: elP.next()
					    };

					    // переносим абзац в эпиграф
					    els.node.add(elP, viewportId);
				    }
				);

				// для курсора
				els.p = els.lastP;
				
				if (els.parent.last().hisName(elementName))
				{
					// добавляем пустой абзац после эпиграфа, если других элементов после него нет,
					// чтобы соответствовать схеме
					els.emptyP = manager.createEmptyP();
					els.parent.add(els.emptyP, viewportId);
				}
			}

			data.nodes = nodes;
			data.els = els;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els,
				nodes,
				manager,
				range,
				viewportId;

			try
			{
				range = data.range;

				console.log('undo create epigraph', data);

				if (range.collapsed)
				{
					// простая отмена эпиграфа, созданного по умолчанию (без выделения текста)
					return me.callParent(arguments);
				}

				viewportId = data.viewportId;
				nodes = data.nodes;
				els = data.els;
				manager = els.node.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				
				if (els.emptyP)
				{
					// удаляем пустой абзац
					els.parent.remove(els.emptyP, viewportId);
				}

				// возвращаем абзацы на старое место

				// переворачиваем массив, чтобы восстанавливались корректные связи между сиблингами
				nodes.pp = nodes.pp.reverse();

				Ext.each(
					nodes.pp,
					function (p)
					{
						var elP = p.getElement(),
							oldLinks = elP._oldLinks;

						if (oldLinks.next)
						{
							oldLinks.parent.insertBefore(elP, oldLinks.next, viewportId);
						}
						else
						{
							oldLinks.parent.add(elP, viewportId);
						}

						elP._oldLinks = null;
					}
				);

				els.parent.remove(els.node, viewportId);
				els.parent.sync(viewportId);
				manager.setSuspendEvent(false);

				// устанавливаем курсор
				nodes.cursorStart = manager.getDeepFirst(nodes.pp.pop());
				nodes.cursorEnd = manager.getDeepLast(nodes.pp.shift()) || nodes.cursorStart;
				data.saveRange = {
					startNode: nodes.cursorStart,
					startOffset: 0,
					endNode: nodes.cursorEnd,
					endOffset: nodes.cursorEnd.nodeValue.length
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			manager.updateTree();
			
			return res;
		}
	}
);