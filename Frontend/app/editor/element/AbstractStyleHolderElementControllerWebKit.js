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

			manager = els.node.getManager();
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
				me.cursorToPrev(e, els, nodes);
			}
		},

		onKeyDownUp: function (e)
		{
			var me = this;
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

			manager = els.node.getManager();
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
				me.cursorToNext(e, els, nodes);
			}
		},

		onKeyDownDown: function (e)
		{
			var me = this;
		},

		/**
		 * @private
		 * Перемещает курсор в конец предыдущего абзаца.
		 * @property {Object} evt
		 * @property {Object} e
		 * @property {Object} nodes
		 */
		cursorToPrev: function (evt, e, n)
		{
			var me = this,
				nodes = n,
				els = e,
				manager,
				helper,
				viewportId;

			manager = els.node.getManager();
			viewportId = nodes.node.viewportId;

			// ищем предыдущий абзац

			els.prev = els.p.prev();
			els.parent = els.p.parent;

			while (!els.prev && els.parent)
			{
				els.prev = els.parent.prev();
				els.parent = els.parent.parent;
			}

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
		 * @property {Object} evt
		 * @property {Object} e
		 * @property {Object} nodes
		 */
		cursorToNext: function (evt, e, n)
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

			els.next = els.p.next();
			els.parent = els.p.parent;

			while (!els.next && els.parent)
			{
				els.next = els.parent.next();
				els.parent = els.parent.parent;
			}

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
		}
	}
);