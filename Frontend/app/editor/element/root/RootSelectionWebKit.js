/**
 * Переписывает выделение в корневом элементе для WebKit.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootSelectionWebKit',
	{
		extend: 'FBEditor.editor.selection.Selection',

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Абзац, на который заходит мышь.
		 */
		pOver: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Абзац, с которого сходит мышь.
		 */
		pOut: null,

		constructor: function (node)
		{
			var me = this;

			// регистрируем событие нажатия кнопки мыши
			node.addEventListener(
				'mousedown',
				function (e)
				{
					// инициализиурет выделение
					me.startSelection(e);
				}
			);

			// регистрируем событие выхода мыши с элемента
			node.addEventListener(
				'mouseout',
				function (e)
				{
					// когда курсор мыши переходит на абзац, то убирается его редактируемость
					me.outSelection(e);
				}
			);

			// регистрируем событие входа мыши на элемент
			node.addEventListener(
				'mouseover',
				function (e)
				{
					// когда курсор мыши покидает абзац, то убирается его редактируемость
					me.overSelection(e);
				}
			);

			// регистрируем событие перемещения курсора мыши
			node.addEventListener(
				'mousemove',
				function (e)
				{
					me.moveSelection(e);
				}
			);

			// регистрируем событие отпускания кнопки мыши
			node.addEventListener(
				'mouseup',
				function (e)
				{
					me.endSelection(e);
				}
			);

			me.callParent(arguments);
		},

		/**
		 * Инициализирует выделение.
		 * @param {Object} e
		 */
		startSelection: function (e)
		{
			var me = this,
				target = e.target,
				els = {},
				nodes = {},
				manager,
				range,
				viewportId,
				helper;

			// элемент под курсором
			els.target = target.getElement ? target.getElement() : null;

			manager = els.target ? els.target.getManager() : null;
			viewportId = target.viewportId;

			if (!e.shiftKey)
			{
				// восстанавливаем редактируемость всех абзацев
				me.enableAllEditable(e);
				manager.selectionToLeft = null;
				manager.selectionToUp = null;
			}
			else
			{
				range = manager ? manager.getRange() : null;

				if (range && range.collapsed)
				{
					// убираем редактируемость начального абзаца

					els.start = range.start.getElement();
					els.p = els.start.getStyleHolder();
					helper = els.p.getNodeHelper();
					nodes.p = helper.getNode(viewportId);
					nodes.p.setAttribute('contenteditable', false);
				}
			}

			if (e.which === 3)
			{
				// запрещаем выделение для правой кнопки мыши
				e.preventDefault();
			}
		},

		/**
		 * Снимает редактируемость с абзаца.
		 * @param {Object} e
		 */
		outSelection: function (e)
		{
			var me = this,
				relatedTarget = e.relatedTarget,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				range,
				manager,
				oldRange,
				viewportId,
				helper;

			range = sel.rangeCount ? sel.getRangeAt(0) : null;
			nodes.common = range ? range.commonAncestorContainer : null;
			els.common = nodes.common && nodes.common.getElement ? nodes.common.getElement() : null;

			// элемент, на который перешел курсор мыши
			els.relatedTarget = relatedTarget && relatedTarget.getElement ? relatedTarget.getElement() : null;

			// абзац этого элемента
			els.p = els.relatedTarget ? els.relatedTarget.getStyleHolder() : null;

			manager = els.p ? els.p.getManager() : null;
			oldRange = manager ? manager.getRange() : null;
			els.start = oldRange && oldRange.start.getElement ? oldRange.start.getElement() : null;

			els.root = els.p ? els.p.getRoot() : null;
			els.rangeRoot = range && range.startContainer.getElement ?
			                range.startContainer.getElement().getRoot() : null;

			// выделение должно происходить в одном и том же корневом элементе
			if (!els.rangeRoot && els.root && els.common || els.root && els.rangeRoot && els.rangeRoot.equal(els.root))
			{
				els.startP = els.start ? els.start.getStyleHolder() : null;

				if (!els.startP ||
				    els.startP && !els.startP.equal(els.p) &&
				    (!me.pOut || !me.pOut.equal(els.p)))
				{
					me.pOut = els.p;
					viewportId = relatedTarget.viewportId;

					// узел абзаца
					helper = els.p.getNodeHelper();
					nodes.p = helper.getNode(viewportId);

					// убираем редактируемость абзаца
					nodes.p.setAttribute('contenteditable', false);
				}
			}
		},

		/**
		 * Снимает редактируемость с абзаца.
		 * @param {Object} e
		 */
		overSelection: function (e)
		{
			var me = this,
				relatedTarget = e.relatedTarget,
				els = {},
				nodes = {},
				sel = window.getSelection(),
				manager,
				range,
				oldRange,
				viewportId,
				helper;

			if (e.which === 1 && e.buttons === 1)
			{
				range = sel.rangeCount ? sel.getRangeAt(0) : null;

				// элемент, с которого перешел курсор мыши
				els.relatedTarget = relatedTarget && relatedTarget.getElement ? relatedTarget.getElement() : null;

				// абзац этого элемента
				els.p = els.relatedTarget ? els.relatedTarget.getStyleHolder() : null;

				manager = els.p ? els.p.getManager() : null;
				oldRange = manager ? manager.getRange() : null;
				els.start = oldRange && oldRange.start.getElement ? oldRange.start.getElement() : null;

				els.root = els.p ? els.p.getRoot() : null;
				els.rangeRoot = range && range.startContainer.getElement ?
				                range.startContainer.getElement().getRoot() : null;

				if (els.root && els.rangeRoot.equal(els.root))
				{
					els.startP = els.start ? els.start.getStyleHolder() : null;

					if (!els.startP ||
					    !me.pOver ||
					    me.pOver && !me.pOver.equal(els.p))
					{
						me.pOver = els.p;
						viewportId = relatedTarget.viewportId;

						// узел абзаца
						helper = els.p.getNodeHelper();
						nodes.p = helper.getNode(viewportId);

						// убираем редактируемость абзаца
						nodes.p.setAttribute('contenteditable', false);
					}
				}
			}
		},

		/**
		 * @param {Object} e
		 */
		moveSelection: function (e)
		{
			//
		},

		/**
		 * Завершает выделение.
		 * @param {Object} e
		 */
		endSelection: function (e)
		{
			var me = this,
				target = e.target,
				els = {},
				nodes = {},
				helper;

			// элемент под курсором
			els.target = target.getElement ? target.getElement() : null;

			/*
			if (els.target)
			{
				els.root = els.target.getRoot();
				helper = els.root.getNodeHelper();
				nodes.root = helper.getNode(target.viewportId);

				// устанавливаем фокус на корневой элемент, чтобы иметь возможность обрабатывать события клавиатуры
				nodes.root.focus();
			}*/

			me.pOver = null;
			me.pOut = null;
		},

		/**
		 * @private
		 * Возвращает редактируемость всех абзацев.
		 * @param {Object} e Событие.
		 */
		enableAllEditable: function (e)
		{
			var me = this,
				target = e.target,
				els = {},
				nodes = {};

			// нажата ли левая кнопка мыши
			if (e.which === 1)
			{
				// элемент под курсором
				els.target = target.getElement ? target.getElement() : null;

				if (els.target)
				{
					// возвращаем редактируемость всех абзацев,
					// у которых она была убрана во время предыдущего выделения

					nodes.pp = document.querySelectorAll('.el-styleholder[contenteditable=false]');

					Ext.Array.each(
						nodes.pp,
						function (p)
						{
							p.setAttribute('contenteditable', true);
						}
					);
				}
			}
		}
	}
);