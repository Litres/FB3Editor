/**
 * Переписывает выделение в корневом элементе для WebKit.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootSelectionWebKit',
	{
		extend: 'FBEditor.editor.selection.Selection',

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
		 * Снимаем редактируемость с абзаца.
		 * @param {Object} e
		 */
		outSelection: function (e)
		{
			var me = this;

			me.removeEditable(e);
		},

		/**
		 * Снимаем редактируемость с абзаца.
		 * @param {Object} e
		 */
		overSelection: function (e)
		{
			var me = this;

			me.removeEditable(e);
		},

		/**
		 * @param {Object} e
		 */
		moveSelection: function (e)
		{
		},

		/**
		 * Завершает выделение.
		 * @param {Object} e
		 */
		endSelection: function (e)
		{
		},

		/**
		 * @private
		 * Убирает редактируемость абзаца.
		 * @param {Object} e Событие.
		 */
		removeEditable: function (e)
		{
			var me = this,
				relatedTarget = e.relatedTarget,
				els = {},
				viewportId,
				node;

			// нажата ли левая кнопка мыши
			if (e.which === 1 && e.buttons === 1)
			{
				// элемент, на который перешел курсор мыши
				els.relatedTarget = relatedTarget.getElement ? relatedTarget.getElement() : null;

				// абзац этого элемента
				els.endEl = els.relatedTarget ? me.getParentStyleHolder(els.relatedTarget) : null;

				if (els.endEl)
				{
					viewportId = relatedTarget.viewportId;

					// узел абзаца
					node = els.endEl.nodes[viewportId];

					// убираем редактируемость абзаца
					node.setAttribute('contenteditable', Boolean(false));
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