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

			// выделяем текст от конечной точки выделения до начала документа

			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
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

			// выделяем текст от начальной точки выделения до конца документа

			e.preventDefault();

			range = sel.getRangeAt(0);
			nodes.node = range.startContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.root = els.node.getRoot();
			els.p = els.node.getStyleHolder();
			manager = els.root.getManager();

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
			}

			// прокручиваем скролл в конец документа
			helper = els.root.getNodeHelper();
			nodes.root = helper.getNode(viewportId);
			nodes.root.scrollTop = nodes.root.scrollHeight;
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
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			nodes.end = range.endContainer;
			els.end = nodes.end.getElement();
			els.endP = els.end.getStyleHolder();
			helper = els.p.getNodeHelper();
			viewportId = nodes.node.viewportId;
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

					if (els.p.equal(els.endP))
					{
						// если выделение находится в одном и том же абзаце,
						// то восстанавливаем редактируемость всех абзацев
						me.enableAllEditable();
					}
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

				els.start = cursor.startNode.getElement();
				els.end = cursor.endNode.getElement();

				if (els.start.equal(els.end) && cursor.startOffset === cursor.endOffset)
				{
					// восстанавливаем редактируемость абзацев, чтобы иметь возможность отобразить курсор
					me.enableAllEditable();
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
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			nodes.end = range.endContainer;
			els.end = nodes.end.getElement();
			els.endP = els.end.getStyleHolder();
			helper = els.p.getNodeHelper();
			viewportId = nodes.node.viewportId;
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
						els.text = els.next.getDeepFirst();
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

				els.start = cursor.startNode.getElement();
				els.end = cursor.endNode.getElement();

				if (els.start.equal(els.end) && cursor.startOffset === cursor.endOffset)
				{
					// восстанавливаем редактируемость абзацев, чтобы иметь возможность отобразить курсор
					me.enableAllEditable();
				}
			}

			manager.setCursor(cursor);
			e.preventDefault();
		},

		onKeyDownShiftUp: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				curData = {},
				needToUp,
				manager,
				helper,
				range,
				viewportId;

			range = sel.getRangeAt(0);
			nodes.start = range.startContainer;
			els.start = nodes.start.getElement();
			els.startP = els.start.getStyleHolder();
			nodes.end = range.endContainer;
			els.end = nodes.end.getElement();
			els.endP = els.end.getStyleHolder();
			viewportId = nodes.start.viewportId;
			manager = els.start.getManager();

			if (manager.isSuspendEvent())
			{
				e.preventDefault();
				return;
			}

			// сохраняем данные курсора перед получением координат, так как они сбросятся
			curData.range = {
				startOffset: range.startOffset,
				startContainer: range.startContainer,
				endContainer: range.endContainer,
				endOffset: range.endOffset
			};

			// координаты выделения
			curData.start = manager.getCursorPosition();
			curData.end = manager.getCursorPosition(true);

			// координаты последнего символа
			els.last = els.endP.getDeepLast();
			helper = els.last.getNodeHelper();
			els.length = els.last.isText ? els.last.getText().length : 0;
			curData.last = helper.getXY(viewportId, els.length);

			// координаты первого символа
			els.first = els.startP.getDeepFirst();
			helper = els.first.getNodeHelper();
			curData.first = helper.getXY(viewportId, 0);

			if (manager.selectionToUp === null ||
			    !manager.selectionToUp && curData.start.y === curData.end.y)
			{
				// выделение регулируется по верхней левой стороне
				manager.selectionToUp = true;
				manager.selectionToLeft = true;
			}

			//console.log(manager.selectionToUp);

			els.node = manager.selectionToUp ? els.startP : els.endP;
			curData.pos = manager.selectionToUp ? curData.start : curData.end;

			needToUp = curData.pos.y === curData.first.y;

			//console.log(needToUp, curData);

			if (els.node.isEmpty() || needToUp)
			{
				e.preventDefault();

				// расширяем выделение на одну строку вверх
				me.selectionToUp(curData);
			}
			else if (!els.node.isEmpty())
			{
				// восстанавливаем выделение
				if (manager.selectionToUp)
				{
					manager.setCursor(
						{
							endNode: curData.range.startContainer,
							endOffset: curData.range.startOffset,
							startNode: curData.range.endContainer,
							startOffset: curData.range.endOffset
						}
					);
				}
				else
				{
					manager.setCursor(
						{
							startNode: curData.range.startContainer,
							startOffset: curData.range.startOffset,
							endNode: curData.range.endContainer,
							endOffset: curData.range.endOffset
						}
					);
				}
			}
		},

		onKeyDownShiftDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				curData = {},
				needToDown,
				manager,
				helper,
				range,
				viewportId;
			
			range = sel.getRangeAt(0);
			nodes.start = range.startContainer;
			viewportId = nodes.start.viewportId;
			els.start = nodes.start.getElement();
			els.startP = els.start.getStyleHolder();
			manager = els.start.getManager();

			if (manager.isSuspendEvent())
			{
				e.preventDefault();
				return;
			}

			nodes.end = range.endContainer;
			els.end = nodes.end.getElement();
			els.endP = els.end.getStyleHolder();

			// сохраняем данные курсора перед получением координат, так как они сбросятся
			curData.range = {
				startContainer: range.startContainer,
				startOffset: range.startOffset,
				endContainer: range.endContainer,
				endOffset: range.endOffset
			};

			// координаты выделения
			curData.start = manager.getCursorPosition();
			curData.end = manager.getCursorPosition(true);

			// координаты последнего символа
			els.last = els.endP.getDeepLast();
			helper = els.last.getNodeHelper();
			els.length = els.last.isText ? els.last.getText().length : 0;
			curData.last = helper.getXY(viewportId, els.length);

			// координаты первого символа
			els.first = els.startP.getDeepFirst();
			helper = els.first.getNodeHelper();
			curData.first = helper.getXY(viewportId, 0);

			if (manager.selectionToUp === null ||
			    manager.selectionToUp && curData.start.y === curData.end.y)
			{
				// выделение регулируется по нижней правой стороне
				manager.selectionToUp = false;
				manager.selectionToLeft = false;
			}

			//console.log(manager.selectionToUp);

			els.node = manager.selectionToUp ? els.startP : els.endP;
			curData.pos = manager.selectionToUp ? curData.start : curData.end;
			needToDown = curData.pos.y === curData.last.y;

			//console.log(needToDown, curData);

			if (els.node.isEmpty() || needToDown)
			{
				e.preventDefault();

				// перемещаем курсор на одну строку вниз
				me.selectionToDown(curData);
			}
			else if (!els.node.isEmpty())
			{
				// восстанавливаем выделение

				if (!manager.selectionToUp)
				{
					manager.setCursor(
						{
							startOffset: curData.range.startOffset,
							startNode: curData.range.startContainer,
							endNode: curData.range.endContainer,
							endOffset: curData.range.endOffset
						}
					);
				}
				else
				{
					manager.setCursor(
						{
							endNode: curData.range.startContainer,
							endOffset: curData.range.startOffset,
							startNode: curData.range.endContainer,
							startOffset: curData.range.endOffset
						}
					);
				}
			}
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

			me.enableAllEditable();
			manager.selectionToLeft = null;
			manager.selectionToUp = null;

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
			manager.selectionToLeft = null;
			manager.selectionToUp = null;

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
				curData = {},
				manager,
				helper,
				range,
				viewportId;

			range = sel.getRangeAt(0);
			nodes.node = range.startContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			manager = els.node.getManager();

			if (manager.isSuspendEvent())
			{
				e.preventDefault();
				return;
			}

			me.enableAllEditable();
			manager.selectionToLeft = null;
			manager.selectionToUp = true;

			if (!range.collapsed)
			{
				manager.setCursor(
					{
						startNode: range.startContainer,
						startOffset: range.startOffset
					}
				);
			}

			// сохраняем данные курсора перед получением координат, так как они сбросятся
			curData.range = {
				startOffset: range.startOffset,
				startContainer: range.startContainer,
				endOffset: range.endOffset,
				endContainer: range.endContainer
			};

			// получаем координаты курсора
			curData.pos = manager.getCursorPosition();

			// получаем координаты первого символа текущего абзаца
			els.first = els.p.getDeepFirst();
			helper = els.first.getNodeHelper();
			curData.pos.first = helper.getXY(viewportId, 0);

			//console.log(curData.pos);

			if (els.node.isEmpty() || curData.pos.y === curData.pos.first.y)
			{
				e.preventDefault();

				// перемещаем курсор на одну строку вверх
				me.cursorToUp(curData);
			}
		},

		onKeyDownDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				nodes = {},
				els = {},
				curData = {},
				manager,
				helper,
				range,
				viewportId;

			range = sel.getRangeAt(0);
			nodes.node = range.endContainer;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.p = els.node.getStyleHolder();
			manager = els.node.getManager();

			if (manager.isSuspendEvent())
			{
				e.preventDefault();
				return;
			}

			me.enableAllEditable();
			manager.selectionToLeft = null;
			manager.selectionToUp = false;

			if (!range.collapsed)
			{
				manager.setCursor(
					{
						startNode: nodes.node,
						startOffset: range.endOffset
					}
				);
			}

			// сохраняем данные курсора перед получением координат, так как они сбросятся
			curData.range = {
				startOffset: range.startOffset,
				startContainer: range.startContainer,
				endOffset: range.endOffset,
				endContainer: range.endContainer
			};

			// получаем координаты курсора
			curData.pos = manager.getCursorPosition(true);

			// получаем координаты последнего символа текущего абзаца
			els.last = els.p.getDeepLast();
			helper = els.last.getNodeHelper();
			els.length = els.node.isText ? els.node.getText().length : 0;
			curData.pos.last = helper.getXY(viewportId, els.length);

			//console.log(curData.pos);

			if (els.node.isEmpty() || curData.pos.y === curData.pos.last.y)
			{
				e.preventDefault();

				// перемещаем курсор на одну строку вниз
				me.cursorToDown(curData);
			}
		},

		/**
		 * @private
		 * Перемещает выделение на одну строку вверх.
		 * @param {Object} data Данные курсора.
		 */
		selectionToUp: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor,
				manager,
				range;

			range = curData.range;
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			// получаем данные курсора для верхней строки
			cursor = me.getCursorUp(curData);

			if (cursor)
			{
				// убираем редактируемость абзацев
				me.disableEditable(cursor.node);
				me.disableEditable(nodes.node);

				// новое выделение

				if (manager.selectionToUp)
				{
					manager.setCursor(
						{
							startNode: cursor.node,
							startOffset: cursor.offset,
							endNode: range.endContainer,
							endOffset: range.endOffset
						}
					);
				}
				else
				{
					els.cur = cursor.node.getElement();

					if (els.cur.equal(els.node))
					{
						// восстанавливаем редактируемость абзацев, чтобы иметь возможность отобразить курсор
						me.enableAllEditable();
					}

					manager.setCursor(
						{
							startNode: range.startContainer,
							startOffset: range.startOffset,
							endNode: cursor.node,
							endOffset: cursor.offset
						}
					);
				}

				// синхронизируем кнопки
				manager.syncButtons();
			}
			else
			{
				// восстанавливаем выделение
				manager.setCursor(
					{
						startNode: range.startContainer,
						startOffset: range.startOffset,
						endNode: range.endContainer,
						endOffset: range.endOffset
					}
				);
			}
		},

		/**
		 * @private
		 * Перемещает выделение на одну строку вверх.
		 * @param {Object} data Данные курсора.
		 */
		selectionToDown: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor,
				manager,
				range;

			range = curData.range;
			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			// получаем данные курсора для нижней строки
			cursor = me.getCursorDown(curData);

			//console.log(cursor);

			if (cursor)
			{
				// убираем редактируемость абзацев
				me.disableEditable(cursor.node);
				me.disableEditable(nodes.node);

				// новое выделение

				if (!manager.selectionToUp)
				{
					manager.setCursor(
						{
							startNode: range.startContainer,
							startOffset: range.startOffset,
							endNode: cursor.node,
							endOffset: cursor.offset
						}
					);
				}
				else
				{
					els.cur = cursor.node.getElement();

					if (els.cur.equal(els.node))
					{
						// восстанавливаем редактируемость абзацев, чтобы иметь возможность отобразить курсор
						me.enableAllEditable();
					}

					manager.setCursor(
						{
							startNode: cursor.node,
							startOffset: cursor.offset,
							endNode: range.endContainer,
							endOffset: range.endOffset
						}
					);
				}

				// синхронизируем кнопки
				manager.syncButtons();
			}
			else
			{
				// восстанавливаем выделение
				manager.setCursor(
					{
						startNode: range.startContainer,
						startOffset: range.startOffset,
						endNode: range.endContainer,
						endOffset: range.endOffset
					}
				);
			}
		},

		/**
		 * @private
		 * Перемещает курсор на одну строку вниз.
		 * @param {Object} data Данные курсора.
		 */
		cursorToDown: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor,
				manager,
				range;

			range = curData.range;
			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			// получаем данные курсора для нижней строки
			cursor = me.getCursorDown(curData);

			if (cursor)
			{
				//ставим курсор в новую поизцию
				manager.setCursor(
					{
						startNode: cursor.node,
						startOffset: cursor.offset
					}
				);

				// синхронизируем кнопки
				manager.syncButtons();
			}
		},

		/**
		 * @private
		 * Перемещает курсор на одну строку вверх.
		 * @param {Object} data Данные курсора.
		 */
		cursorToUp: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor,
				manager,
				range;

			range = curData.range;
			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			manager = els.node.getManager();

			//console.log(curData);

			// получаем данные курсора для верхней строки
			cursor = me.getCursorUp(curData);

			if (cursor)
			{
				//ставим курсор в новую поизцию
				manager.setCursor(
					{
						startNode: cursor.node,
						startOffset: cursor.offset
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
		 * Возвращает данные курсора для верхней строки.
		 * @param {Object} data Данные курсора.
		 * @return {Object} Данные курсора для верхней строки.
		 * @return {Node} Object.node Узел.
		 * @return {Number} Object.offset Смещение.
		 */
		getCursorUp: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor = null,
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

			if (!manager.selectionToUp)
			{
				nodes.node = range.endContainer;
				els.node = nodes.node.getElement();
			}

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// предыдущий элемент
			els.prev = me.getPrevElement(els.p);

			if (els.prev)
			{
				// Получаем данные курсора для верхней строки.
				// Для этого необходимо разбить в предыдущием абзаце все текстовые узлы на отдельные узлы-симовлы.
				// Затем, необходимо получить узел из этого абзаца по кординатам [X, Y].
				// Где X - координата курсора в текущей строке, а Y - координата самого последнего элемента в
				// предыдущем абзаце.
				// Если по заданным координатам нет элемента, то координата X увеличивается или уменьшается до тех пор,
				// пока не будет найден первый попавшийся узел-символ.
				// Получив таким образом узел мы получаем его параметры.

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
					els.length = els.lastDeep.isText ? els.lastDeep.getText().length : 0;
					pos = helper.getXY(viewportId, els.length);

					//console.log(pos, els.length, els.lastDeep);

					els.root = manager.getContent();
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);

					// разбиваем предыдущий абзац на отдельные узлы символы
					els.prevP = els.lastDeep.getStyleHolder();
					helper = els.prevP.getNodeHelper();
					helper.splitNode(viewportId);

					try
					{
						// координата X будущей позиции курсора
						pos.curX = curData.pos.x;

						// получаем элемент, который находится под будущей позицией курсора
						nodes.elem = document.elementFromPoint(pos.curX, pos.y);
						els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

						while (!nodes.elem || !els.elem && !nodes.elem.getTextElement)
						{
							// сбрасываем карту координат символов, так как посл епрокрутки она не актуальна
							els.p.parent.clearMapCoords();

							// прокручиваем скролл, чтобы предыдущий абзац попал в зону видимости
							nodes.root.scrollTop -= me.scrollTopBy;
							pos.y += me.scrollTopBy;

							nodes.elem = document.elementFromPoint(pos.curX, pos.y);
							els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

							if (pos.y > 10000)
							{
								throw Error('Ошибка зацикливания. Не удается прокрутить окно вверх.');
							}
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
					}
					catch (e)
					{
						Ext.log(
							{
								level: 'error',
								msg: 'Не удалось рассчитать координаты курсора для смещения вверх'
							}
						);
					}

					// собираем разбитый предыдущий абзац обратно
					helper.joinNode(viewportId);
				}

				if (els.elem)
				{
					// узел элемента
					helper = els.elem.getNodeHelper();
					nodes.elem = helper.getNode(viewportId);

					cursor = {
						node: nodes.elem,
						offset: els.offset
					};
				}
			}

			return cursor;
		},

		/**
		 * @private
		 * Возвращает данные курсора для нижней строки.
		 * @param {Object} data Данные курсора.
		 * @return {Object} Данные курсора для нижней строки.
		 * @return {Node} Object.node Узел.
		 * @return {Number} Object.offset Смещение.
		 */
		getCursorDown: function (data)
		{
			var me = this,
				nodes = {},
				els = {},
				curData = data,
				cursor = null,
				manager,
				range,
				helper,
				pos,
				viewportId,
				lastPos;

			range = curData.range;
			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();
			viewportId = nodes.node.viewportId;
			manager = els.node.getManager();

			if (manager.selectionToUp)
			{
				nodes.node = range.startContainer;
				els.node = nodes.node.getElement();
			}

			// абзац
			els.p = els.node.isStyleHolder ? els.node : els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			// следующий элемент
			els.next = me.getNextElement(els.p);

			if (els.next)
			{
				// Получаем данные курсора для нижней строки.
				// Для этого необходимо разбить в следующем абзаце все текстовые узлы на отдельные узлы-симовлы.
				// Затем, необходимо получить узел из этого абзаца по кординатам [X, Y].
				// Где X - координата курсора в текущей строке, а Y - координата самого первого элемента в
				// следующем абзаце.
				// Если по заданным координатам нет элемента, то координата X увеличивается или уменьшается до тех пор,
				// пока не будет найден первый попавшийся узел-символ.
				// Получив таким образом узел мы получаем его параметры.

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
					els.lastLength = els.lastDeep.isText ? els.lastDeep.getText().length : 0;

					// получаем координаты самого последнего символа следующей строки
					lastPos = helper.getXY(viewportId, els.lastLength);

					//console.log(pos, nodes.firstDeep);

					els.root = manager.getContent();
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);

					els.nextP = els.firstDeep.getStyleHolder();
					helper = els.nextP.getNodeHelper();
					nodes.nextP = helper.getNode(viewportId);

					// разбиваем следующий абзац на отдельные узлы символы
					helper.splitNode(viewportId);

					try
					{
						// координата X будущей позиции курсора
						pos.curX = curData.pos.x;

						// получаем элемент, который находится под будущей позицией курсора
						nodes.elem = document.elementFromPoint(pos.curX, pos.y);
						els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

						//console.log('nodes.elem', nodes.elem);

						while (!nodes.elem || !els.elem && !nodes.elem.getTextElement)
						{
							// сбрасываем карту координат символов, так как посл епрокрутки она не актуальна
							els.p.parent.clearMapCoords();

							// прокручиваем скролл, чтобы следующий абзац попал в зону видимости
							nodes.root.scrollTop += me.scrollTopBy;
							pos.y -= me.scrollTopBy;

							nodes.elem = document.elementFromPoint(pos.curX, pos.y);
							els.elem = nodes.elem && nodes.elem.getElement ? nodes.elem.getElement() : null;

							if (pos.y < -100)
							{
								throw Error('Ошибка зацикливания. Не удается прокрутить окно вниз.');
							}
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
							//console.log('els.offset', els.offset, nodes.elem);
						}
					}
					catch (e)
					{
						Ext.log(
							{
								level: 'error',
								msg: 'Не удалось рассчитать координаты курсора для смещения вниз'
							}
						);
					}

					// собираем разбитый следующий абзац обратно
					helper.joinNode(viewportId);
				}

				if (els.elem)
				{
					// узел элемента
					helper = els.elem.getNodeHelper();
					nodes.elem = helper.getNode(viewportId);

					cursor = {
						node: nodes.elem,
						offset: els.offset
					};
				}
			}

			return cursor;
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
		 * Убирает редактируемость абзаца.
		 * @param {Node} node Дочерний узел абзаца.
		 */
		disableEditable: function (node)
		{
			var me = this,
				els = {},
				nodes = {},
				helper,
				viewportId;

			els.node = node.getElement();
			viewportId = node.viewportId;
			els.p = els.node.getStyleHolder();
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);
			nodes.p.setAttribute('contenteditable', false);
		}
	}
);