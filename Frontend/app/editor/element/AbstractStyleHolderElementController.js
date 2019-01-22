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
				manager = FBEditor.getEditorManager(),
				name = me.getNameElement(),
				isSame,
				cmd,
				range;

			if (e)
			{
				e.preventDefault();
			}
			
			// получаем текущие данные выделения
			range = manager.getRangeCursor();

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
				name = me.getNameElement(),
				manager = FBEditor.getEditorManager(),
				nodes = {},
				els = {},
				viewportId,
				helper,
				cmd,
				range,
				isEnd;

			if (e)
			{
				e.preventDefault();
			}
			
			// получаем текущие данные выделения
			range = manager.getRangeCursor();
			
			//console.log('range del', range);
			
			nodes.node = range.start;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			els.p = els.node.hisName(name) ? els.node : els.node.parent;
			helper = els.p.getNodeHelper();
			nodes.p = helper.getNode(viewportId);

			if (els.node.isEmpty() && nodes.node.firstChild)
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в конце элемента?
			isEnd = range.offset.start === els.node.getText().length;

			//console.log('range, isEnd, nodes', name, range, isEnd, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode ? nodes.node.parentNode : nodes.node;
				els.p = nodes.p.getElement();
			}

			// следующий за текущим
			els.next = els.node.next();

			//console.log('range, isEnd, nodes', range, isEnd, nodes);

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isEnd && !els.next)
			{
				// курсор в конце абзаца

				els.nextP = els.p.next();

				if (!els.nextP || !els.nextP.isStyleHolder)
				{
					// пытаемся подтянуть первый абзац из следующего блока
					cmd = Ext.create('FBEditor.editor.command.' + name + '.GetNextHolderCommand');
				}
				else
				{
					// соединяем абзац со следующим
					cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinNextNodeCommand');
				}

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				els.text = els.node.getDeepFirst();
				
				if (isEnd)
				{
					// курсор находится в конце текущего элемента
					
					helper = els.next.getNodeHelper();
					range.common = helper.getNode(viewportId);
					
					els.text = els.next.getDeepFirst();
					helper = els.text.getNodeHelper();
					range.start = helper.getNode(viewportId);
					
					range.end = range.start;
					range.offset.start = 0;
					range.offset.end = 0;
				}
				
				//console.log('is end', isEnd, range);
				
				// передаем событие текстовому элементу
				els.text.fireEvent('keyDownDelete', e, range);
			}
		},

		onKeyDownBackspace: function (e)
		{
			var me = this,
				name = me.getNameElement(),
				manager = FBEditor.getEditorManager(),
				nodes = {},
				els = {},
				viewportId,
				helper,
				cmd,
				range,
				isStart;
			
			if (e)
			{
				e.preventDefault();
			}
			
			// получаем текущие данные выделения
			range = manager.getRangeCursor();
			
			nodes.node = range.start;
			viewportId = nodes.node.viewportId;
			els.node = nodes.node.getElement();
			nodes.p = nodes.node.parentNode;
			els.p = nodes.p.getElement();

			if (els.node.isEmpty() && els.node.first())
			{
				// пустой элемент
				nodes.node = nodes.node.firstChild;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node;
				els.p = nodes.p.getElement();
			}

			// курсор в начале элемента?
			isStart = range.offset.start === 0;

			//console.log('range, isStart, nodes', range, isStart, nodes);

			// текущий контейнер в параграфе
			while (!els.p.hisName(name))
			{
				nodes.node = nodes.p;
				els.node = nodes.node.getElement();
				nodes.p = nodes.node.parentNode;
				els.p = nodes.p.getElement();
			}

			// элемент перед текущим в абзаце
			els.prev = els.node.prev();

			if (!range.collapsed)
			{
				// удаляем выделенную часть текста
				me.removeRangeNodes();
			}
			else if (isStart && !els.prev)
			{
				// курсор в начале абзаца

				// соединяем абзац с предыдущим
				cmd = Ext.create('FBEditor.editor.command.' + name + '.JoinPrevNodeCommand');

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
			else
			{
				// редактируем текстовый элемент

				els.text = els.node.getDeepLast();
				range.offset.start = range.offset.start - 1;
				
				if (isStart)
				{
					// курсор находится в начале текущего элемента
					
					helper = els.prev.getNodeHelper();
					range.common = helper.getNode(viewportId);
					
					els.text = els.prev.getDeepFirst();
					helper = els.text.getNodeHelper();
					range.start = helper.getNode(viewportId);
					
					range.end = range.start;
					range.offset.start = els.text.getText().length - 1;
					range.offset.end = range.offset.start;
				}
				
				// передаем событие текстовому элементу
				els.text.fireEvent('keyDownBackspace', e, range); 
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
				manager = FBEditor.getEditorManager(),
				els = {},
				isSame,
				range;

			// получаем текущие данные выделения
			range = manager.getRangeCursor();

			els.start = range.start.getElement();
			els.end = range.end.getElement();
			els.startP = els.start.getStyleHolder();
			els.endP = els.end.getStyleHolder();

			isSame = els.startP.equal(els.endP);

			return isSame;
		}
	}
);