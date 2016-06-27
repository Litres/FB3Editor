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
			}
			else
			{
				range = manager ? manager.getRange() : null;

				if (range && range.collapsed)
				{
					// убираем редактируемость начального абзаца

					els.start = range.start.getElement();
					els.p = me.getParentStyleHolder(els.start);
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
				target = e.target,
				relatedTarget = e.relatedTarget,
				els = {},
				nodes = {},
				manager,
				range,
				viewportId,
				helper;

			// элемент, на который перешел курсор мыши
			els.relatedTarget = relatedTarget && relatedTarget.getElement ? relatedTarget.getElement() : null;

			// абзац этого элемента
			els.p = els.relatedTarget ? me.getParentStyleHolder(els.relatedTarget) : null;

			manager = els.p ? els.p.getManager() : null;
			range = manager ? manager.getRange() : null;
			els.start = range && range.start.getElement ? range.start.getElement() : null;

			if (els.p)
			{
				els.startP = me.getParentStyleHolder(els.start);

				if (!els.startP ||
				    els.startP.elementId !== els.p.elementId &&
				    (!me.pOut || me.pOut.elementId !== els.p.elementId))
				{
					//console.log(els.p, me.pOut, els.startP);
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
				manager,
				range,
				viewportId,
				helper;

			if (e.which === 1 && e.buttons === 1)
			{
				// элемент, с которого перешел курсор мыши
				els.relatedTarget = relatedTarget && relatedTarget.getElement ? relatedTarget.getElement() : null;

				// абзац этого элемента
				els.p = els.relatedTarget ? me.getParentStyleHolder(els.relatedTarget) : null;

				manager = els.p ? els.p.getManager() : null;
				range = manager ? manager.getRange() : null;
				els.start = range && range.start.getElement ? range.start.getElement() : null;

				if (els.p)
				{
					els.startP = me.getParentStyleHolder(els.start);

					if (!els.startP ||
					    !me.pOver ||
					    me.pOver && me.pOver.elementId !== els.p.elementId)
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

			if (els.target)
			{
				els.root = els.target.getRoot();
				helper = els.root.getNodeHelper();
				nodes.root = helper.getNode(target.viewportId);

				// устанавливаем фокус на корневой элемент, чтобы иметь возможность обрабатывать события клавиатуры
				nodes.root.focus();
			}

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
		},

		/**
		 * @private
		 * Возвращает родительский абзац для элемента.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент под курсором.
		 * @return {FBEditor.editor.element.AbstractStyleHolderElement}
		 */
		getParentStyleHolder: function (el)
		{
			while (el && !el.isStyleHolder)
			{
				el = el.parent;
			}

			return el;
		}
	}
);