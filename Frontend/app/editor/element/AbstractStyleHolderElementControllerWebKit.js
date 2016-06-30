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

		onKeyDownShiftCtrlHome: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId;

			// выделяем текст от текущей позиции до начала документа

			range = sel.getRangeAt(0);

			if (!range.collapsed)
			{
				return false;
			}

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			els.root = els.node.getRoot();
			els.p = els.node.getStyleHolder();

			manager = els.root.getManager();
			viewportId = nodes.node.viewportId;

			// начальная точка выделения
			els.deepFirst = els.root.getDeepFirst();
			helper = els.deepFirst.getNodeHelper();
			nodes.deepFirst = helper.getNode(viewportId);
			els.firstP = els.deepFirst.getStyleHolder();

			if (els.p.elementId !== els.firstP.elementId)
			{
				// снимаем редактируемость с текущего и первого абзаца

				helper = els.p.getNodeHelper();
				nodes.p = helper.getNode(viewportId);
				nodes.p.setAttribute('contenteditable', false);

				helper = els.firstP.getNodeHelper();
				nodes.firstP = helper.getNode(viewportId);
				nodes.firstP.setAttribute('contenteditable', false);

				// выделяем текст
				manager.setCursor(
					{
						startNode: nodes.deepFirst,
						startOffset: 0,
						endNode: nodes.node,
						endOffset: range.endOffset
					}
				);

				// прокручиваем скролл в начало документа
				helper = els.root.getNodeHelper();
				nodes.root = helper.getNode(viewportId);
				nodes.root.scrollTop = 0;

				e.preventDefault();
			}
		},

		onKeyDownShiftCtrlEnd: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId;

			// выделяем текст от текущей позиции до конца документа

			range = sel.getRangeAt(0);

			if (!range.collapsed)
			{
				return false;
			}

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			els.root = els.node.getRoot();
			els.p = els.node.getStyleHolder();

			manager = els.root.getManager();
			viewportId = nodes.node.viewportId;

			// конечная точка выделения
			els.deepLast = els.root.getDeepLast();
			helper = els.deepLast.getNodeHelper();
			nodes.deepLast = helper.getNode(viewportId);
			els.endOffset = els.deepLast.isText ? els.deepLast.text.length : 0;
			els.lastP = els.deepLast.getStyleHolder();

			if (els.p.elementId !== els.lastP.elementId)
			{
				// снимаем редактируемость с текущего и последнего абзаца

				helper = els.p.getNodeHelper();
				nodes.p = helper.getNode(viewportId);
				nodes.p.setAttribute('contenteditable', false);

				helper = els.lastP.getNodeHelper();
				nodes.lastP = helper.getNode(viewportId);
				nodes.lastP.setAttribute('contenteditable', false);

				// выделяем текст
				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.startOffset,
						endNode: nodes.deepLast,
						endOffset: els.endOffset
					}
				);

				// прокручиваем скролл в конец документа
				helper = els.root.getNodeHelper();
				nodes.root = helper.getNode(viewportId);
				nodes.root.scrollTop = nodes.root.scrollHeight;

				e.preventDefault();
			}
		},

		onKeyDownCtrlHome: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId;

			// ставим курсор в начало документа

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

			manager.setCursor(
				{
					startNode: nodes.deepFirst,
					startOffset: 0
				}
			);

			// прокручиваем скролл в начало документа
			helper = els.root.getNodeHelper();
			nodes.root = helper.getNode(viewportId);
			nodes.root.scrollTop = 0;

			e.preventDefault();
		},

		onKeyDownCtrlEnd: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId;

			// ставим курсор в начало документа

			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			els.root = els.node.getRoot();

			manager = els.root.getManager();
			viewportId = nodes.node.viewportId;

			// конечная точка выделения
			els.deepLast = els.root.getDeepLast();
			helper = els.deepLast.getNodeHelper();
			nodes.deepLast = helper.getNode(viewportId);
			els.endOffset = els.deepLast.isText ? els.deepLast.text.length : 0;

			manager.setCursor(
				{
					startNode: nodes.deepLast,
					startOffset: els.endOffset
				}
			);

			// прокручиваем скролл в конец документа
			helper = els.root.getNodeHelper();
			nodes.root = helper.getNode(viewportId);
			nodes.root.scrollTop = nodes.root.scrollHeight;

			e.preventDefault();
		},

		onKeyDownShiftLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				cursor,
				manager,
				helper,
				range,
				viewportId;

			// увеличиваем выделение на один символ в левую сторону

			range = sel.getRangeAt(0);
			nodes.node = range.startContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);
			manager = els.node.getManager();

			cursor = {
				startNode: range.startContainer,
				startOffset: range.startOffset,
				endNode: range.endContainer,
				endOffset: range.endOffset
			};

			if (range.collapsed)
			{
				// выделение регулируется по левой стороне
				manager.selectionToLeft = true;

				nodes.p.setAttribute('contenteditable', false);
			}

			if (manager.selectionToLeft)
			{
				// регулируем выделение по левой стороне

				if (cursor.startOffset === 0)
				{
					// перемещаем начальную точку выделения к предпоследнему символу предыдущего текстового узла

					els.text = null;
					els.prev = me.getPrevElement(els.node);

					while (!els.text && els.prev)
					{
						els.text = els.prev.getDeepLast();
						els.prev = me.getPrevElement(els.text);
						els.text = els.text.isText ? els.text : null;
					}

					if (els.text)
					{
						helper = els.text.getNodeHelper();
						nodes.text = helper.getNode(viewportId);

						cursor.startNode = nodes.text;
						cursor.startOffset = els.text.getText().length - 1;

						els.prevP = els.text.getStyleHolder();

						if (!els.p.equal(els.prevP))
						{
							helper = els.prevP.getNodeHelper();
							nodes.prevP = helper.getNode(viewportId);
							nodes.prevP.setAttribute('contenteditable', false);
						}
					}
				}
				else
				{
					cursor.startOffset--;
				}
			}
			else
			{
				// регулируем выделение по правой стороне

				if (cursor.endOffset === 0)
				{
					// перемещаем конечную точку выделения к предпоследнему символу предыдущего текстового узла

					els.text = null;
					els.node = cursor.endNode.getElement();
					els.prev = me.getPrevElement(els.node);

					while (!els.text && els.prev)
					{
						els.text = els.prev.getDeepLast();
						els.prev = me.getPrevElement(els.text);
						els.text = els.text.isText ? els.text : null;
					}

					if (els.text)
					{
						helper = els.text.getNodeHelper();
						nodes.text = helper.getNode(viewportId);

						cursor.endNode = nodes.text;
						cursor.endOffset = els.text.getText().length - 1;
					}
				}
				else
				{
					cursor.endOffset--;
				}
			}

			manager.setCursor(cursor);
			e.preventDefault();
		},

		onKeyDownShiftRight: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				cursor,
				manager,
				helper,
				range,
				viewportId;

			// увеличиваем выделение на один символ в правую сторону

			range = sel.getRangeAt(0);
			nodes.node = range.endContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);
			manager = els.node.getManager();

			if (range.collapsed)
			{
				// выделение регулируется по правой стороне
				manager.selectionToLeft = false;

				nodes.p.setAttribute('contenteditable', false);
			}

			cursor = {
				startNode: range.startContainer,
				startOffset: range.startOffset,
				endNode: range.endContainer,
				endOffset: range.endOffset
			};

			if (range.collapsed)
			{
				manager.selectionToLeft = false;
				nodes.p.setAttribute('contenteditable', false);
			}

			if (!manager.selectionToLeft)
			{
				// регулируем выделение по правой стороне

				if (cursor.endOffset === els.node.getText().length)
				{
					// перемещаем конечную точку выделения ко второму символу следующего текстового узла

					els.text = null;
					els.next = me.getNextElement(els.node);

					while (!els.text && els.next)
					{
						els.text = els.next.getDeepLast();
						els.next = me.getNextElement(els.text);
						els.text = els.text.isText ? els.text : null;
					}

					if (els.text)
					{
						helper = els.text.getNodeHelper();
						nodes.text = helper.getNode(viewportId);

						cursor.endNode = nodes.text;
						cursor.endOffset = 1;

						els.nextP = els.text.getStyleHolder();

						if (!els.p.equal(els.nextP))
						{
							helper = els.nextP.getNodeHelper();
							nodes.nextP = helper.getNode(viewportId);
							nodes.nextP.setAttribute('contenteditable', false);
						}
					}
				}
				else
				{
					cursor.endOffset++;
				}
			}
			else
			{
				// регулируем выделение по левой стороне

				els.node = cursor.startNode.getElement();

				if (cursor.startOffset === els.node.getText().length)
				{
					// перемещаем начальную точку выделения ко второму символу следующего текстового узла

					els.text = null;
					els.next = me.getNextElement(els.node);

					while (!els.text && els.next)
					{
						els.text = els.next.getDeepLast();
						els.next = me.getNextElement(els.text);
						els.text = els.text.isText ? els.text : null;
					}

					if (els.text)
					{
						helper = els.text.getNodeHelper();
						nodes.text = helper.getNode(viewportId);

						cursor.startNode = nodes.text;
						cursor.startOffset = 1;
					}
				}
				else
				{
					cursor.startOffset++;
				}
			}

			manager.setCursor(cursor);
			e.preventDefault();
		},

		onKeyDownLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				manager,
				helper,
				range,
				viewportId,
				isStart;

			range = sel.getRangeAt(0);
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			viewportId = nodes.node.viewportId;
			manager = els.node.getManager();

			if (!e.shiftKey)
			{
				me.enableAllEditable();
			}

			if (!range.collapsed)
			{
				// оставляем курсор в начальной точке

				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.startOffset
					}
				);

				e.preventDefault();

				return;
			}

			// абзац
			els.p = els.node.getStyleHolder();
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
				manager,
				helper,
				range,
				viewportId,
				isEnd;

			range = sel.getRangeAt(0);
			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			viewportId = nodes.node.viewportId;
			manager = els.node.getManager();

			me.enableAllEditable();

			if (!range.collapsed)
			{
				// оставляем курсор в конечной точке

				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.endOffset
					}
				);

				e.preventDefault();

				return;
			}
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
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			me.enableAllEditable();

			if (!range.collapsed)
			{
				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.startOffset
					}
				);
			}

			// сохраняем данные курсора
			me.cursorData = {
				range: {
					startOffset: range.startOffset,
					startContainer: range.startContainer
				}
			};

			// получаем координаты курсора
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
			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			me.enableAllEditable();

			if (!range.collapsed)
			{
				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.endOffset
					}
				);
			}

			// сохраняем данные курсора
			me.cursorData = {
				range: {
					startOffset: range.endOffset,
					startContainer: range.endContainer
				}
			};

			// получаем координаты курсора
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
		},

		/**
		 * @private
		 * Возвращает редактируемость всех абзацев.
		 */
		enableAllEditable: function ()
		{
			var me = this,
				nodes = {};

			nodes.pp = document.querySelectorAll('.el-p[contenteditable=false]');

			Ext.Array.each(
				nodes.pp,
				function (p)
				{
					p.setAttribute('contenteditable', true);
				}
			);
		}
	}
);