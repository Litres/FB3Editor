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
				helper,
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
			
			els.firstP = range.start.getElement();
			els.firstP = els.firstP.getStyleHolder();
			helper = els.firstP.getNodeHelper();
			nodes.firstP = helper.getNode(viewportId);
			els.lastP = range.end.getElement();
			els.lastP = els.lastP.getStyleHolder();
			helper = els.lastP.getNodeHelper();
			nodes.lastP = helper.getNode(viewportId);
			
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
					
					// ищем следующий элемент после последнего абзаца,
	                // начиная с которого будут перенесены все элементы в новую секцию
	                
	                els.next = els.lastP.getParent().equal(els.section) ? els.lastP.next() : null;
	                
	                if (!els.next && !els.lastP.getParent().equal(els.section))
	                {
	                	// если абзац вложен в другой элемент, кроме секции
	                	
		                els.next = els.lastP.getParent();
		                
	                	while (!els.next.getParent().equal(els.section))
		                {
			                els.next = els.next.getParent();
		                }
		                
		                // следующий элемент относительно родительского элемента абзаца
		                els.next = els.next.next();
	                }
	
	                if (!els.next)
                    {
                        // добавляем пустой абзац после заголовка, чтобы соответствовать схеме
                        els.emptyP = manager.createEmptyP();
                        els.newSection.add(els.emptyP, viewportId);
                    }

					// переносим элементы, находящиеся после выделения, в новую секцию

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
                //els.newNode.add(els.p, viewportId);
				
				// переносим выделенные параграфы в элемент
				
				// получаем все выделенные абзацы
				
				els.pp = {
					common: range.common.getElement(),
					lastP: els.lastP
				};
				
				nodes.pp = manager.getNodesPP(nodes.firstP, nodes, els.pp);
				nodes.pp.push(nodes.lastP);
				
				// переносим все выделенные абзацы в новый заголовок
				Ext.each(
					nodes.pp,
					function (p)
					{
						var elP = p.getElement(),
							elParent = elP.getParent(),
							elEmpty = {
								el: null,
								elParent: null,
								next: null
							};
						
						// временно сохраняем ссылки для использования в операции undo
						elP._oldLinks = {
							parent: elParent,
							next: elP.next(),
							empty: null
						};
						
						// переносим абзац в заголовок
						els.newNode.add(elP, viewportId);
						
						if (elParent.isEmpty())
						{
							// удаляем пустой родительский элемент, образовавшийся после переноса абзаца
							
							elEmpty.el = elParent;
							elEmpty.elParent = elEmpty.el.getParent();
							
							while (elEmpty.elParent.isEmpty())
							{
								elEmpty.el = elEmpty.elParent;
								elEmpty.elParent = elEmpty.elParent.getParent();
							}
							
							elEmpty.next = elEmpty.el.next();
							
							elEmpty.elParent.remove(elEmpty.el, viewportId);
							
							// сохраняем ссылку на удаленный элемент
							elP._oldLinks.empty = elEmpty;
						}
					}
				);
				
				// для курсора
				els.p = els.lastP;
			}

			data.nodes = nodes;
            data.els = els;
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

				/*
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
				*/
				
				// возвращаем абзацы на старое место
				
				// переворачиваем массив, чтобы восстанавливались корректные связи между сиблингами
				nodes.pp = nodes.pp.reverse();
				
				Ext.each(
					nodes.pp,
					function (p)
					{
						var elP = p.getElement(),
							oldLinks = elP._oldLinks,
							empty = oldLinks.empty;
						
						if (empty)
						{
							// восстанавливаем родительский элемент абзаца, если он оказался пустым и был удален
							
							if (empty.next)
							{
								empty.elParent.insertBefore(empty.el, empty.next, viewportId);
							}
							else
							{
								empty.elParent.add(empty.el, viewportId);
							}
						}
						
						// восстанавливаем абзац
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