/**
 * Создает заголовок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.title.CreateCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCreateCommand',

		elementName: 'title',

		createElement: function (els, nodes)
		{
			var me = this,
				data = me.getData(),
				opts = data.opts || {},
				range = data.range,
				factory = FBEditor.editor.Factory,
				viewportId,
				manager;

			viewportId = data.viewportId;
			manager = els.node.getManager();
			els.newNode = factory.createElement(me.elementName);

			if (opts.body)
			{
				// заголовок для всей книги
				els.parent = manager.getContent();
			}
			else
			{
				els.parent = nodes.node.getElement().parent;
				els.node = els.parent.hisName(me.elementName) ? els.parent : els.node;
				els.parent = els.node.parent;
			}

            els.first = els.parent.first();

            // находим выделенный абзац
            nodes.p = range.start;
            els.p = nodes.p.getElement();
            els.p = els.p.getStyleHolder();

            if (range.collapsed)
			{
                // содержимое по умолчанию
                els = Ext.apply(els, els.newNode.createScaffold());

                if (els.first)
                {
                    els.parent.insertBefore(els.newNode, els.first, viewportId);
                }
                else
                {
                    els.parent.add(els.newNode, viewportId);
                }
            }
			else
			{
                if (!opts.body && !els.p.isFirst())
                {
                    // добавляем секцию, после текущей

					// текущая секция
					els.section = els.p.getParentName('section');
					els.sectionParent = els.section.parent;

					// новая секция
					els.newSection = factory.createElement('section');

					if (els.section.next())
					{
						els.sectionNext = els.section.next();
                        els.sectionParent.insertBefore(els.newSection, els.sectionNext, viewportId);
					}
					else
					{
						els.sectionParent.add(els.newSection, viewportId);
					}

					// добавляем заголовок в новую секцию
                    els.newSection.add(els.newNode, viewportId);

                    if (!els.p.next())
                    {
                        // добавляем пустой абзац после заголовка, чтобы соответствовать схеме
                        els.emptyP = manager.createEmptyP();
                        els.newSection.add(els.emptyP, viewportId);
                    }

					// переносим элементы в новую секцию

					els.next = els.p;

                    while (els.next)
                    {
                    	els.buf = els.next.next();
                        els.newSection.add(els.next, viewportId);
                        els.next = els.buf;
                    }
                }
                else
				{
                    // для undo
                    els.next = els.p.next();
                    els.oldParent = els.p.parent;

                    els.parent.insertBefore(els.newNode, els.first, viewportId);
				}

                // переносим выделенный абзац в заголовок
                els.newNode.add(els.p, viewportId);
			}

			me.data.nodes = nodes;
            me.data.els = els;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				helper,
				viewportId,
				manager,
				range;

			try
			{
				range = data.range;
                nodes = data.nodes;
                els = data.els;
                viewportId = data.viewportId;

				if (range.collapsed)
				{
					els.node = els.newNode;

					return me.callParent(arguments);
				}
				
				console.log('undo create', me.elementName, range);
				
				manager = els.p.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);

				// возвращаем абзац на старое место из заголовка
				if (els.next)
				{
					els.oldParent = els.next.parent;
					els.oldParent.insertBefore(els.p, els.next, viewportId);
				}
				else
				{
                    els.oldParent = els.oldParent ? els.oldParent : els.parent;
					els.oldParent.add(els.p, viewportId);
				}

				if (els.newSection)
				{
					if (!els.emptyP)
					{
						// переносим элементы в старую секцию

						els.next = els.newNode.next();

						while (els.next)
						{
							els.buf = els.next.next();
                            els.section.add(els.next, viewportId);
                            els.next = els.buf;
						}
					}

					// удаляем новую секцию
					els.sectionParent.remove(els.newSection, viewportId);
				}
				else
				{
                    // удаляем элемент
                    els.parent.remove(els.newNode, viewportId);
				}

				els.parent.sync(viewportId);

				// устанавливаем курсор
				els.cursor = els.p.getDeepLast(els.p);
				helper = els.cursor.getNodeHelper();
				nodes.cursor = helper.getNode(viewportId);
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: 0,
					endNode: nodes.cursor,
					endOffset: nodes.cursor.nodeValue.length
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