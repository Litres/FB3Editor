/**
 * Вставляет данные из буфера обмена.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.PasteCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',
		requires: [
			'FBEditor.editor.pasteproxy.PasteProxy'
		],

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.getEditorManager(),
				e = data.e,
				res = false,
				nodes = {},
				els = {},
				offset = {},
				pos = {},
				helper,
				viewportId,
				//sel,
				range,
				proxy;

			try
			{
				if (manager.isSuspendCmd())
				{
					return false;
				}
				
				if (data.saveRange)
				{
					//return false;
				}
				
				// получаем данные из выделения
				range = data.range = manager.getRangeCursor();
				offset = range.offset;
				
				// удаляем все оверлеи в тексте
				manager.removeAllOverlays();

				nodes.node = range.start;
				els.node = nodes.node.getElement();
				els.p = els.node.getStyleHolder();

				if (!range.collapsed)
				{
					// удаляем выделенную часть текста
					els.p.removeRangeNodes();
				}
				
				nodes.node = range.start;
				els.node = nodes.node.getElement();

				//manager = els.node.getManager();
				manager.setSuspendEvent(true);
				
				viewportId = data.viewportId = nodes.node.viewportId;

				// прокси данных из буфера
				proxy = data.proxy || Ext.create('FBEditor.editor.pasteproxy.PasteProxy', {e: e, manager: manager});

				// получаем модель вставляемого фрагмента
				els.fragment = data.proxy ? proxy.getCreateModel() : proxy.getModel();

				//Ext.log({level: 'info', msg: 'Фрагмент', dump: els.fragment});

				data.proxy = proxy;
				els.fragP = els.fragment.first();

				if (!els.fragP)
				{
					// пустая вставка
					return true;
				}

				// проверяем корректность вставки в текущий элемент
				me.checkPasteIntoEl(els);

				if (els.fragP.isStyleHolder && els.fragment.getChildren().length === 1 && !els.node.isEmpty())
				{
					// если вставляемая модель содержит только один абзац,
					// то вставляем его содержимое в текущий абзац

					els.next = els.fragP.first();

					while (els.next)
					{
						els.temp = els.next.next();
						els.fragment.add(els.next);
						els.next = els.temp;
					}

					els.fragment.remove(els.fragP);
				}

				if (els.node.isEmpty())
				{
					// позиция курсора в пустом абзаце

					els.fragP = els.fragment.first();
					els.needEmpty = true;
					
					if (els.fragP && els.fragP.isBlock())
					{
						// абзац
						els.node = els.node.getStyleHolder();
					}
					else
					{
						// пустой элемент
						els.node = els.node.getDeepFirst();
					}
				}
				else
				{
					// делим узел в позиции курсора

					els.fragF = els.fragment.first();

					if (!els.fragF.isImg &&
					    (els.fragF.isStyleHolder ||
					    !els.fragF.isStyleType && !els.fragF.isText))
					{
						// делим на уровне абзацев

						// абзац
						els.node = els.node.getStyleHolder();
						helper = els.node.getNodeHelper();
						nodes.node = helper.getNode(viewportId);

						// находится ли курсор в конце абзаца
						pos.isEnd = manager.isLastNode(nodes.node, range.start) &&
						        range.start.nodeValue.length === offset.start;

						// находится ли курсор в начале абзаца
						pos.isStart = manager.isFirstNode(nodes.node, range.start) && offset.start === 0;
					}
					else
					{
						// делим узел на уровне стилевых элементов

						nodes.node = range.start;
						els.node = nodes.node.getElement();

						// находится ли курсор в конце элемента
						pos.isEnd = els.node.getLength() === offset.start;

						// находится ли курсор в начале элемента
						pos.isStart = offset.start === 0;
					}

					//console.log('pos', pos); //return false;

					if (pos.isStart)
					{
						// если курсор в начале элемента
					}
					else if (pos.isEnd)
					{
						// если курсор в конце элемента
						
						if (els.node.next())
						{
							// указатель на следующий элемент
							els.node = els.node.next();
						}
						else
						{
							// добавляем временно пустой элемент в конец и переносим на него указатель
							// после переноса фрагмента пустой элемент будет удален
							
							els.parent = els.node.getParent();
							els.node = manager.createEmptyElement();
							els.parent.add(els.node, viewportId);
						}
					}
					else
					{
						// делим элемент, если курсор не в конце и не в начале элемента

						els.needJoin = true;
						nodes.container = range.start;
						els.common = els.node.getParent();
						nodes.node = manager.splitNode(els, nodes, offset.start);
						els.node = nodes.node.getElement();
						els.common.removeEmptyText();
					}
				}

				//console.log('nodes', nodes); return false;

				els.parent = els.node.getParent();
				
				// ссылки на первый и последний элементы фрагмента
				els.fragmentFirst = els.fragment.first();
				els.fragmentLast = els.fragment.last();

				// переносим все элементы из фрагмента в текст
				
				els.first = els.fragment.first();
				
				while (els.first)
				{
					els.parent.insertBefore(els.first, els.node, viewportId);
					els.first = els.fragment.first();
				}

				// соединяем соседние текстовые узлы
				
				els.prev = els.fragmentFirst.prev();
				els.next = els.fragmentLast.next();
				
				if (els.prev && els.prev.isText && els.next && els.next.isText && els.fragmentFirst.isText &&
				    els.fragmentFirst.equal(els.fragmentLast))
				{
					// соединяем текстовый узел фрагмента с соседними текстовыми узлами
					
					// курсор
					els.cursor = els.prev;
					offset.cursor = offset.start;

					els.needReplaceText = els.prev.getText() + els.next.getText();
					
					offset.cursor = els.prev.getLength() + els.fragmentFirst.getLength();

					els.textValue = els.prev.getText() + els.fragmentFirst.getText() + els.next.getText();
					els.prev.setText(els.textValue, viewportId);
					//nodes.prev.nodeValue = els.textValue;

					els.parent.remove(els.fragmentFirst, viewportId);
					els.parent.remove(els.next, viewportId);
					els.next = null;
				}
				else if (els.prev && els.prev.isText && els.fragmentFirst.isText)
				{
					// соединяем первый узел фрагмента
					
					// курсор
					els.cursor = els.prev;
					offset.cursor = els.prev.getLength();

					els.needSplitFirst = true;

					els.textValue = els.prev.getText() + els.fragmentFirst.getText();
					els.prev.setText(els.textValue, viewportId);

					els.parent.remove(els.fragmentFirst, viewportId);
				}

				if (els.next && els.next.isText && els.fragmentLast.isText)
				{
					// соединяем последний узел фрагмента

					els.needSplitLast = true;

					els.textValue = els.fragmentLast.getText() + els.next.getText();
					els.next.setText(els.textValue, viewportId);

					els.parent.remove(els.fragmentLast, viewportId);

					// курсор
					els.cursor = els.next;
					offset.cursor = els.fragmentLast.getLength();
				}

				if (els.node.isEmpty())
				{
					// удаляем пустой элемент
					els.parent.remove(els.node, viewportId);
				}

				//console.log('nodes, els', nodes, els);

				// синхронизируем элемент
				els.parent.sync(viewportId);

				manager.setSuspendEvent(false);

				//console.log('cursor', offset.cursor, els.cursor);
				
				// устанавливаем курсор
				els.cursor = els.cursor || els.fragmentFirst.getDeepFirst();
				nodes.cursor = els.cursor.getNodeHelper().getNode(viewportId);
				offset.cursor = offset.cursor ? offset.cursor : 0;
				manager.setCursor(
					{
						startNode: nodes.cursor,
						startOffset: offset.cursor
					}
				);

				// сохраняем
				data.nodes = nodes;
				data.els = els;

				// проверяем по схеме
				me.verifyElement(els.parent, {validXml: true});

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).removeNext();
			}

			manager.setSuspendEvent(false);
			
			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				paste = FBEditor.resource.Manager.getPaste(),
				nodes = {},
				els = {},
				res = false,
				viewportId,
				manager,
				range;

			try
			{
				viewportId = data.viewportId;
				range = data.range;
				nodes = data.nodes;
				els = data.els;
				manager = els.parent.getManager();
				manager.removeAllOverlays();
				manager.setSuspendEvent(true);
				els.cursor = range.start.getElement();
				
				console.log('undo paste', nodes, els, range);

				if (els.needReplaceText)
				{
					// заменяем вставленный текст на старый
					els.prev.setText(els.needReplaceText, viewportId);
					
					// курсор
					els.cursor = els.prev;

					els.prev.sync(viewportId);
				}
				else
				{
					// удаляем вставленный фрагмент

					if (els.needSplitFirst)
					{
						// разбиваем первый текстовый узел
						
						els.startTextValue = els.prev.getText(0, range.offset.start);
						els.endTextValue = els.prev.getText(range.offset.start);
						els.fragmentFirst = els.prev;
						els.fragmentFirst.setText(els.endTextValue, viewportId);
						els.t = factory.createElementText(els.startTextValue);
						els.parent.insertBefore(els.t, els.fragmentFirst, viewportId);
						
						// курсор
						els.cursor = els.t;
					}

					if (els.needSplitLast)
					{
						// разбиваем последний текстовый узел
						
						els.startTextValue = els.next.getText(0, range.offset.cursor);
						els.endTextValue = els.next.getText(range.offset.cursor);
						els.fragmentLast = factory.createElementText(els.startTextValue);
						els.next.setText(els.endTextValue, viewportId);
						els.parent.insertBefore(els.fragmentLast, els.next, viewportId);
					}
					
					els.next = els.fragmentFirst;
					//console.log('els', els);
					
					while (els.next && !els.next.equal(els.fragmentLast))
					{
						els.buf = els.next.next();
						els.parent.remove(els.next, viewportId);
						els.next = els.buf;
					}
					
					if (els.next)
					{
						els.parent.remove(els.next, viewportId);
					}

					if (els.needJoin)
					{
						// соединяем узлы
						manager.joinNode(nodes.node);
					}

					if (els.needEmpty)
					{
						// вставляем пустой узел
						els.parent.add(els.node, viewportId);
					}

					els.parent.sync(viewportId);
				}

				manager.setSuspendEvent(true);

				// устанавливаем курсор
				nodes.cursor = els.cursor.getNodeHelper().getNode(viewportId);
				data.saveRange = {
					startNode: nodes.cursor,
					startOffset: range.offset.start
				};
				manager.setCursor(data.saveRange);
				
				// удаляем вставленные ресурсы
				paste.remove();

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				me.getHistory(els.parent).remove();
			}

			manager.setSuspendEvent(false);
			
			return res;
		},
		
		verifyResult: function (res, scopeData)
		{
			var me = this,
				el = scopeData.el,
				syncButtons = scopeData.syncButtons,
				manager = el.getManager();
			
			//console.log('res', res, scopeData);
			
			// возобновляем обработку команд
			manager.setSuspendCmd(false);
			
			if (!res)
			{
				// преобразуем вставляемый фрагмент в простой текст из абзацев
				me.convertToText();
			}
			
			manager.setChanged(true);
			
			if (syncButtons)
			{
				// принудительно синхронизируем кнопки, игнорируя кэш
				manager.syncButtons();
			}
			
			if (manager.updateTree)
			{
				// обновляем дерево навигации
				manager.updateTree();
			}
		},

		/**
		 * @private
		 * Проверяет корректность вставки в текущий элемент при необходимотси корректирует вставку.
		 * @param {Object} els
		 */
		checkPasteIntoEl: function (els)
		{
			var me = this;

			els.fragment.each(
				function (el)
				{
					if (els.node.hasParentName('div') && el.hisName('div'))
					{
						// убираем вложенность блоков
						el.upChildren();
					}
				}
			);
		},
		
		/**
		 * @private
		 * Преобразует вставляемый фрагмент в простой текст из абзацев.
		 * Удаляет все аттрибуты из фрагмента.
		 */
		convertToText: function ()
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory,
				els,
				viewportId,
				manager;
			
			viewportId = data.viewportId;
			els = data.els;
			manager = els.parent.getManager();
			
			manager.setSuspendEvent(true);
			
			//console.log(nodes.fragmentFirst);
			//console.log(nodes.fragmentLast);
			
			els.nextF = els.fragmentFirst;
			els.lastF = els.fragmentLast.next();
			
			//console.log('last', els.last);
			
			while (els.nextF)
			{
				els.buf = els.nextF.next();
				
				//console.log('next', els.next.getName());
				
				// удаляем все аттрибуты
				els.nextF.removeAttributes(true);
				
				if (!els.nextF.isP)
				{
					// фрагмент для хранения преобразованных элементов
					els.fragment = factory.createElement('div');
					
					// помещаем во фрагмент только стилевые элементы и их контейнеры
					els.nextF.convertToText(els.fragment);
					
					if (els.nextF.equal(els.fragmentFirst))
					{
						// корректируем ссылку на первый элемент вставки
						els.fragmentFirst = els.fragment.first();
					}
					
					// корректируем ссылку на последний элемент вставки
					els.fragmentLast = els.fragment.last();
					
					// заменяем текущий элемент на фрагмент
					//els.parent.replace(els.fragment, els.next, viewportId);
					els.parent.insertBefore(els.fragment, els.nextF, viewportId);
					els.parent.remove(els.nextF, viewportId);
					
					// выносим абзацы из фрагмента
					els.fragment.upChildren(viewportId);
				}
				
				els.nextF = els.lastF && els.nextF.equal(els.lastF) ? null : els.buf;
			}
			
			// корректируем курсор
			els.fragmentFirst.getNodeHelper().setCursor({withoutScroll: true});
			
			manager.setSuspendEvent(false);
			
			// синхронизируем элемент
			els.parent.sync(viewportId);
		}
	}
);