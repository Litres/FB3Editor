/**
 * Абстрактный контроллер элемента содержажащего в себе стилевые элементы.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractStyleHolderElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',

		onKeyDownEnter: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				isSame,
				cmd,
				range;

			e.preventDefault();

			range = sel.getRangeAt(0);

			// в одном ли абзаце выделение
			isSame = me.sameStyleHolder();

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}

			if (isSame)
			{
				// разбиваем элемент на два в позиции курсора
				cmd = Ext.create('FBEditor.editor.command.' + name + '.SplitNodeCommand');

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
		},

		onKeyDownDelete: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				nodes = {},
				els = {},
				manager = me.getElement().getManager(),
				cmd,
				range,
				isEnd;

			e.preventDefault();

			range = sel.getRangeAt(0);

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			nodes.p = nodes.node.parentNode;
			els.p = nodes.p.getElement();

			if (els.node.isEmpty() && nodes.node.firstChild)
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в конце элемента?
			isEnd = range.startOffset === els.node.getText().length;

			//console.log('range, isEnd, nodes', range, isEnd, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();
			}

			// следующий за текущим
			nodes.next = nodes.node.nextSibling;

			//console.log('range, isEnd, nodes', range, isEnd, nodes);

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isEnd && !nodes.next)
			{
				// курсор в конце параграфа

				// соединяем параграф со следующим
				cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinNextNodeCommand');

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				nodes.text = isEnd ? nodes.next : nodes.node;
				nodes.text = manager.getDeepFirst(nodes.text);

				// ставим курсор в текст
				manager.setCursor(
					{
						startNode: nodes.text,
						startOffset: isEnd ? 0 : range.startOffset
					}
				);

				// передаем событие текстовому элементу
				nodes.text.getElement().fireEvent('keyDownDelete', e);
			}
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				name = me.getNameElement(),
				nodes = {},
				els = {},
				manager = me.getElement().getManager(),
				cmd,
				range,
				isStart;

			e.preventDefault();

			range = sel.getRangeAt(0);

			nodes.node = range.startContainer;
			els.node = nodes.node.getElement();
			nodes.p = nodes.node.parentNode;
			els.p = nodes.p.getElement();

			if (els.node.isEmpty() && nodes.node.firstChild)
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в начале элемента?
			isStart = range.startOffset === 0;

			//console.log('range, isStart, nodes', range, isStart, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();
			}

			// элемент перед текущим в параграфе
			nodes.prev = nodes.node.previousSibling;

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isStart && !nodes.prev)
			{
				// курсор в начале параграфа

				// соединяем параграф с предыдущим
				cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinPrevNodeCommand');

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				nodes.text = isStart ? nodes.prev : nodes.node;
				nodes.text = manager.getDeepLast(nodes.text);
				els.text = nodes.text.getElement();

				// ставим курсор в текст
				manager.setCursor(
					{
						startNode: nodes.text,
						startOffset: isStart ? els.text.getText().length : range.startOffset - 1
					}
				);

				// передаем событие текстовому элементу
				nodes.text.getElement().fireEvent('keyDownBackspace', e);
			}
		},

		/**
		 * @private
		 * Удаляет выделенную часть текста.
		 */
		removeRangeNodes: function ()
		{
			var me = this,
				el = me.el;

			el.removeRangeNodes();
		},

		/**
		 * @private
		 * Определяет, находится ли выделение в одном абзаце.
		 * @return {Boolean}
		 */
		sameStyleHolder: function ()
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				isSame,
				range;

			range = sel.getRangeAt(0);

			els.start = range.startContainer.getElement();
			els.end = range.endContainer.getElement();
			els.startP = els.start.getStyleHolder();
			els.endP = els.end.getStyleHolder();

			isSame = els.startP.equal(els.endP);

			return isSame;
		}
	}
);