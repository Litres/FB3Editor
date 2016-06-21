/**
 * Абстрактный контроллер элемента содержажащего в себе стилевые элементы.
 * Используется для WebKit.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElementControllerWebKit',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElementController',

		/**
		 * @property {Number} Величина прокрутки скролла, чтобы сделать видимым абзац, в который перемещается курсор
		 * клавишами Вверх/Вниз.
		 */
		scrollTopBy: 20,

		/**
		 * @property {Object} Хранит данные текстового курсора.
		 */
		cursorData: null,

		onKeyDownCtrlA: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId;

			// выделяем весь текст

			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			els.root = els.node.getRoot();

			manager = els.root.getManager();
			viewportId = nodes.node.viewportId;

			// начальная точка выделения
			els.deepFirst = els.root.getDeepFirst();
			helper = els.deepFirst.getNodeHelper();
			nodes.deepFirst = helper.getNode(viewportId);

			// конечная точка выделения
			els.deepLast = els.root.getDeepLast();
			helper = els.deepLast.getNodeHelper();
			nodes.deepLast = helper.getNode(viewportId);
			els.endOffset = els.deepLast.isText ? els.deepLast.text.length : 0;

			// начальный абзац
			els.firstP = els.deepFirst.getStyleHolder();
			helper = els.firstP.getNodeHelper();
			nodes.firstP = helper.getNode(viewportId);
			nodes.firstP.setAttribute('contenteditable', false);

			// конечный абзац
			els.lastP = els.deepLast.getStyleHolder();
			helper = els.lastP.getNodeHelper();
			nodes.lastP = helper.getNode(viewportId);
			nodes.lastP.setAttribute('contenteditable', false);

			//console.log(nodes, els);

			manager.setCursor(
				{
					startNode: nodes.deepFirst,
					startOffset: 0,
					endNode: nodes.deepLast,
					endOffset: els.endOffset
				}
			);

			e.preventDefault();
		},

		onKeyDownLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				helper,
				range,
				viewportId,
				isStart;

			range = sel.getRangeAt(0);

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();

			viewportId = nodes.node.viewportId;

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// самый первый вложенный элемент абзаца
			els.deepFirst = els.p.getDeepFirst();
			helper = els.deepFirst.getNodeHelper();
			nodes.deepFirst = helper.getNode(viewportId);

			// находится ли курсор в начале абзаца
			isStart = els.node.isEmpty() ||
			          els.node.isImg && !els.node.prev() ||
			          els.node.isStyleHolder && els.node.children.length === 1 && els.node.first().isImg ||
			          range.startOffset === 0 && els.deepFirst.elementId === els.node.elementId;

			if (isStart)
			{
				// перемещаем курсор в конец предыдущего абзаца
				me.cursorToLeft(e, els, nodes);
			}
		},

		onKeyDownRight: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				helper,
				range,
				viewportId,
				isEnd;

			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();

			viewportId = nodes.node.viewportId;

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// самый последний вложенный элемент абзаца
			els.deepLast = els.p.getDeepLast();
			helper = els.deepLast.getNodeHelper();
			nodes.deepLast = helper.getNode(viewportId);

			// находится ли курсор в конце абзаца
			isEnd = els.node.isEmpty() ||
			        els.node.isImg && !els.node.next() ||
			        els.node.isStyleHolder && els.node.children.length === 1 && els.node.first().isImg ||
			        range.endOffset === nodes.node.length && els.deepLast.elementId === els.node.elementId;

			if (isEnd)
			{
				// перемещаем курсор в начало следующего абзаца
				me.cursorToRight(e, els, nodes);
			}
		},

		onKeyDownUp: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				range,
				curPos;

			range = sel.getRangeAt(0);

			// сохраняем данные курсора
			me.cursorData = {
				range: {
					startOffset: range.startOffset,
					startContainer: range.startContainer
				}
			};

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();

			// получаем координаты курсора
			manager = els.node.getManager();
			curPos = manager.getCursorPosition();

			// сохраняем координаты курсора
			me.cursorData.pos = curPos;
		},

		onKeyUpUp: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				curData = me.cursorData,
				isFirstRow = false,
				curPos,
				manager,
				range;

			range = sel.getRangeAt(0);
			range = {
				startOffset: range.startOffset,
				startContainer: range.startContainer
			};

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();

			els.saveNode = curData.range.startContainer.getElement();

			// получаем координаты курсора
			manager = els.node.getManager();
			curPos = manager.getCursorPosition();

			if (els.node.isEmpty() ||
			    range.startOffset === 0 && curPos.x !== curData.pos.x ||
			    range.startOffset === 0 && curData.range.startOffset === 0 &&
			    els.node.elementId === els.saveNode.elementId)
			{
				// находится ли курсор в первой строке
				isFirstRow = true;
			}

			if (isFirstRow)
			{
				// перемещаем курсор на одну строку вверх
				me.cursorToUp();
			}
		},

		onKeyDownDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				range,
				curPos;

			range = sel.getRangeAt(0);

			// сохраняем данные курсора
			me.cursorData = {
				range: {
					startOffset: range.startOffset,
					startContainer: range.startContainer
				}
			};

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();

			// получаем координаты курсора
			manager = els.node.getManager();
			curPos = manager.getCursorPosition();

			// сохраняем координаты курсора
			me.cursorData.pos = curPos;
		},

		onKeyUpDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				curData = me.cursorData,
				isLastRow = false,
				curPos,
				manager,
				range;

			range = sel.getRangeAt(0);
			range = {
				startOffset: range.startOffset,
				startContainer: range.startContainer
			};

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();

			els.saveNode = curData.range.startContainer.getElement();

			// получаем координаты курсора
			manager = els.node.getManager();
			curPos = manager.getCursorPosition();

			els.length = els.node.isText ? els.node.text.length : 0;

			if (els.node.isEmpty() ||
			    els.node.children.length === 1 && els.node.first().isImg ||
				range.startOffset === els.length && curPos.x !== curData.pos.x ||
			    range.startOffset === els.length && curData.range.startOffset === els.length &&
			    els.node.elementId === els.saveNode.elementId)
			{
				// находится ли курсор в последней строке
				isLastRow = true;
			}

			if (isLastRow)
			{
				// перемещаем курсор на одну строку вниз
				me.cursorToDown();
			}
		},

		/**
		 * @private
		 * Перемещает курсор на одну строку вниз.
		 * @param {Object} e
		 * @param {Object} n
		 */
		cursorToDown: function (e, n)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = me.cursorData,
				manager,
				range,
				helper,
				pos,
				lastPos,
				viewportId;

			range = curData.range;
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();

			viewportId = nodes.node.viewportId;
			manager = els.node.getManager();

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// следующий элемент
			els.next = me.getNextElement(els.p);

			if (els.next)
			{
				// Устанавливаем курсор в следующую строку.
				// Для этого необходимо разбить в следующем абзаце все текстовые узлы на отдельные узлы-симовлы.
				// Затем, необходимо получить узел из этого абзаца по кординатам [X, Y].
				// Где X - координата курсора в текущей строке, а Y - координата самого первого элемента в
				// следующем абзаце.
				// Если по заданным координатам нет элемента, то координата X увеличивается или уменьшается до тех пор,
				// пока не будет найден первый попавшийся узел-символ.
				// Получив таким образом узел мы получаем его параметры и устанавливаем на него курсор.

				//console.log('down', curData);

				els.firstDeep = els.next.getDeepFirst();
				helper = els.firstDeep.getNodeHelper();
				nodes.firstDeep = helper.getNode(viewportId);

				if (els.firstDeep.isEmpty())
				{
					els.elem = els.firstDeep;
					els.offset = 0;
				}
				else
				{
					// получаем координаты самого первого символа следующей строки
					pos = helper.getXY(viewportId, 0);

					els.lastDeep = els.next.getDeepLast();
					helper = els.lastDeep.getNodeHelper();
					nodes.lastDeep = helper.getNode(viewportId);

					// получаем координаты самого последнего символа следующей строки
					lastPos = helper.getXY(viewportId, 0);

					//console.log(pos, nodes.firstDeep);

					els.root = manager.getContent();
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);

					els.nextP = els.firstDeep.getStyleHolder();
					helper = els.nextP.getNodeHelper();
					nodes.nextP = helper.getNode(viewportId);

					// разбиваем следующий абзац на отдельные узлы символы
					helper.splitNode(viewportId);

					// координата X будущей позиции курсора
					pos.curX = curData.pos.x;

					// получаем элемент, который находится под будущей позицией курсора
					nodes.elem = document.elementFromPoint(pos.curX, pos.y);
					els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

					//console.log('nodes.elem', nodes.elem);

					while (!nodes.elem || !els.elem && !nodes.elem.getTextElement)
					{
						// прокручиваем скролл, чтобы следующий абзац попал в зону видимости
						nodes.root.scrollTop += me.scrollTopBy;
						pos.y -= me.scrollTopBy;

						nodes.elem = document.elementFromPoint(pos.curX, pos.y);
						els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;
					}

					if (els.elem && els.elem.isImg)
					{
						els.offset = 0;
					}
					else
					{
						if (pos.x > curData.pos.x)
						{
							while (!nodes.elem.getTextElement)
							{
								// ищем позицию символа в следующей строке в правую сторону
								pos.curX += 5;
								nodes.elem = document.elementFromPoint(pos.curX, pos.y);
							}
						}
						else if (lastPos.x < curData.pos.x)
						{
							while (!nodes.elem.getTextElement)
							{
								// ищем позицию символа в следующей строке в левую сторону
								pos.curX -= 5;
								nodes.elem = document.elementFromPoint(pos.curX, pos.y);
							}
						}

						els.elem = nodes.elem.getTextElement();
						els.offset = Number(nodes.elem.getAttribute('data-offset'));
					}

					// собираем разбитый следующий абзац обратно
					helper.joinNode(viewportId);
				}

				// узел элемента
				helper = els.elem.getNodeHelper();
				nodes.elem = helper.getNode(viewportId);

				//console.log(els.offset, nodes.elem);

				//ставим курсор в новую поизцию
				manager.setCursor(
					{
						startNode: nodes.elem,
						startOffset: els.offset
					}
				);

				// синхронизируем кнопки
				manager.syncButtons();
			}
		},

		/**
		 * @private
		 * Перемещает курсор на одну строку вверх.
		 * @param {Object} e
		 * @param {Object} n
		 */
		cursorToUp: function (e, n)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = me.cursorData,
				manager,
				range,
				helper,
				pos,
				viewportId;

			range = curData.range;
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();

			viewportId = nodes.node.viewportId;
			manager = els.node.getManager();

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// предыдущий элемент
			els.prev = me.getPrevElement(els.p);

			if (els.prev)
			{
				// Устанавливаем курсор в предыдущую строку.
				// Для этого необходимо разбить в предыдущием абзаце все текстовые узлы на отдельные узлы-симовлы.
				// Затем, необходимо получить узел из этого абзаца по кординатам [X, Y].
				// Где X - координата курсора в текущей строке, а Y - координата самого последнего элемента в
				// предыдущем абзаце.
				// Если по заданным координатам нет элемента, то координата X увеличивается или уменьшается до тех пор,
				// пока не будет найден первый попавшийся узел-символ.
				// Получив таким образом узел мы получаем его параметры и устанавливаем на него курсор.

				//console.log('up', curData);

				els.lastDeep = els.prev.getDeepLast();
				helper = els.lastDeep.getNodeHelper();
				nodes.lastDeep = helper.getNode(viewportId);

				if (els.lastDeep.isEmpty())
				{
					els.elem = els.lastDeep;
					els.offset = 0;
				}
				else
				{
					// получаем координаты предыдущей строки
					els.length = nodes.lastDeep.length ? nodes.lastDeep.length : 0;
					pos = helper.getXY(viewportId, els.length);

					//console.log(pos, nodes.lastDeep);

					els.root = manager.getContent();
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);

					// разбиваем предыдущий абзац на отдельные узлы символы
					els.prevP = els.lastDeep.getStyleHolder();
					helper = els.prevP.getNodeHelper();
					helper.splitNode(viewportId);

					// координата X будущей позиции курсора
					pos.curX = curData.pos.x;

					// получаем элемент, который находится под будущей позицией курсора
					nodes.elem = document.elementFromPoint(pos.curX, pos.y);
					els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

					while (!nodes.elem || !els.elem && !nodes.elem.getTextElement)
					{
						// прокручиваем скролл, чтобы предыдущий абзац попал в зону видимости
						nodes.root.scrollTop -= me.scrollTopBy;
						pos.y += me.scrollTopBy;

						nodes.elem = document.elementFromPoint(pos.curX, pos.y);
						els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;
					}

					if (els.elem && els.elem.isImg)
					{
						els.offset = 0;
					}
					else if (pos.x > curData.pos.x)
					{
						while (!nodes.elem.getTextElement)
						{
							pos.curX += 5;
							nodes.elem = document.elementFromPoint(pos.curX, pos.y);
						}

						// элемент
						els.elem = nodes.elem.getTextElement();

						// смещение
						els.offset = Number(nodes.elem.getAttribute('data-offset'));
					}
					else
					{
						els.elem = els.lastDeep;
						els.offset = els.lastDeep.text.length;
					}

					// собираем разбитый предыдущий абзац обратно
					helper.joinNode(viewportId);
				}

				// узел элемента
				helper = els.elem.getNodeHelper();
				nodes.elem = helper.getNode(viewportId);

				//console.log(els.offset, nodes.elem);

				//ставим курсор в новую поизцию
				manager.setCursor(
					{
						startNode: nodes.elem,
						startOffset: els.offset
					}
				);

				// синхронизируем кнопки
				manager.syncButtons();
			}
		},

		/**
		 * @private
		 * Перемещает курсор в конец предыдущего абзаца.
		 * @param {Object} evt
		 * @param {Object} e
		 * @param {Object} n
		 */
		cursorToLeft: function (evt, e, n)
		{
			var me = this,
				nodes = n,
				els = e,
				manager,
				helper,
				viewportId;

			manager = els.node.getManager();
			viewportId = nodes.node.viewportId;

			// ищем предыдущий элемент
			els.prev = me.getPrevElement(els.p);

			if (els.prev)
			{
				// перемещаем курсор

				els.lastDeep = els.prev.getDeepLast();
				helper = els.lastDeep.getNodeHelper();
				nodes.lastDeep = helper.getNode(viewportId);

				manager.setCursor(
					{
						startNode: nodes.lastDeep,
						startOffset: nodes.lastDeep.length
					}
				);

				evt.preventDefault();
			}
		},

		/**
		 * @private
		 * Перемещает курсор в начало следующего абзаца.
		 * @param {Object} evt
		 * @param {Object} e
		 * @param {Object} n
		 */
		cursorToRight: function (evt, e, n)
		{
			var me = this,
				nodes = n,
				els = e,
				manager,
				helper,
				viewportId;

			manager = els.node.getManager();
			viewportId = nodes.node.viewportId;

			// ищем следующий абзац
			els.next = me.getNextElement(els.p);

			if (els.next)
			{
				// перемещаем курсор

				els.firstDeep = els.next.getDeepFirst();
				helper = els.firstDeep.getNodeHelper();
				nodes.firstDeep = helper.getNode(viewportId);

				manager.setCursor(
					{
						startNode: nodes.firstDeep
					}
				);

				evt.preventDefault();
			}
		},

		/**
		 * @private
		 * Возвращает предыдущий элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Текущий элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getPrevElement: function (el)
		{
			var els = {};

			els.prev = el.prev();
			els.parent = el.parent;

			while (!els.prev && els.parent)
			{
				els.prev = els.parent.prev();
				els.parent = els.parent.parent;
			}

			return els.prev;
		},

		/**
		 * @private
		 * Возвращает следующий элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Текущий элемент.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getNextElement: function (el)
		{
			var els = {};

			els.next = el.next();
			els.parent = el.parent;

			while (!els.next && els.parent)
			{
				els.next = els.parent.next();
				els.parent = els.parent.parent;
			}

			return els.next;
		}
	}
);