/**
 * Кнотроллер корневого элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.root.RootElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.TextModifiedCommand'
		],

		/**
		 * Редактирование текстового узла.
		 * @param {Object} e Событие.
		 * @param {Node} e.target Редактируемый узел.
		 */
		onTextModified: function (e)
		{
			var me = this,
				target = e.target,
				parentNode,
				manager,
				cmd;

			manager = me.getElement().getManager();

			if (manager.isSuspendEvent())
			{
				return;
			}

			parentNode = target.parentNode;

			if (!parentNode.getElement)
			{
				Ext.defer(
					function ()
					{
						this.onTextModified({target: target});
					},
					1,
					me
				);

				return;
			}

			//console.log('DOMCharacterDataModified:', e, me);

			cmd = Ext.create('FBEditor.editor.command.TextModifiedCommand',
				{node: target, newValue: e.newValue, oldValue: e.prevValue});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		onMouseDown: function (e)
		{
			var me = this,
				nodes = {},
				els = {},
				manager,
				helper,
				viewportId;

			nodes.target = e.target;
			els.target = nodes.target.getElement ? nodes.target.getElement() : null;

			if (els.target.isRoot)
			{
				// при клике по пустому корневому элементу ставим курсор в конец строки самого последнего абзаца

				manager = els.target.getManager();
				viewportId = nodes.target.viewportId;

				els.last = els.target.getDeepLast();
				helper = els.last.getNodeHelper();
				nodes.last = helper.getNode(viewportId);
				els.offset = els.last.isText ? els.last.text.length  : 0;

				manager.setCursor(
					{
						startNode: nodes.last,
						startOffset: els.offset
					}
				);

				e.preventDefault();
			}
		},

		onFocus: function (e)
		{
			var me = this,
				els = {},
				nodes = {},
				relatedTarget = e.relatedTarget,
				sel = window.getSelection(),
				manager,
				helper,
				range,
				viewportId;

			els.root = me.getElement();
			manager = els.root.getManager();
			range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
			els.start = range && range.startContainer.getElement ? range.startContainer.getElement() : null;
			els.startRoot = els.start ? els.start.getRoot() : null;

			if (els.startRoot && els.startRoot.equal(els.root))
			{
				// восстановление фокуса не требуется
				return;
			}

			if (relatedTarget &&
			    (!relatedTarget.getElement || !relatedTarget.getElement().getRoot().equal(els.root)))
			{
				// если фокус пришел с другого компонента

				me.enableAllEditable();
				range = manager.getRange();

				if (range)
				{
					console.log(range);
					// восстанавливаем позицию курсора
					manager.restoreCursor();
				}
				else
				{
					// ставим курсор в начало документа

					els.deepFirst = els.root.getDeepFirst();
					helper = els.deepFirst.getNodeHelper();
					viewportId = e.target.viewportId;
					nodes.deepFirst = helper.getNode(viewportId);

					manager.setCursor(
						{
							startNode: nodes.deepFirst
						}
					);

					// прокручиваем скролл в начало документа
					helper = els.root.getNodeHelper();
					nodes.root = helper.getNode(viewportId);
					nodes.root.scrollTop = 0;
				}
			}
		},

		/**
		 * Вставка из буфера обмена.
		 * @param {Object} e Событие.
		 * @param {clipboardData} e.clipboardData Объект буфера.
		 */
		onPaste: function (e)
		{
			var me = this,
				cmd;

			e.preventDefault();
			e.stopPropagation();
			
			cmd = Ext.create('FBEditor.editor.command.PasteCommand', {e: e});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		/**
		 * Вырезание из текста.
		 * @param {Object} e Событие.
		 * @param {ClipboardData} e.clipboardData Объект буфера.
		 */
		onCut: function (e)
		{
			var me = this,
				focus = me.getFocusNode(e.target),
				el,
				cmd;

			//console.log(focus);

			if (focus.nodeName === 'IMG')
			{
				el = focus.getElement();
				el.fireEvent('cut', e);
			}
			else
			{
				e.preventDefault();
				e.stopPropagation();

				cmd = Ext.create('FBEditor.editor.command.CutCommand', {e: e});

				// выполняем команду без сохранения в истории, так как сама команда вызовет другую команду, которая как
				// раз и сохранится в истории
				cmd.execute();
			}
		}
	}
);